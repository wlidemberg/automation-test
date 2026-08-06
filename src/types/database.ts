export type UserRole = 'admin' | 'client';
export type UserStatus = 'lead' | 'pendente' | 'ativo' | 'recusado' | 'inativo';
export type TipoPessoa = 'PF' | 'PJ';

export type ProductCategory = 'design_web' | 'desenvolvimento' | 'erp_saas' | 'automacao' | 'ia';
export type PricingType = 'unico' | 'recorrente' | 'hibrido';

export type ProjectPhase = 
  | 'briefing_pendente'
  | 'em_analise_ia'
  | 'proposta_enviada'
  | 'aguardando_pagamento'
  | 'em_desenvolvimento'
  | 'homologacao'
  | 'concluido'
  | 'cancelado'
  | 'Homologação Visual'
  | 'Lançamento'
  | 'Operação em Produção';

export type InvoiceStatus = 'pendente' | 'pago' | 'cancelado';
export type InvoiceType = 'entrada' | 'mensalidade' | 'avulso';
export type BriefingStatus = 'pendente' | 'em_analise_ia' | 'proposta_enviada' | 'pago' | 'aprovado';

export interface Lead {
  id: string;
  produto_slug: string;
  categoria_produto: ProductCategory;
  razao_social_nome: string;
  cpf_cnpj?: string | null;
  email: string;
  telefone: string;
  faturamento_mensal?: string | null;
  porte_empresa?: string | null;
  dores_principais: string;
  dados_especificos_categoria: Record<string, any>;
  created_at?: string;
}

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
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  nome: string;
  slug: string;
  rotulo?: string | null;
  categoria?: ProductCategory;
  tipo_cobranca?: PricingType;
  preco_setup?: number;
  preco_mensal?: number;
  valor_implementacao?: number;
  valor_setup?: number;
  valor_mensalidade?: number;
  descricao_curta?: string;
  descricao_completa?: string | null;
  descricao?: string;
  recursos?: string[] | any;
  icone?: string | null;
  status?: boolean;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  client_id: string;
  product_id?: string | null;
  nome: string;
  descricao?: string | null;
  fase_atual: ProjectPhase;
  valor_setup?: number | null;
  valor_mensalidade?: number | null;
  progresso?: number | null;
  ativo?: boolean;
  data_inicio?: string | null;
  previsao_entrega?: string | null;
  proxima_entrega?: string | null;
  status_pagamento?: string | null;
  status_geral?: string | null;
  url_projeto?: string | null;
  btn_online_label?: string | null;
  btn_gerenciar_label?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Briefing {
  id: string;
  project_id?: string | null;
  client_id: string;
  nome_projeto: string;
  logo_url?: string | null;
  cor_primaria?: string | null;
  cor_secundaria?: string | null;
  tom_de_voz?: string | null;
  faturamento_mensal?: string | null;
  qtd_funcionarios?: number;
  qtd_socios?: number;
  publico_alvo?: string | null;
  dores_principais: string;
  funcionalidades_esperadas: string[];
  integracoes_necessarias: string[];
  proposta_ia?: Record<string, any> | null;
  link_pagamento?: string | null;
  link_pagamento_entrada?: string | null;
  status_briefing?: BriefingStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  project_id: string;
  client_id: string;
  valor: number;
  vencimento: string;
  tipo: InvoiceType;
  status: InvoiceStatus;
  payload_pagamento?: Record<string, any> | null;
  created_at?: string;
}

export interface ProjectRoadmap {
  id: string;
  project_id: string;
  nome_fase: string;
  status: 'done' | 'current' | 'pending';
  descricao_fase?: string | null;
  ordem: number;
  created_at?: string;
}


export type ProposalStatus = 
  | 'pendente_aprovacao_admin'
  | 'aprovada_admin'
  | 'em_analise_ia'
  | 'enviada_lead'
  | 'aprovada_lead'
  | 'aceita'
  | 'recusada'
  | 'recusada_lead'
  | string;

export interface ProposalAiContent {
  resumo_executivo?: string;
  valor_setup?: number;
  parcela_entrada?: number;
  valor_mensal?: number;
  entregaveis?: string[];
  modulos_upsell?: Array<{ titulo: string; descricao: string; preco?: number }>;
  dicas_engenharia?: string[];
  [key: string]: any;
}

export interface Proposal {
  id: string;
  lead_id?: string | null;
  briefing_id?: string | null;
  project_id?: string | null;
  status: ProposalStatus;
  status_proposta?: ProposalStatus | string;
  proposta_ia: ProposalAiContent;
  orientacao_admin?: string | null;
  orientacoes_admin?: string | null;
  observacoes_admin?: string | null;
  contador_recriacoes: number;
  pagamento_confirmado?: boolean;
  pago_em?: string | null;
  magic_link?: string | null;
  lead?: Lead | null;
  created_at?: string;
  updated_at?: string;
}

export type ContractStatus = 'aguardando_pagamento_entrada' | 'pago' | 'ativo' | 'cancelado';

export interface AcceptContractPayload {
  proposalId: string;
  leadId: string;
  valorSetupBase: number;
  modulosUpsellSelecionados: Array<{ nome_modulo: string; valor_adicional: number }>;
  valorTotalContrato: number;
  valorEntrada50: number;
  mensalidadeRecorrente: number;
}

export interface Contract {
  id: string;
  proposal_id: string;
  lead_id: string;
  valor_setup_base: number;
  modulos_upsell: Array<{ nome_modulo: string; valor_adicional: number }>;
  valor_total_contrato: number;
  valor_entrada_50: number;
  mensalidade_recorrente: number;
  status_contrato: ContractStatus | string;
  token_acesso?: string | null;
  created_at?: string;
  updated_at?: string;
}

