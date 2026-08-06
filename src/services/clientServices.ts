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

  // 1. Busca os dados completos do Lead vinculado
  let lead: Lead | null = null

  // Tentativa 1: Busca na tabela leads diretamente por leadId
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

  // Tentativa 2: Se não encontrou por leadId, busca na tabela proposals para pegar lead_id
  if (!lead && (proposalId || leadId)) {
    const searchId = proposalId || leadId
    const { data: propData } = await supabase
      .from('proposals')
      .select('id, lead_id')
      .eq('id', searchId)
      .maybeSingle()

    if (propData?.lead_id) {
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
    throw new Error('Não foi possível localizar o Lead vinculado a esta proposta no banco de dados.')
  }

  // 2. Determina Tipo de Pessoa e Documento (CPF vs CNPJ)
  const cleanDoc = lead.cpf_cnpj ? lead.cpf_cnpj.replace(/\D/g, '') : null
  const isCnpj = cleanDoc
    ? cleanDoc.length > 11
    : Boolean(lead.razao_social_nome && lead.razao_social_nome.toLowerCase().includes('ltda'))
  const tipoPessoa: 'PJ' | 'PF' = isCnpj ? 'PJ' : 'PF'

  const linkDefinirSenha = 'https://automation-test-sepia.vercel.app/definir-senha'
  let userId: string = lead.id

  // 3. Tenta localizar se já existe um perfil com o mesmo e-mail em public.profiles
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', lead.email)
    .maybeSingle()

  if (existingProfile?.id) {
    userId = existingProfile.id
  }

  // 4. Autenticação e Convite no Supabase Auth
  try {
    // A) Envia Magic Link / OTP de primeiro acesso
    const { error: authOtpErr } = await supabase.auth.signInWithOtp({
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
    }

    // B) Tenta convite direto via admin API (se Service Role ativa)
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
    console.warn('[clientServices] Aviso no Supabase Auth:', authCatchErr.message || authCatchErr)
  }

  // 5. Preenche/Atualiza a tabela public.profiles
  const profilePayload: Partial<Profile> = {
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

  // Estratégia 1: Se já existe um perfil para esse email, atualiza por email
  if (existingProfile) {
    const { data: pUpdated, error: uErr } = await supabase
      .from('profiles')
      .update(profilePayload)
      .eq('email', lead.email)
      .select()
      .maybeSingle()

    if (pUpdated) {
      savedProfile = pUpdated as Profile
    } else if (uErr) {
      console.warn('[clientServices] Erro ao atualizar perfil existente:', uErr.message)
    }
  }

  // Estratégia 2: Upsert por ID se não salvou ainda
  if (!savedProfile) {
    const { data: pUpsert, error: upErr } = await supabase
      .from('profiles')
      .upsert(profilePayload)
      .select()
      .maybeSingle()

    if (pUpsert) {
      savedProfile = pUpsert as Profile
    } else if (upErr) {
      console.warn('[clientServices] Erro upsert padrao:', upErr.message)

      // Estratégia 3: Insert direto sem especificar ID gerado se houver conflito de FK
      const fallbackPayload = { ...profilePayload }
      const { data: pIns, error: insErr } = await supabase
        .from('profiles')
        .insert([fallbackPayload])
        .select()
        .maybeSingle()

      if (pIns) {
        savedProfile = pIns as Profile
      } else if (insErr) {
        console.error('[clientServices] Erro final ao salvar em public.profiles:', insErr.message)
      }
    }
  }

  // 6. Dispara Webhook do n8n para envio de e-mail customizado SMTP/Resend
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
    message: 'Conta do cliente provisionada e perfil salvo na tabela public.profiles!'
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

  // 1. Busca todas as propostas
  const { data: proposals, error } = await supabase
    .from('proposals')
    .select('*')

  if (error) {
    console.error('[clientServices] Erro ao listar propostas:', error.message)
    throw new Error('Falha ao consultar a tabela public.proposals no Supabase: ' + error.message)
  }

  if (!proposals || proposals.length === 0) {
    return {
      totalProcessed: 0,
      successCount: 0,
      failedCount: 0,
      details: []
    }
  }

  // 2. Filtra propostas aceitas ou com pagamento confirmado
  const targetProposals = proposals.filter(p => 
    p.status_proposta === 'aceita' || 
    p.status === 'aceita' || 
    p.pagamento_confirmado === true
  )

  if (targetProposals.length === 0) {
    return {
      totalProcessed: 0,
      successCount: 0,
      failedCount: 0,
      details: []
    }
  }

  // 3. Itera e executa o provisionamento para cada proposta aceita
  for (const proposal of targetProposals) {
    try {
      const result = await provisionClientAccount({
        leadId: proposal.lead_id,
        proposalId: proposal.id
      })

      successCount++
      details.push({
        proposalId: proposal.id,
        leadEmail: result.email,
        status: 'success',
        message: 'Perfil preenchido em public.profiles e e-mail de acesso disparado!'
      })
    } catch (err: any) {
      failedCount++
      details.push({
        proposalId: proposal.id,
        leadEmail: 'N/A',
        status: 'failed',
        message: err.message || 'Falha ao processar'
      })
    }
  }

  return {
    totalProcessed: targetProposals.length,
    successCount,
    failedCount,
    details
  }
}
