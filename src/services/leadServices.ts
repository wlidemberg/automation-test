import { supabase } from '../lib/supabase';
import { createBriefing, triggerN8NBriefingWebhook } from './briefingServices';

export interface ProposalPayload {
  tipoPessoa: 'PF' | 'PJ';
  nomeRazao: string;
  email: string;
  telefone: string;
  cpfCnpj?: string;
  produtoSlug: string;
  nomeProjeto: string;
  corPrimaria?: string;
  corSecundaria?: string;
  tomDeVoz?: string;
  faturamentoMensal?: string;
  qtdFuncionarios?: number;
  qtdSocios?: number;
  publicoAlvo?: string;
  doresPrincipais: string;
  funcionalidadesEsperadas?: string[];
  integracoesNecessarias?: string[];
}

export async function submitProposalRequest(payload: ProposalPayload) {
  try {
    // 1. Busca se já existe um perfil com o e-mail informado
    const { data: existingProfile, error: searchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', payload.email)
      .maybeSingle();

    if (searchError) {
      console.error('Erro ao buscar perfil existente:', searchError.message);
    }

    let clientId = existingProfile?.id;

    // 2. Se não existir, cria o novo perfil em estado PENDENTE com os dados corretos
    if (!clientId) {
      const newId = crypto.randomUUID();
      const cleanedDoc = payload.cpfCnpj?.replace(/[^\d]/g, '') || null;
      
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newId,
          email: payload.email,
          role: 'client',
          status: 'pendente',
          tipo_pessoa: payload.tipoPessoa,
          nome_completo: payload.tipoPessoa === 'PF' ? payload.nomeRazao : null,
          razao_social: payload.tipoPessoa === 'PJ' ? payload.nomeRazao : null,
          cpf: payload.tipoPessoa === 'PF' ? cleanedDoc : null,
          cnpj: payload.tipoPessoa === 'PJ' ? cleanedDoc : null,
          telefone: payload.telefone,
        })
        .select()
        .single();

      if (profileError) {
        console.error('Erro crítico ao inserir em profiles:', profileError.message);
        throw new Error(`Falha ao registrar cliente: ${profileError.message}`);
      }

      clientId = newProfile.id;
    }

    // 3. Busca o ID do produto pelo slug para associar
    let productId = null;
    if (payload.produtoSlug) {
      const { data: matchedProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', payload.produtoSlug)
        .maybeSingle();
      if (matchedProduct) {
        productId = matchedProduct.id;
      }
    }

    // 4. Cadastra o projeto na tabela projects vinculada ao cliente
    const projectId = crypto.randomUUID();
    const { error: projectError } = await supabase
      .from('projects')
      .insert({
        id: projectId,
        client_id: clientId,
        product_id: productId,
        nome: payload.nomeProjeto || `Solicitação: ${payload.produtoSlug.toUpperCase()}`,
        tipo: 'projeto_custom',
        descricao_briefing: payload.doresPrincipais,
        valor_setup_acordado: 0,
        valor_mensal_acordado: 0,
        fase_atual: 'proposta_pendente',
        progresso: 0,
      });

    if (projectError) {
      console.error('Erro crítico ao inserir em projects:', projectError.message);
      throw new Error(`Falha ao registrar projeto: ${projectError.message}`);
    }

    // 5. Salva o briefing na tabela briefings
    const briefing = await createBriefing({
      client_id: clientId,
      project_id: projectId,
      nome_projeto: payload.nomeProjeto || payload.nomeRazao,
      cor_primaria: payload.corPrimaria || '#CCFF00',
      cor_secundaria: payload.corSecundaria || '#050505',
      tom_de_voz: payload.tomDeVoz || '',
      faturamento_mensal: payload.faturamentoMensal || '',
      qtd_socios: Number(payload.qtdSocios) || 1,
      qtd_funcionarios: Number(payload.qtdFuncionarios) || 1,
      publico_alvo: payload.publicoAlvo || '',
      dores_principais: payload.doresPrincipais,
      funcionalidades_esperadas: payload.funcionalidadesEsperadas || [],
      integracoes_necessarias: payload.integracoesNecessarias || [],
      status_briefing: 'em_analise_ia'
    });

    if (!briefing) {
      throw new Error('Falha ao inserir registro na tabela briefings.');
    }

    // 6. Dispara o Webhook do N8N
    const webhookSuccess = await triggerN8NBriefingWebhook(briefing);
    if (!webhookSuccess) {
      console.warn('Webhook n8n retornou erro ou não pôde ser contatado.');
    }

    return { success: true, projectId, briefingId: briefing.id };
  } catch (err: any) {
    console.error('Falha real na submissão unificada:', err.message || err);
    throw err;
  }
}
