-- ==============================================================================
-- SCRIPT DE MIGRATION DA TABELA PUBLIC.PROPOSALS (SUPABASE / POSTGRESQL)
-- Execute este script no Supabase SQL Editor para garantir a integridade da tabela
-- ==============================================================================

-- 1. Criar a tabela proposals caso não exista
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

-- 2. Garantir que colunas existam caso a tabela já tenha sido criada anteriormente com schema parcial
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='proposals' AND column_name='status_proposta') THEN
    ALTER TABLE public.proposals ADD COLUMN status_proposta TEXT DEFAULT 'pendente_aprovacao_admin';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='proposals' AND column_name='observacoes_admin') THEN
    ALTER TABLE public.proposals ADD COLUMN observacoes_admin TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='proposals' AND column_name='orientacoes_admin') THEN
    ALTER TABLE public.proposals ADD COLUMN orientacoes_admin TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='proposals' AND column_name='orientacao_admin') THEN
    ALTER TABLE public.proposals ADD COLUMN orientacao_admin TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='proposals' AND column_name='contador_recriacoes') THEN
    ALTER TABLE public.proposals ADD COLUMN contador_recriacoes INTEGER DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='proposals' AND column_name='magic_link') THEN
    ALTER TABLE public.proposals ADD COLUMN magic_link TEXT;
  END IF;
END $$;

-- 3. Configurar Row Level Security (RLS)
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Permite leitura de propostas (pública via magic_link/ID ou autenticada)
DROP POLICY IF EXISTS "Leitura de Propostas" ON public.proposals;
CREATE POLICY "Leitura de Propostas" ON public.proposals
  FOR SELECT USING (true);

-- Permite inserção de propostas
DROP POLICY IF EXISTS "Inserção de Propostas" ON public.proposals;
CREATE POLICY "Inserção de Propostas" ON public.proposals
  FOR INSERT WITH CHECK (true);

-- Permite atualização de propostas
DROP POLICY IF EXISTS "Atualização de Propostas" ON public.proposals;
CREATE POLICY "Atualização de Propostas" ON public.proposals
  FOR UPDATE USING (true) WITH CHECK (true);
