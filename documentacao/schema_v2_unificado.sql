-- ==============================================================================
-- SCRIPT DE MIGRATION UNIFICADO V2 - AUTOMATION TEST (SUPABASE / POSTGRESQL)
-- ==============================================================================

-- 1. CRIAÇÃO / ATUALIZAÇÃO DOS ENUMS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'client');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('lead', 'pendente', 'ativo', 'recusado', 'inativo');
    ELSE
        ALTER TYPE user_status ADD VALUE IF NOT EXISTS 'lead';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_pessoa') THEN
        CREATE TYPE tipo_pessoa AS ENUM ('PF', 'PJ');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
        CREATE TYPE product_category AS ENUM ('design_web', 'desenvolvimento', 'erp_saas', 'automacao', 'ia');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricing_type') THEN
        CREATE TYPE pricing_type AS ENUM ('unico', 'recorrente', 'hibrido');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_phase') THEN
        CREATE TYPE project_phase AS ENUM (
          'briefing_pendente', 'em_analise_ia', 'proposta_enviada', 
          'aguardando_pagamento', 'em_desenvolvimento', 'homologacao', 'concluido', 'cancelado'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
        CREATE TYPE invoice_status AS ENUM ('pendente', 'pago', 'cancelado');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_type') THEN
        CREATE TYPE invoice_type AS ENUM ('entrada', 'mensalidade', 'avulso');
    END IF;
END $$;

-- 2. TABELA PROFILES (VINCULADA AO AUTH.USERS)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role DEFAULT 'client'::user_role NOT NULL,
  status user_status DEFAULT 'lead'::user_status NOT NULL,
  tipo_pessoa tipo_pessoa DEFAULT 'PF'::tipo_pessoa NOT NULL,
  razao_social TEXT,
  cnpj TEXT,
  nome_completo TEXT,
  cpf TEXT,
  telefone TEXT,
  endereco JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  rotulo TEXT,
  categoria product_category NOT NULL,
  tipo_cobranca pricing_type DEFAULT 'unico'::pricing_type NOT NULL,
  preco_setup DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  preco_mensal DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  descricao_curta TEXT NOT NULL,
  descricao_completa TEXT,
  recursos JSONB DEFAULT '[]'::jsonb NOT NULL,
  icone TEXT DEFAULT 'Package',
  status BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  fase_atual project_phase DEFAULT 'briefing_pendente'::project_phase NOT NULL,
  valor_setup DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  valor_mensalidade DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  progresso INTEGER DEFAULT 0 NOT NULL,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA BRIEFINGS
CREATE TABLE IF NOT EXISTS public.briefings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nome_projeto TEXT NOT NULL,
  logo_url TEXT,
  cor_primaria TEXT,
  cor_secundaria TEXT,
  tom_de_voz TEXT,
  faturamento_mensal TEXT,
  qtd_funcionarios INTEGER DEFAULT 1 NOT NULL,
  publico_alvo TEXT,
  dores_principais TEXT NOT NULL,
  funcionalidades_esperadas TEXT[] DEFAULT '{}'::text[] NOT NULL,
  integracoes_necessarias TEXT[] DEFAULT '{}'::text[] NOT NULL,
  proposta_ia JSONB,
  link_pagamento TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABELA INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  vencimento DATE NOT NULL,
  tipo invoice_type NOT NULL,
  status invoice_status DEFAULT 'pendente'::invoice_status NOT NULL,
  payload_pagamento JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABELA LEADS
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_slug TEXT NOT NULL,
  categoria_produto product_category NOT NULL,
  razao_social_nome TEXT NOT NULL,
  cpf_cnpj TEXT,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  faturamento_mensal TEXT,
  porte_empresa TEXT,
  dores_principais TEXT NOT NULL,
  dados_especificos_categoria JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- AUTOMATIC TRIGGER: CRIAÇÃO AUTOMÁTICA DE PERFIL AO REGISTRAR NO AUTH.USERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, status, tipo_pessoa, nome_completo)
  VALUES (
    NEW.id,
    NEW.email,
    'client',
    'lead',
    'PF',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy Profiles: Usuários leem seu próprio perfil; Admins leem tudo
DROP POLICY IF EXISTS "Leitura de Perfis" ON public.profiles;
CREATE POLICY "Leitura de Perfis" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Atualização de Perfis" ON public.profiles;
CREATE POLICY "Atualização de Perfis" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy Products: Leitura pública de produtos ativos
DROP POLICY IF EXISTS "Leitura Pública de Produtos" ON public.products;
CREATE POLICY "Leitura Pública de Produtos" ON public.products
  FOR SELECT USING (status = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy Projects: Clientes leem seus projetos; Admins leem todos
DROP POLICY IF EXISTS "Leitura de Projetos" ON public.projects;
CREATE POLICY "Leitura de Projetos" ON public.projects
  FOR SELECT USING (client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy Briefings: Clientes leem seus briefings; Admins leem todos
DROP POLICY IF EXISTS "Leitura de Briefings" ON public.briefings;
CREATE POLICY "Leitura de Briefings" ON public.briefings
  FOR SELECT USING (client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy Invoices: Clientes leem suas faturas; Admins leem todas
DROP POLICY IF EXISTS "Leitura de Faturas" ON public.invoices;
CREATE POLICY "Leitura de Faturas" ON public.invoices
  FOR SELECT USING (client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy Leads: Inserção pública permitida; Leitura restrita a Admins
DROP POLICY IF EXISTS "Inserção pública de leads" ON public.leads;
CREATE POLICY "Inserção pública de leads" ON public.leads
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Leitura de leads para admins" ON public.leads;
CREATE POLICY "Leitura de leads para admins" ON public.leads
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 8. TABELA CONTRACTS
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL,
  lead_id UUID NOT NULL,
  valor_setup_base DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  modulos_upsell JSONB DEFAULT '[]'::jsonb NOT NULL,
  valor_total_contrato DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  valor_entrada_50 DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  mensalidade_recorrente DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  status_contrato TEXT DEFAULT 'aguardando_pagamento_entrada' NOT NULL,
  token_acesso TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Inserção e Leitura de Contratos" ON public.contracts;
CREATE POLICY "Inserção e Leitura de Contratos" ON public.contracts
  FOR ALL USING (true) WITH CHECK (true);

-- 9. TABELA PROPOSALS
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  briefing_id UUID REFERENCES public.briefings(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pendente_aprovacao_admin' NOT NULL,
  status_proposta TEXT DEFAULT 'pendente_aprovacao_admin',
  proposta_ia JSONB DEFAULT '{}'::jsonb NOT NULL,
  orientacao_admin TEXT DEFAULT '',
  orientacoes_admin TEXT DEFAULT '',
  observacoes_admin TEXT DEFAULT '',
  contador_recriacoes INTEGER DEFAULT 0 NOT NULL,
  magic_link TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura de Propostas" ON public.proposals;
CREATE POLICY "Leitura de Propostas" ON public.proposals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserção de Propostas" ON public.proposals;
CREATE POLICY "Inserção de Propostas" ON public.proposals FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Atualização de Propostas" ON public.proposals;
CREATE POLICY "Atualização de Propostas" ON public.proposals FOR UPDATE USING (true) WITH CHECK (true);
