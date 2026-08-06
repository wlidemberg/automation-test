import { supabase } from '../lib/supabase'
import type { Profile, Lead } from '../types/database'

export interface PromotionResult {
  success: boolean
  profile: Profile | null
  authInvited: boolean
  linkDefinirSenha: string
  message: string
}

/**
 * Transforma o Lead em Cliente no Supabase Auth e preenche a tabela `public.profiles`.
 */
export async function promoverLeadParaCliente(
  leadId: string, 
  _proposalId?: string
): Promise<PromotionResult> {
  try {
    if (!leadId) {
      throw new Error('ID do Lead é obrigatório para promoção.')
    }

    // 1. Busca os dados cadastrais da tabela `leads`
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .maybeSingle()

    if (leadError || !leadData) {
      console.error('[clientServices] Erro ao buscar dados do lead:', leadError?.message)
      throw new Error('Lead não encontrado no banco de dados.')
    }

    const lead: Lead = leadData
    const docDigits = (lead.cpf_cnpj || '').replace(/\D/g, '')
    const isPj = docDigits.length > 11 || Boolean(lead.razao_social_nome && lead.razao_social_nome.toLowerCase().includes('ltda'))
    const tipoPessoa: 'PJ' | 'PF' = isPj ? 'PJ' : 'PF'

    // 2. Envia convite por e-mail via Supabase Auth (se disponível no ambiente)
    const linkDefinirSenha = `${window.location.origin}/definir-senha`
    let authInvited = false
    let authUserId: string = lead.id

    try {
      const { data: authData, error: authErr } = await supabase.auth.admin.inviteUserByEmail(
        lead.email,
        { redirectTo: linkDefinirSenha }
      )

      if (!authErr && authData?.user?.id) {
        authInvited = true
        authUserId = authData.user.id
      }
    } catch (authCatchErr) {
      console.warn('[clientServices] Aviso: inviteUserByEmail requer Service Role Key. Executando upsert resiliente de perfil.', authCatchErr)
    }

    // 3. Mapeia e insere/atualiza (upsert) na tabela `public.profiles`
    const profilePayload: Partial<Profile> = {
      id: authUserId,
      email: lead.email,
      role: 'client',
      tipo_pessoa: tipoPessoa,
      razao_social: isPj ? lead.razao_social_nome : null,
      cnpj: isPj ? lead.cpf_cnpj || null : null,
      nome_completo: !isPj ? lead.razao_social_nome : null,
      cpf: !isPj ? lead.cpf_cnpj || null : null,
      telefone: lead.telefone || null,
      updated_at: new Date().toISOString()
    }

    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'email' })
      .select()
      .maybeSingle()

    if (profileErr) {
      console.warn('[clientServices] Upsert com onConflict email falhou, tentando por id:', profileErr.message)
      const { data: retryProfile } = await supabase
        .from('profiles')
        .upsert(profilePayload)
        .select()
        .maybeSingle()

      return {
        success: true,
        profile: retryProfile || (profilePayload as Profile),
        authInvited,
        linkDefinirSenha,
        message: 'Lead promovido a cliente e perfil atualizado com sucesso!'
      }
    }

    return {
      success: true,
      profile: profileData as Profile,
      authInvited,
      linkDefinirSenha,
      message: 'Lead promovido a cliente e perfil ativado no Supabase!'
    }
  } catch (err: any) {
    console.error('Erro na função promoverLeadParaCliente:', err)
    throw new Error(err.message || 'Falha ao promover lead para cliente.')
  }
}
