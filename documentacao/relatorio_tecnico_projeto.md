# Relatório Técnico de Arquitetura, Funcionalidades e Roadmap - Automation Test

---

## 1. Visão Geral do Projeto

O **Automation Test** é um ecossistema digital corporativo estruturado sob a identidade visual de alto padrão **Tech-Luxo**. A plataforma integra um portal público responsivo para exposição de portfólios, catálogos e orçamentos, associado a um painel restrito de cliente (Dashboard) e um painel central de administração e operações (`/admin`) conectado ao **Supabase (PostgreSQL)** e esteira de automações com **n8n e IA**.

---

## 2. Stack Tecnológica & Arquitetura

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/) para tipagem estática e segurança.
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) com tokens de cor estendidos (`brand-dark` `#050505`, `brand-neon` `#CCFF00`, `brand-gray` `#1A1A1A`), efeitos de glassmorphism e tipografia *Space Grotesk* e *Inter*.
- **Bundler & Build**: [Vite v8](https://vitejs.dev/) garantindo tempos de carregamento instantâneos (SPA).
- **Animações & Interações**: [Framer Motion](https://www.framer.com/motion/) para transições de páginas, modais, tooltips interativos de pendências e partículas dinâmicas.
- **Backend as a Service (BaaS)**: [Supabase](https://supabase.com/) (PostgreSQL, Auth e Realtime).
- **Hospedagem & Deploy**: [Vercel](https://vercel.com/) com suporte a roteamento SPA via `vercel.json`.
- **Linter & Qualidade**: [Oxlint](https://oxc.rs/) para análise estática contínua sem erros.

---

## 3. Módulos Desenvolvidos e Status Atual

### 🌐 3.1. Portal Institucional Público & Orçamentos (Landing Page)
- **Navegação & Header**: [`Header.tsx`](file:///f:/automation-test/src/components/Header.tsx) com logo animada, âncoras suaves e controle de menu mobile.
- **Hero & Apresentação**: [`HeroSection.tsx`](file:///f:/automation-test/src/components/HeroSection.tsx) e [`AboutSection.tsx`](file:///f:/automation-test/src/components/AboutSection.tsx) com background de partículas neon ([`ParticlesBackground.tsx`](file:///f:/automation-test/src/components/ParticlesBackground.tsx)).
- **Catálogo de Produtos Digitais**: [`ProductsSection.tsx`](file:///f:/automation-test/src/components/ProductsSection.tsx) com soluções cadastradas em [`productsData.ts`](file:///f:/automation-test/src/data/productsData.ts).
- **Formulário de Solicitação de Proposta**: [`ProposalPage.tsx`](file:///f:/automation-test/src/pages/ProposalPage.tsx) contendo Wizard interativo de captação de leads.
- **Página de Visualização da Proposta (Cliente)**: [`ProposalViewPage.tsx`](file:///f:/automation-test/src/pages/ProposalViewPage.tsx) permitindo ao lead revisar a proposta enviada via Magic Link por e-mail e realizar o aceite com pagamento de entrada (50%).

---

### 🔒 3.2. Área Autenticada do Cliente (Backstage Dashboard `/dashboard`)
- **Tela de Login Tech-Luxo**: [`Login.tsx`](file:///f:/automation-test/src/pages/Login.tsx) com formulário estilizado e alternância entre Pessoa Física (PF) e Jurídica (PJ).
- **Layout Minimalista**: [`DashboardLayout.tsx`](file:///f:/automation-test/src/layouts/DashboardLayout.tsx) com barra lateral responsiva e navegação limpa.
- **Overview de Negócio & Licenciamento**: [`Overview.tsx`](file:///f:/automation-test/src/pages/Dashboard/Overview.tsx) focado em métricas de valor (fase do projeto, entregas, mensalidades de ERP e faturamento recorrente - `RN-005`).
- **Detalhamento do Projeto**: [`ProjectDetail.tsx`](file:///f:/automation-test/src/pages/Dashboard/ProjectDetail.tsx) exibindo cronograma e linha do tempo de desenvolvimento.

---

### 👑 3.3. Esteira Comercial & Painel Admin (`/admin`, `/admin/propostas`)
- **Gestão de Propostas Técnico-Comerciais**: [`AdminProposalsListPage.tsx`](file:///f:/automation-test/src/pages/Admin/AdminProposalsListPage.tsx) com abas de filtro (`TODAS`, `PENDENTES ADMIN`, `ENVIADAS AO CLIENTE`, `ACEITAS / PAGAMENTO`, `RECUSADAS`) e contadores no topo.
- **Revisão Humana & Solicitação de Reajuste IA**: [`AdminProposalDetailPage.tsx`](file:///f:/automation-test/src/pages/Admin/AdminProposalDetailPage.tsx) permitindo aprovar e enviar por e-mail via webhook n8n ou solicitar à IA para refazer a proposta com orientações personalizadas.
- **Componente StatusBadge com Tooltip Explicativo**: [`StatusBadge.tsx`](file:///f:/automation-test/src/components/StatusBadge.tsx) exibe o status e uma caixa de texto explicativa ao passar o cursor do mouse, detalhando a pendência exata da proposta (ex: *Aguardando Aprovação do Admin*, *Aguardando Aprovação do Cliente*, *Proposta Aceita pelo Cliente - Aguardando Pagamento da Entrada 50%*).

---

### ⚡ 3.4. Infraestrutura Backend & Supabase (DDL Real & RLS)
- **Tabela Proposals**: Estrutura alinhada com a DDL real do Postgres no Supabase (`status_proposta`, `resumo_executivo`, `valor_total_setup`, `valor_entrada_50`, `mensalidade_recorrente`, `prazo_estimado_dias`, `entregaveis_principais`, `sugestoes_upsell`, `orientacao_admin_refazer`, `token_acesso`).
- **Restrição CHECK de Status**: Conformidade com a constraint `status_proposta = ANY (ARRAY['pendente_aprovacao_admin', 'aprovada_admin', 'enviada_lead', 'aceita', 'recusada'])`.
- **Tabela Contracts e Invoices**: Aceite de propostas registra o contrato em `public.contracts` e a fatura de entrada (50%) em `public.invoices`.
- **Migração SQL**: Scripts [migration_proposals.sql](file:///f:/automation-test/documentacao/migration_proposals.sql) e [schema_v2_unificado.sql](file:///f:/automation-test/documentacao/schema_v2_unificado.sql).

---

## 4. Matriz de Progresso e Status de Entregas

| Componente / Módulo | Status | Descrição |
| :--- | :--- | :--- |
| **Landing Page & Páginas Públicas** | 🟢 **Concluído** | Interface 100% responsiva em estética Tech-Luxo |
| **Esteira de Propostas IA & Admin** | 🟢 **Concluído** | Lista, revisão humana, reajuste por IA e envio por e-mail |
| **Página Pública de Proposta pelo Cliente** | 🟢 **Concluído** | Busca por `token_acesso` (hex) ou ID e aceite do contrato |
| **Tooltip Interativo de Pendências** | 🟢 **Concluído** | Componente `StatusBadge` com caixa explicativa no hover |
| **Deploy na Vercel (SPA)** | 🟢 **Concluído** | Configuração `vercel.json` resolvendo rotas dinâmicas |
| **Integração Supabase DDL & RLS** | 🟢 **Concluído** | Suporte às tabelas `proposals`, `contracts`, `leads`, `briefings` |

---

## 5. Fluxo de Onboarding Técnico com IA & Funil Admin

1. **Captação (`/solicitar-proposta`)**: Questionário Wizard salvando lead no Supabase.
2. **Revisão Admin (`/admin/propostas`)**: O administrador visualiza propostas pendentes, altera orientações e aprova ou solicita revisão da IA.
3. **Notificação por E-mail (n8n)**: Webhook dispara e-mail com Magic Link contendo o `token_acesso`.
4. **Aceite do Cliente (`/proposta/:token`)**: O cliente abre a proposta pelo token, seleciona opcionais (upsells) e aceita o contrato.
5. **Faturamento & Contrato**: O status da proposta passa para `'aceita'`, gravando o registro em `contracts` e gerando a fatura de sinal (50%) em `invoices`.
