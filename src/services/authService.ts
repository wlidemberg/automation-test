import { supabase } from '../lib/supabase';

/**
 * Realiza o cadastro do usuário no Supabase Auth, enviando os metadados comerciais.
 * O trigger de banco do Supabase deve ser responsável por mapear esses dados para a tabela profiles.
 */
export async function signUpUser(email: string, password: string, metadata: Record<string, any>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        tipo_pessoa: metadata.tipo_pessoa,
        razao_social: metadata.razao_social || null,
        cnpj: metadata.cnpj || null,
        nome_completo: metadata.nome_completo || null,
        cpf: metadata.cpf || null,
        telefone: metadata.telefone || null,
        endereco: metadata.endereco || null,
        dados_adicionais: metadata.dados_adicionais || null
      }
    }
  });

  if (error) {
    console.error('Erro ao cadastrar usuário no Supabase Auth:', error);
    throw error;
  }

  return data;
}

/**
 * Autentica o usuário com e-mail e senha no Supabase Auth.
 */
export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Erro ao efetuar login no Supabase Auth:', error);
    throw error;
  }

  return data;
}

/**
 * Finaliza a sessão do usuário ativo no Supabase Auth.
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao efetuar logout no Supabase Auth:', error);
    throw error;
  }
}
