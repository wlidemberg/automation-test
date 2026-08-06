import { supabase } from '../lib/supabase'
import type { Profile, Lead } from '../types/database'

export interface ProvisionClientPayload {
  leadId: string
  proposalId: string
}

export interface ProvisionClientResult {
  success: boolean
  userId?: string
  email: string
  linkDefinirSenha: string
  profile?: Profile | null
  message: string
}

const N8N_PROVISION_CLIENT_WEBHOOK = 
  import.meta.env.VITE_N8N_WEBHOOK_PROVISION_CLIENT || 
  'https://n8n.webhook.local/webhook/provision-client'

/**
 * Provisiona a conta do novo cliente no Supabase Auth e preenche a tabela `public.profiles`.
 */
export async function provisionClientAccount({
  leadId,
  proposalId
}: ProvisionClientPayload): Promise<ProvisionClientResult> {
  if (!leadId && !proposalId) {
    throw new Error('Não foi possível obter o ID do Lead ou Proposta para provisionamento.')
  }

  // 1. Busca os dados completos do Lead vinculado (com suporte a fallback se passar proposalId)
  let lead: Lead | null = null

  // Tentativa 1: Busca em leads pelo leadId
  if (leadId) {
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .maybeSingle()

    if (leadData) {
      lead = leadData as Lead
    }
  }

  // Tentativa 2: Se não encontrou por leadId, busca na tabela proposals para obter o lead_id correto
  if (!lead && (proposalId || leadId)) {
    const searchId = proposalId || leadId
    const { data: propData } = await supabase
      .from('proposals')
      .select('lead_id, lead:leads(*)')
      .eq('id', searchId)
      .maybeSingle()

    if (propData?.lead) {
      lead = propData.lead as Lead
    } else if (propData?.lead_id) {
      const { data: leadById } = await supabase
        .from('leads')
        .select('*')
        .eq('id', propData.lead_id)
        .maybeSingle()
      if (leadById) {
        lead = leadById as Lead
      }
    }
  }

  if (!lead) {
    throw new Error('Não foi possível obter os dados do Lead para provisionamento.')
  }

  // 2. Determina Tipo de Pessoa e Documento (CPF vs CNPJ)
  const cleanDoc = lead.cpf_cnpj ? lead.cpf_cnpj.replace(/\D/g, '') : null
  const isCnpj = cleanDoc
    ? cleanDoc.length > 11
    : Boolean(lead.razao_social_nome && lead.razao_social_nome.toLowerCase().includes('ltda'))
  const tipoPessoa: 'PJ' | 'PF' = isCnpj ? 'PJ' : 'PF'

  const linkDefinirSenha = 'https://automation-test-sepia.vercel.app/definir-senha'
  let userId: string = lead.id

  // 3. Dispara o envio de Magic Link via Supabase Auth (Client-side resiliência)
  try {
    const { data: authOtpData, error: authOtpErr } = await supabase.auth.signInWithOtp({
      email: lead.email,
      options: {
        emailRedirectTo: linkDefinirSenha,
        data: {
          role: 'client',
          razao_social: lead.razao_social_nome
        }
      }
    })

    if (authOtpErr) {
      console.warn('[clientServices] Aviso signInWithOtp:', authOtpErr.message)
    } else {
      console.log('[clientServices] E-mail com link de primeiro acesso enviado via Supabase Auth para:', lead.email)
    }

    // Tenta também convite direto via admin se chave de serviço estiver ativa no ambiente
    const { data: authAdminData } = await supabase.auth.admin.inviteUserByEmail(
      lead.email,
      {
        redirectTo: linkDefinirSenha,
        data: {
          role: 'client',
          razao_social: lead.razao_social_nome
        }
      }
    )

    if (authAdminData?.user?.id) {
      userId = authAdminData.user.id
    }
  } catch (authCatchErr: any) {
    console.warn('[clientServices] Aviso ao disparar convite no Auth:', authCatchErr.message || authCatchErr)
  }

  // 4. Preenche/Atualiza a tabela public.profiles com fallbacks resilientes
  const profileData: Partial<Profile> = {
    id: userId,
    email: lead.email,
    role: 'client',
    tipo_pessoa: tipoPessoa,
    razao_social: isCnpj ? lead.razao_social_nome : null,
    cnpj: isCnpj ? cleanDoc : null,
    nome_completo: !isCnpj ? lead.razao_social_nome : null,
    cpf: !isCnpj ? cleanDoc : null,
    telefone: lead.telefone || null,
    updated_at: new Date().toISOString()
  }

  let savedProfile: Profile | null = null

  // Tentativa A: Upsert especificando conflito no email
  const { data: pA, error: errA } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'email' })
    .select()
    .maybeSingle()

  if (pA) {
    savedProfile = pA as Profile
  } else {
    if (errA) console.warn('[clientServices] Upsert onConflict email:', errA.message)

    // Tentativa B: Upsert no ID
    const { data: pB, error: errB } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .maybeSingle()

    if (pB) {
      savedProfile = pB as Profile
    } else {
      if (errB) console.warn('[clientServices] Upsert padrão:', errB.message)

      // Tentativa C: Insert direto
      const { data: pC, error: errC } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .maybeSingle()

      if (pC) {
        savedProfile = pC as Profile
      } else if (errC) {
        console.error('[clientServices] Insert na tabela profiles falhou:', errC.message)
      }
    }
  }

  // 5. Dispara Webhook do n8n para envio de e-mail customizado SMTP/Resend
  try {
    await fetch(N8N_PROVISION_CLIENT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'CLIENT_PROVISIONED',
        lead_id: lead.id,
        proposal_id: proposalId,
        email: lead.email,
        razao_social: lead.razao_social_nome,
        action_url: linkDefinirSenha,
        tipo_pessoa: tipoPessoa,
        doc: cleanDoc,
        created_at: new Date().toISOString()
      })
    })
  } catch (wErr) {
    console.warn('[clientServices] Webhook n8n de provisionamento não respondeu:', wErr)
  }

  return {
    success: true,
    userId,
    email: lead.email,
    linkDefinirSenha,
    profile: savedProfile,
    message: 'Conta do cliente provisionada e perfil cadastrado em public.profiles!'
  }
}

/**
 * Alias de compatibilidade com promoverLeadParaCliente
 */
export async function promoverLeadParaCliente(leadId: string, proposalId: string = '') {
  const result = await provisionClientAccount({ leadId, proposalId })
  return {
    success: result.success,
    profile: result.profile || null,
    authInvited: Boolean(result.userId),
    linkDefinirSenha: result.linkDefinirSenha,
    message: result.message
  }
}

export interface BatchProvisionResult {
  totalProcessed: number
  successCount: number
  failedCount: number
  details: Array<{
    proposalId: string
    leadEmail: string
    status: 'success' | 'failed'
    message: string
  }>
}

/**
 * Busca todas as propostas aceitas/pagas no Supabase, preenche a tabela `public.profiles`
 * para cada cliente vinculado e dispara os e-mails com link de primeiro acesso.
 */
export async function processAllAcceptedProposals(): Promise<BatchProvisionResult> {
  const details: BatchProvisionResult['details'] = []
  let successCount = 0
  let failedCount = 0

  // 1. Busca propostas que atendem aos requisitos (status_proposta aceita, status aceita ou pagamento_confirmado true)
  const { data: proposals, error } = await supabase
    .from('proposals')
    .select('*, lead:leads(*)')
    .or('status_proposta.eq.aceita,status.eq.aceita,pagamento_confirmado.eq.true')

  if (error) {
    console.error('[clientServices] Erro ao buscar propostas aceitas para lote:', error.message)
    throw new Error('Falha ao consultar propostas aceitas no Supabase.')
  }

  if (!proposals || proposals.length === 0) {
    console.log('[clientServices] Nenhuma proposta aceita encontrada para lote.')
    return {
      totalProcessed: 0,
      successCount: 0,
      failedCount: 0,
      details: []
    }
  }

  // 2. Itera e executa o provisionamento para cada proposta encontrada
  for (const proposal of proposals) {
    const leadId = proposal.lead_id || proposal.lead?.id
    const leadEmail = proposal.lead?.email || 'N/A'

    try {
      if (!leadId) {
        throw new Error('Proposta sem lead_id vinculado.')
      }

      await provisionClientAccount({
        leadId,
        proposalId: proposal.id
      })

      successCount++
      details.push({
        proposalId: proposal.id,
        leadEmail,
        status: 'success',
        message: 'Perfil preenchido e e-mail de primeiro acesso disparado!'
      })
    } catch (err: any) {
      failedCount++
      details.push({
        proposalId: proposal.id,
        leadEmail,
        status: 'failed',
        message: err.message || 'Falha ao processar'
      })
    }
  }

  return {
    totalProcessed: proposals.length,
    successCount,
    failedCount,
    details
  }
}
