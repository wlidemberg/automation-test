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
  status: 'pendente' | 'ativo';
  created_at?: string;
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

