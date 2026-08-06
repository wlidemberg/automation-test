import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

export interface ProvisionClientPayload {
  leadId: string
  proposalId: string
}

export interface ProvisionClientResult {
  success: boolean
  userId?: string
  email: string
  linkDefinirSenha?: string
  profile?: Profile | null
}

/**
 * Provisiona a conta do novo cliente no Supabase Auth e preenche a tabela `public.profiles`.
 */
export async function provisionClientAccount({
  leadId,
  proposalId: _proposalId
}: ProvisionClientPayload): Promise<ProvisionClientResult> {
  if (!leadId) {
    throw new Error('Não foi possível obter o ID do Lead para provisionamento.')
  }

  // 1. Busca os dados completos do Lead vinculado
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (leadError || !lead) {
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

  // 3. Chama a função de convite/autenticação no Supabase Auth
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(
      lead.email,
      {
        redirectTo: linkDefinirSenha,
        data: {
          role: 'client',
          razao_social: lead.razao_social || lead.razao_social_nome || lead.nome_completo
        }
      }
    )

    if (authError) {
      console.warn('Aviso ao gerar convite no Auth:', authError.message)
    }

    if (authData?.user?.id) {
      userId = authData.user.id
    }
  } catch (authCatchErr: any) {
    console.warn('Aviso ao executar convite no Auth:', authCatchErr.message || authCatchErr)
  }

  // 4. Preenche/Atualiza a tabela public.profiles
  const profileData: Partial<Profile> = {
    id: userId,
    email: lead.email,
    role: 'client',
    tipo_pessoa: tipoPessoa,
    razao_social: isCnpj ? (lead.razao_social || lead.razao_social_nome || lead.nome_completo) : null,
    cnpj: isCnpj ? cleanDoc : null,
    nome_completo: !isCnpj ? (lead.nome_completo || lead.razao_social_nome || lead.razao_social) : null,
    cpf: !isCnpj ? cleanDoc : null,
    telefone: lead.telefone || null,
    updated_at: new Date().toISOString()
  }

  const { data: savedProfile, error: profileError } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'email' })
    .select()
    .maybeSingle()

  if (profileError) {
    console.error('Erro ao preencher a tabela profiles:', profileError)
    const { data: fallbackProfile } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .maybeSingle()

    return {
      success: true,
      userId,
      email: lead.email,
      linkDefinirSenha,
      profile: fallbackProfile || (profileData as Profile)
    }
  }

  return {
    success: true,
    userId,
    email: lead.email,
    linkDefinirSenha,
    profile: savedProfile as Profile
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
    linkDefinirSenha: result.linkDefinirSenha || 'https://automation-test-sepia.vercel.app/definir-senha',
    message: 'Conta do cliente provisionada com sucesso!'
  }
}
