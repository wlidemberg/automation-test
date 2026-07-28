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
  tipo_pessoa: TipoPessoa;
  razao_social?: string | null;
  cnpj?: string | null;
  nome_completo?: string | null;
  cpf?: string | null;
  data_nascimento?: string | null;
  telefone?: string | null;
  endereco?: Address | Record<string, any> | null;
  dados_adicionais?: Record<string, any> | null;
  status: UserStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  nome: string;
  slug: string;
  
  // Fields from main
  descricao?: string;
  valor_implementacao?: number;
  valor_setup?: number;
  valor_mensalidade?: number;
  ativo?: boolean;
  
  // Fields from feat/painel-administrativo
  rotulo?: string | null;
  categoria?: ProductCategory;
  tipo_cobranca?: PricingType;
  preco_setup?: number;
  preco_mensal?: number;
  descricao_curta?: string;
  descricao_completa?: string | null;
  recursos?: string[] | any;
  icone?: string | null;
  status?: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  client_id: string;
  nome: string;
  descricao: string | null;
  data_inicio: string | null;
  previsao_entrega: string | null;
  fase_atual: string | null;
  proxima_entrega: string | null;
  status_pagamento: string | null;
  status_geral: string | null;
  url_projeto: string | null;
  btn_online_label: string | null;
  btn_gerenciar_label: string | null;
  progresso: number | null;
  ativo: boolean;
  created_at?: string;
}

export interface ProjectRoadmap {
  id: string;
  project_id: string;
  nome_fase: string;
  status: 'done' | 'current' | 'pending';
  descricao_fase: string | null;
  ordem: number;
  created_at?: string;
}
