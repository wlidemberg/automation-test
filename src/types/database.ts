export type UserRole = 'admin' | 'client';
export type UserStatus = 'pendente' | 'ativo' | 'recusado' | 'inativo';
export type TipoPessoa = 'PF' | 'PJ';

export type ProductCategory = 'design_web' | 'desenvolvimento' | 'erp_saas' | 'automacao' | 'ia';
export type PricingType = 'unico' | 'recorrente' | 'hibrido';

export interface Address {
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  tipo_pessoa: TipoPessoa;
  razao_social?: string | null;
  cnpj?: string | null;
  nome_completo?: string | null;
  cpf?: string | null;
  data_nascimento?: string | null;
  telefone?: string | null;
  endereco?: Address;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  nome: string;
  slug: string;
  rotulo?: string | null;
  categoria: ProductCategory;
  tipo_cobranca: PricingType;
  preco_setup: number;
  preco_mensal: number;
  descricao_curta: string;
  descricao_completa?: string | null;
  recursos?: string[] | any;
  icone?: string | null;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}
