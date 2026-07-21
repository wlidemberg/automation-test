export interface Product {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  valor_implementacao: number;
  valor_mensalidade: number;
  ativo: boolean;
  created_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'client';
  tipo_pessoa: 'PF' | 'PJ';
  razao_social: string | null;
  cnpj: string | null;
  nome_completo: string | null;
  cpf: string | null;
  data_nascimento: string | null;
  telefone: string | null;
  endereco: Record<string, any> | null;
  dados_adicionais: Record<string, any> | null;
  created_at?: string;
}
