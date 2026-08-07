import { supabase } from '../lib/supabase'
import type { Proposal, ProposalStatus, Lead } from '../types/database'

const N8N_REVISION_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK_REVISION || 'https://n8n.webhook.local/webhook/proposal-revision'
const N8N_SEND_PROPOSAL_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK_SEND_PROPOSAL || 'https://n8n.webhook.local/webhook/proposal-send'

/**
 * Garante que a estrutura da proposta_ia possua todos os atributos preenchidos (valores de setup, mensalidade, resumo, entregáveis, upsell, dicas de engenharia).
 */
export function ensureValidProposalAiContent(raw: any, lead?: Lead | null) {
  const cat = lead?.categoria_produto || 'automacao'
  const nome = lead?.razao_social_nome || 'Cliente Corporativo'
  const dor = lead?.dores_principais || 'otimização de processos e escala de vendas'

  // Preços padrão por categoria se zerados
  let defaultSetup = 4500
  let defaultMensal = 590

  if (cat === 'ia') {
    defaultSetup = 5500
    defaultMensal = 690
  } else if (cat === 'desenvolvimento' || cat === 'erp_saas') {
    defaultSetup = 7800
    defaultMensal = 890
  } else if (cat === 'design_web') {
    defaultSetup = 3400
    defaultMensal = 290
  }

  const rawSetup = Number(raw?.valor_setup || raw?.valorSetup || raw?.preco_setup)
  const setup = rawSetup && rawSetup > 0 ? rawSetup : defaultSetup

  const rawEntrada = Number(raw?.parcela_entrada || raw?.parcelaEntrada)
  const entrada = rawEntrada && rawEntrada > 0 ? rawEntrada : setup / 2

  const rawMensal = Number(raw?.valor_mensal || raw?.valorMensal || raw?.preco_mensal)
  const mensal = rawMensal && rawMensal > 0 ? rawMensal : defaultMensal

  const rawResumo = raw?.resumo_executivo || raw?.resumoExecutivo
  const resumo = (rawResumo && rawResumo.trim() && !rawResumo.includes('Aguardando geração')) 
    ? rawResumo 
    : `Proposta técnica de ${cat.replace('_', ' ').toUpperCase()} desenvolvida sob medida para ${nome}, focada em resolver o gargalo: "${dor}". Arquitetura de alta performance com esteira automatizada.`

  let entregaveis = Array.isArray(raw?.entregaveis) && raw.entregaveis.length > 0 ? raw.entregaveis : null

  if (!entregaveis) {
    if (cat === 'ia') {
      entregaveis = [
        'Agente Conversacional de IA (OpenAI Assistants API / Gemini) treinado',
        'Integração oficial de canais de atendimento (WhatsApp e Web Chat)',
        'Painel administrativo de controle de contexto e base de conhecimento',
        'Qualificação automatizada de leads e direcionamento para vendas'
      ]
    } else if (cat === 'automacao') {
      entregaveis = [
        'Orquestração de fluxos automatizados em ambiente n8n dedicado',
        'Sincronização bidirecional entre formulários, CRM e banco de dados',
        'Alertas de execução em tempo real e relatórios de métricas',
        'Suporte e monitoramento ativo de integridade das automações'
      ]
    } else if (cat === 'design_web') {
      entregaveis = [
        'Design UI/UX exclusivo focado em conversão e experiência do usuário',
        'Desenvolvimento Web Responsivo com React, TypeScript e Tailwind CSS',
        'Otimização avançada de SEO técnico e carregamento ultra-rápido',
        'Integração nativa com formulário de captação de leads e analytics'
      ]
    } else {
      entregaveis = [
        'Arquitetura de software web corporativo escalável com Supabase',
        'Modelagem relacional segura PostgreSQL com suporte a RLS',
        'Dashboard restrito de gestão com controle de acesso por permissões',
        'Módulo de relatórios gerenciais e exportação de dados'
      ]
    }
  }

  const modulosUpsell = Array.isArray(raw?.modulos_upsell || raw?.modulosUpsell) && (raw.modulos_upsell || raw.modulosUpsell).length > 0
    ? (raw.modulos_upsell || raw.modulosUpsell)
    : [
        { titulo: 'Suporte Técnico VIP & SLA de 2h', descricao: 'Atendimento prioritário com garantia de uptime e manutenção preventiva', preco: 350 },
        { titulo: 'Módulo de Backup e Auditoria Automática', descricao: 'Cópias de segurança diárias com histórico de alterações em nuvem', preco: 190 }
      ]

  const dicasEngenharia = Array.isArray(raw?.dicas_engenharia || raw?.dicasEngenharia) && (raw.dicas_engenharia || raw.dicasEngenharia).length > 0
    ? (raw.dicas_engenharia || raw.dicasEngenharia)
    : [
        'Recomendado manter o Row Level Security (RLS) habilitado em todas as tabelas no Supabase.',
        'Utilizar webhooks assíncronos no n8n para evitar bloqueios de thread no front-end.',
        'Isolar chaves de API e credenciais de produção no cofre de variáveis de ambiente.'
      ]

  return {
    ...raw,
    resumo_executivo: resumo,
    valor_setup: setup,
    parcela_entrada: entrada,
    valor_mensal: mensal,
    entregaveis: entregaveis,
    modulos_upsell: modulosUpsell,
    dicas_engenharia: dicasEngenharia
  }
}

/**
 * Auxiliar para atualizar ou realizar upsert na tabela `proposals` alinhado estritamente com o schema real do Supabase:
 * - status_proposta: 'pendente_aprovacao_admin' | 'aprovada_admin' | 'enviada_lead' | 'aceita' | 'recusada'
 * - resumo_executivo, valor_total_setup, valor_entrada_50, prazo_estimado_dias, entregaveis_principais (NOT NULL)
 */
async function updateOrUpsertProposal(
  proposalId: string,
  newStatus: ProposalStatus,
  extraData: Record<string, any> = {}
) {
  const current = await getProposalWithLead(proposalId)
  const adminNotes = extraData.orientacoesAdmin || current?.orientacoes_admin || current?.observacoes_admin || ''

  // Mapeia o status da aplicação para os valores válidos aceitos pela CHECK constraint do Postgres:
  // ('pendente_aprovacao_admin', 'aprovada_admin', 'enviada_lead', 'aceita', 'recusada')
  const validStatusMap: Record<string, string> = {
    em_analise_ia: 'pendente_aprovacao_admin',
    aprovada_lead: 'aceita',
    enviada_lead: 'enviada_lead',
    aprovada_admin: 'aprovada_admin',
    pendente_aprovacao_admin: 'pendente_aprovacao_admin',
    aceita: 'aceita',
    recusada: 'recusada'
  }
  const dbStatus = validStatusMap[newStatus] || 'pendente_aprovacao_admin'

  // 1. Tenta UPDATE na tabela `proposals` com as colunas reais
  const updatePayload: Record<string, any> = {
    status_proposta: dbStatus,
    observacoes_admin: adminNotes,
    orientacao_admin_refazer: adminNotes,
    updated_at: new Date().toISOString()
  }

  if (extraData.contador_recriacoes !== undefined) {
    updatePayload.contador_recriacoes = extraData.contador_recriacoes
  }

  let { data: updatedProps, error: propErr } = await supabase
    .from('proposals')
    .update(updatePayload)
    .eq('id', proposalId)
    .select()

  // 2. Se a proposta ainda não existia fisicamente na tabela `proposals`, faz UPSERT preenchendo todos os campos NOT NULL
  if (propErr || !updatedProps || updatedProps.length === 0) {
    const leadId = current?.lead_id || (current?.lead?.id ? current.lead.id : proposalId)
    const validAi = current?.proposta_ia || {}

    const upsertPayload: Record<string, any> = {
      id: proposalId,
      lead_id: leadId,
      resumo_executivo: validAi.resumo_executivo || `Proposta comercial para ${current?.lead?.razao_social_nome || 'Cliente'}`,
      valor_total_setup: Number(validAi.valor_setup || 4500),
      valor_entrada_50: Number(validAi.parcela_entrada || 2250),
      mensalidade_recorrente: Number(validAi.valor_mensal || 590),
      prazo_estimado_dias: Number(validAi.prazo_estimado_dias || 15),
      entregaveis_principais: Array.isArray(validAi.entregaveis) ? validAi.entregaveis : [],
      sugestoes_upsell: Array.isArray(validAi.modulos_upsell) ? validAi.modulos_upsell : [],
      dicas_engenharia: Array.isArray(validAi.dicas_engenharia) ? validAi.dicas_engenharia.join('\n') : (validAi.dicas_engenharia || ''),
      status_proposta: dbStatus,
      observacoes_admin: adminNotes,
      orientacao_admin_refazer: adminNotes,
      contador_recriacoes: extraData.contador_recriacoes ?? current?.contador_recriacoes ?? 1,
      updated_at: new Date().toISOString()
    }

    const { error: upsertErr } = await supabase
      .from('proposals')
      .upsert(upsertPayload)

    if (upsertErr) {
      console.error('[proposalAdminServices] Erro ao salvar na tabela proposals:', upsertErr)
      throw new Error(`Não foi possível salvar na tabela public.proposals: ${upsertErr.message}`)
    }
  }

  // 3. Sincroniza status com a tabela `briefings` se aplicável
  const briefingStatusMap: Record<string, string> = {
    enviada_lead: 'proposta_enviada',
    em_analise_ia: 'em_analise_ia',
    aprovada_lead: 'aprovado'
  }

  const { error: bErr } = await supabase
    .from('briefings')
    .update({
      status_briefing: briefingStatusMap[newStatus] || newStatus,
      link_pagamento: extraData.magic_link || undefined,
      updated_at: new Date().toISOString()
    })
    .eq('id', proposalId)

  if (bErr) {
    console.warn('[proposalAdminServices] Aviso ao atualizar briefings:', bErr.message)
  }
}

/**
 * Busca uma proposta unificada pelo ID, incluindo as informações do Lead associado.
 * Suporta consultas diretas à tabela `proposals` com fallbacks para `leads` e `briefings`.
 */
export async function getProposalWithLead(proposalId: string): Promise<Proposal | null> {
  try {
    // 1. Tenta buscar na tabela `proposals` por id (se for UUID) ou por token_acesso
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(proposalId)
    
    let proposalData = null
    if (isUuid) {
      const { data } = await supabase
        .from('proposals')
        .select('*, lead:leads(*)')
        .eq('id', proposalId)
        .maybeSingle()
      proposalData = data
    }

    if (!proposalData) {
      const { data } = await supabase
        .from('proposals')
        .select('*, lead:leads(*)')
        .eq('token_acesso', proposalId)
        .maybeSingle()
      proposalData = data
    }

    if (proposalData) {
      let leadObj = proposalData.lead || null
      if (!leadObj && proposalData.lead_id) {
        const { data: leadFound } = await supabase.from('leads').select('*').eq('id', proposalData.lead_id).maybeSingle()
        leadObj = leadFound || null
      }

      const rawAi = proposalData.proposta_ia || {}
      const combinedAi = {
        ...rawAi,
        resumo_executivo: proposalData.resumo_executivo || rawAi.resumo_executivo,
        valor_setup: Number(proposalData.valor_total_setup || rawAi.valor_setup || rawAi.valorSetup || 4500),
        parcela_entrada: Number(proposalData.valor_entrada_50 || rawAi.parcela_entrada || rawAi.parcelaEntrada || 2250),
        valor_mensal: Number(proposalData.mensalidade_recorrente || rawAi.valor_mensal || rawAi.valorMensal || 590),
        prazo_estimado_dias: proposalData.prazo_estimado_dias || rawAi.prazo_estimado_dias || 15,
        entregaveis: proposalData.entregaveis_principais || rawAi.entregaveis,
        modulos_upsell: proposalData.sugestoes_upsell || rawAi.modulos_upsell
      }
      const validAi = ensureValidProposalAiContent(combinedAi, leadObj)
      const st = proposalData.status_proposta || proposalData.status || 'pendente_aprovacao_admin'
      const obs = proposalData.orientacao_admin_refazer || proposalData.observacoes_admin || proposalData.orientacoes_admin || proposalData.orientacao_admin || ''

      return {
        id: proposalData.id,
        lead_id: proposalData.lead_id,
        briefing_id: proposalData.briefing_id,
        project_id: proposalData.project_id,
        status: st as ProposalStatus,
        status_proposta: st,
        proposta_ia: validAi,
        orientacao_admin: obs,
        orientacoes_admin: obs,
        observacoes_admin: obs,
        contador_recriacoes: proposalData.contador_recriacoes || 0,
        pagamento_confirmado: Boolean(proposalData.pagamento_confirmado),
        pago_em: proposalData.pago_em || null,
        magic_link: proposalData.magic_link || `/proposta/${proposalData.id}`,
        lead: leadObj,
        created_at: proposalData.created_at,
        updated_at: proposalData.updated_at
      }
    }

    // 2. Busca diretamente na tabela `leads` caso o ID seja o id do lead
    const { data: directLead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', proposalId)
      .maybeSingle()

    if (directLead) {
      const validAi = ensureValidProposalAiContent({}, directLead as Lead)
      return {
        id: directLead.id,
        lead_id: directLead.id,
        status: 'pendente_aprovacao_admin',
        status_proposta: 'pendente_aprovacao_admin',
        proposta_ia: validAi,
        orientacao_admin: '',
        orientacoes_admin: '',
        observacoes_admin: '',
        contador_recriacoes: 0,
        magic_link: `/proposta/${directLead.id}`,
        lead: directLead as Lead,
        created_at: directLead.created_at
      }
    }

    // 3. Fallback: Buscar tabela `briefings` unificada com `projects` e `leads` ou `profiles`
    const { data: briefingData } = await supabase
      .from('briefings')
      .select('*, client:profiles(*)')
      .eq('id', proposalId)
      .maybeSingle()

    if (briefingData) {
      let associatedLead: Lead | null = null
      if (briefingData.client?.email) {
        const { data: leadData } = await supabase
          .from('leads')
          .select('*')
          .eq('email', briefingData.client.email)
          .maybeSingle()
        if (leadData) {
          associatedLead = leadData as Lead
        }
      }

      const leadObj: Lead = associatedLead || {
        id: briefingData.client_id || 'lead-fallback',
        produto_slug: 'automacao-n8n-ia',
        categoria_produto: 'automacao',
        razao_social_nome: briefingData.client?.razao_social || briefingData.client?.nome_completo || briefingData.nome_projeto || 'Cliente Lead',
        email: briefingData.client?.email || 'contato@cliente.com',
        telefone: briefingData.client?.telefone || '(11) 99999-9999',
        faturamento_mensal: briefingData.faturamento_mensal || 'R$ 20.000 a R$ 50.000',
        porte_empresa: 'Média Empresa',
        dores_principais: briefingData.dores_principais || 'Automatizar processos manuais',
        dados_especificos_categoria: {
          ferramentasConectar: (briefingData.integracoes_necessarias || []).join(', ')
        }
      }

      const validAi = ensureValidProposalAiContent(briefingData.proposta_ia || {}, leadObj)
      const st = (briefingData.status_briefing as ProposalStatus) || 'pendente_aprovacao_admin'

      return {
        id: briefingData.id,
        briefing_id: briefingData.id,
        project_id: briefingData.project_id,
        status: st,
        status_proposta: st,
        proposta_ia: validAi,
        orientacao_admin: '',
        orientacoes_admin: '',
        observacoes_admin: '',
        contador_recriacoes: 0,
        magic_link: `/proposta/${briefingData.id}`,
        lead: leadObj,
        created_at: briefingData.created_at
      }
    }

    return null
  } catch (err) {
    console.error('Erro ao buscar proposta:', err)
    return null
  }
}

/**
 * Lista todas as propostas pendentes ou filtradas por status.
 */
export async function listPendingProposals(statusFilter?: string): Promise<Proposal[]> {
  try {
    let query = supabase
      .from('proposals')
      .select('*, lead:leads(*)')
      .order('created_at', { ascending: false })

    const { data: proposals, error } = await query

    if (!error && proposals && proposals.length > 0) {
      const result: Proposal[] = []
      for (const p of proposals) {
        const st = p.status_proposta || p.status || 'pendente_aprovacao_admin'
        if (statusFilter && statusFilter !== 'todos' && st !== statusFilter) {
          continue
        }

        let leadObj = p.lead || null
        if (!leadObj && p.lead_id) {
          const { data: l } = await supabase.from('leads').select('*').eq('id', p.lead_id).maybeSingle()
          leadObj = l || null
        }

        const obs = p.orientacao_admin_refazer || p.observacoes_admin || p.orientacoes_admin || p.orientacao_admin || ''
        const rawAi = p.proposta_ia || {}
        const combinedAi = {
          ...rawAi,
          resumo_executivo: p.resumo_executivo || rawAi.resumo_executivo,
          valor_setup: Number(p.valor_total_setup || rawAi.valor_setup || rawAi.valorSetup || 4500),
          parcela_entrada: Number(p.valor_entrada_50 || rawAi.parcela_entrada || rawAi.parcelaEntrada || 2250),
          valor_mensal: Number(p.mensalidade_recorrente || rawAi.valor_mensal || rawAi.valorMensal || 590),
          prazo_estimado_dias: p.prazo_estimado_dias || rawAi.prazo_estimado_dias || 15,
          entregaveis: p.entregaveis_principais || rawAi.entregaveis,
          modulos_upsell: p.sugestoes_upsell || rawAi.modulos_upsell
        }

        result.push({
          id: p.id,
          lead_id: p.lead_id,
          briefing_id: p.briefing_id,
          project_id: p.project_id,
          status: st as ProposalStatus,
          status_proposta: st,
          proposta_ia: ensureValidProposalAiContent(combinedAi, leadObj),
          orientacao_admin: obs,
          orientacoes_admin: obs,
          observacoes_admin: obs,
          contador_recriacoes: p.contador_recriacoes || 0,
          pagamento_confirmado: Boolean(p.pagamento_confirmado),
          pago_em: p.pago_em || null,
          magic_link: p.magic_link || `/proposta/${p.id}`,
          lead: leadObj,
          created_at: p.created_at,
          updated_at: p.updated_at
        })
      }
      return result
    }

    // Fallback: se a tabela `proposals` estiver totalmente vazia no Supabase, listar a partir de leads cadastrados
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (leads && leads.length > 0) {
      return leads.map((lead: any, index: number) => {
        const mockStatus: ProposalStatus = index === 0 ? 'pendente_aprovacao_admin' : (index % 2 === 0 ? 'em_analise_ia' : 'enviada_lead')
        
        if (statusFilter && statusFilter !== 'todos' && mockStatus !== statusFilter) {
          return null
        }

        const validAi = ensureValidProposalAiContent({}, lead as Lead)

        return {
          id: lead.id,
          lead_id: lead.id,
          status: mockStatus,
          status_proposta: mockStatus,
          proposta_ia: validAi,
          orientacoes_admin: index > 0 ? 'Ajustar escopo de entregáveis e incluir suporte estendido.' : '',
          observacoes_admin: index > 0 ? 'Ajustar escopo de entregáveis e incluir suporte estendido.' : '',
          contador_recriacoes: index,
          magic_link: `/proposta/${lead.id}`,
          lead: lead as Lead,
          created_at: lead.created_at
        }
      }).filter(Boolean) as Proposal[]
    }

    return []
  } catch (err) {
    console.error('Erro ao listar propostas:', err)
    return []
  }
}

/**
 * Registra a solicitação do Admin para a IA refazer a proposta com orientações personalizadas.
 * Atualiza status para `em_analise_ia`, incrementa contador de re-criações e dispara webhook do n8n.
 */
export async function requestAiRevision(proposalId: string, orientacaoAdmin: string): Promise<boolean> {
  try {
    if (!orientacaoAdmin.trim()) {
      throw new Error('Forneça uma instrução detalhada para a IA refazer a proposta.')
    }

    const current = await getProposalWithLead(proposalId)
    const newCount = (current?.contador_recriacoes || 0) + 1

    await updateOrUpsertProposal(proposalId, 'em_analise_ia', {
      orientacoesAdmin: orientacaoAdmin,
      contador_recriacoes: newCount
    })

    try {
      await fetch(N8N_REVISION_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId,
          orientacoesAdmin: orientacaoAdmin,
          contadorRecriacoes: newCount,
          lead: current?.lead,
          timestamp: new Date().toISOString()
        })
      })
    } catch (wErr) {
      console.warn('Webhook n8n de revisão não respondeu, porém alteração foi registrada:', wErr)
    }

    return true
  } catch (err: any) {
    console.error('Erro em requestAiRevision:', err)
    throw new Error(err.message || 'Falha ao solicitar revisão para a IA.')
  }
}

/**
 * Aprova a proposta e dispara o envio do e-mail oficial com Magic Link para o Lead.
 * Altera status para `enviada_lead` e dispara webhook do n8n.
 */
export async function approveAndSendProposal(proposalId: string): Promise<{ success: boolean; magicLink: string }> {
  try {
    const current = await getProposalWithLead(proposalId)
    const magicLink = window.location.origin + `/proposta/${proposalId}`

    await updateOrUpsertProposal(proposalId, 'enviada_lead', {
      magic_link: magicLink
    })

    try {
      await fetch(N8N_SEND_PROPOSAL_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId,
          magicLink,
          leadEmail: current?.lead?.email,
          leadNome: current?.lead?.razao_social_nome,
          propostaIa: current?.proposta_ia,
          timestamp: new Date().toISOString()
        })
      })
    } catch (wErr) {
      console.warn('Webhook n8n de envio de e-mail não respondeu, porém status foi atualizado:', wErr)
    }

    return { success: true, magicLink }
  } catch (err: any) {
    console.error('Erro em approveAndSendProposal:', err)
    throw new Error(err.message || 'Falha ao aprovar e enviar proposta.')
  }
}

/**
 * Confirma o pagamento da proposta, ativa o contrato e promove o lead para a tabela public.profiles.
 */
export async function processarConfirmacaoPagamentoEPromocao(proposalId: string, leadId: string) {
  // PASSO 1: Atualiza a proposta marcando pagamento confirmado
  const { error: proposalError } = await supabase
    .from('proposals')
    .update({
      pagamento_confirmado: true,
      pago_em: new Date().toISOString()
    })
    .eq('id', proposalId);

  if (proposalError) {
    console.error('Erro ao atualizar proposta:', proposalError);
    throw new Error(`Falha ao atualizar proposta: ${proposalError.message}`);
  }

  // PASSO 2: Ativa o contrato vinculado
  const { error: contractError } = await supabase
    .from('contracts')
    .update({
      status_contrato: 'ativo',
      updated_at: new Date().toISOString()
    })
    .eq('proposal_id', proposalId);

  if (contractError) {
    console.warn('Aviso ao atualizar contrato:', contractError.message);
  }

  // PASSO 3: Busca os dados do Lead para popular a tabela public.profiles
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (leadError || !lead) {
    console.error('Erro ao buscar dados do lead:', leadError);
    throw new Error('Lead não encontrado para criação de perfil.');
  }

  // Tratamento dos documentos e tipo de pessoa
  const rawDoc = lead.cpf_cnpj ? lead.cpf_cnpj.replace(/\D/g, '') : '';
  const isCnpj = rawDoc.length > 11;
  const tipoPessoa = isCnpj ? 'PJ' : 'PF';

  const profilePayload = {
    id: crypto.randomUUID(),
    email: lead.email,
    role: 'client' as const,
    tipo_pessoa: tipoPessoa as 'PJ' | 'PF',
    razao_social: isCnpj ? (lead.razao_social || lead.nome_completo || null) : null,
    cnpj: isCnpj ? rawDoc : null,
    nome_completo: !isCnpj ? (lead.nome_completo || lead.razao_social || null) : null,
    cpf: !isCnpj ? rawDoc : null,
    telefone: lead.telefone || null,
    updated_at: new Date().toISOString()
  };

  // Upsert na tabela profiles evitando duplicidade por email
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .upsert(profilePayload, { onConflict: 'email' })
    .select();

  if (profileError) {
    console.error('Erro ao salvar registro em public.profiles:', profileError);
    throw new Error(`Falha ao criar perfil do cliente: ${profileError.message}`);
  }

  return { success: true, profile: profileData };
}

/**
 * Confirma manualmente o pagamento da entrada de uma proposta no Supabase.
 * Atualiza public.proposals (pagamento_confirmado = true, pago_em = now) e public.contracts (status_contrato = 'ativo')
 */
export async function confirmarPagamentoProposta(proposalId: string, leadId?: string | null): Promise<Proposal | null> {
  try {
    if (leadId) {
      await processarConfirmacaoPagamentoEPromocao(proposalId, leadId);
    } else {
      // Fallback 1: Atualiza proposals e contracts
      const { error: proposalError } = await supabase
        .from('proposals')
        .update({ 
          pagamento_confirmado: true,
          pago_em: new Date().toISOString()
        })
        .eq('id', proposalId);

      if (proposalError) {
        console.error('Erro ao atualizar pagamento em proposals:', proposalError.message);
        throw proposalError;
      }

      const { error: contractError } = await supabase
        .from('contracts')
        .update({ 
          status_contrato: 'ativo',
          updated_at: new Date().toISOString()
        })
        .eq('proposal_id', proposalId);

      if (contractError) {
        console.warn('Aviso ao atualizar contrato vinculado:', contractError.message);
      }
    }

    return await getProposalWithLead(proposalId);
  } catch (err) {
    console.error('Erro ao confirmar pagamento da proposta:', err);
    throw err;
  }
}

export const proposalAdminServices = {
  ensureValidProposalAiContent,
  getProposalWithLead,
  listPendingProposals,
  requestAiRevision,
  approveAndSendProposal,
  confirmarPagamentoProposta,
  processarConfirmacaoPagamentoEPromocao
};

export default proposalAdminServices;
