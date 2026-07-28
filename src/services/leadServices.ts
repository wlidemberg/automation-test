import { supabase } from '../lib/supabase';

export interface ProposalPayload {
  tipoPessoa: 'PF' | 'PJ';
  nomeRazao: string;
  email: string;
  telefone: string;
  cpfCnpj?: string;
  produtoSlug: string;
  resumoNecessidade: string;
}

export async function submitProposalRequest(payload: ProposalPayload) {
  try {
    // 1. Verifica se já existe um perfil com o e-mail informado
    const { data: existingProfile, error: searchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', payload.email)
      .maybeSingle();

    if (searchError) {
      console.error('Erro ao buscar perfil existente:', searchError.message);
    }

    let clientId = existingProfile?.id;

    // 2. Se não existir, cria o novo perfil em estado PENDENTE
    if (!clientId) {
      const newId = crypto.randomUUID();
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
          telefone: payload.telefone,
        })
        .select()
        .single();

      if (profileError) {
        console.error('Erro critico ao inserir em profiles:', profileError.message);
        throw new Error(`Falha ao registrar cliente: ${profileError.message}`);
      }

      clientId = newProfile.id;
    }

    // 3. Cadastra a solicitação na tabela projects vinculada ao cliente
    const { error: projectError } = await supabase
      .from('projects')
      .insert({
        client_id: clientId,
        nome: `Solicitação: ${payload.produtoSlug.toUpperCase()}`,
        status_projeto: 'briefing',
        descricao: payload.resumoNecessidade,
        valor_total: 0,
      });

    if (projectError) {
      console.error('Erro critico ao inserir em projects:', projectError.message);
      throw new Error(`Falha ao registrar projeto: ${projectError.message}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Falha real na submissao da proposta:', err.message || err);
    throw err;
  }
}
