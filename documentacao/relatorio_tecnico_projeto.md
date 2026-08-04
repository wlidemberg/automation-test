# Relatório Técnico de Arquitetura, Funcionalidades e Roadmap - Automation Test

---

## 1. Visão Geral do Projeto

O **Automation Test** é um ecossistema digital corporativo estruturado sob a identidade visual de alto padrão **Tech-Luxo**. A plataforma integra um portal público responsivo para exposição de portfólios, catálogos e orçamentos, associado a um painel restrito de cliente (Dashboard) e um painel central de administração e operações (`/admin`) conectado ao **Supabase (PostgreSQL)**.

---

## 2. Stack Tecnológica & Arquitetura

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/) para tipagem estática e segurança.
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) com tokens de cor estendidos (`brand-dark` `#050505`, `brand-neon` `#CCFF00`, `brand-gray` `#1A1A1A`), efeitos de glassmorphism e tipografia *Space Grotesk* e *Inter*.
- **Bundler & Build**: [Vite v8](https://vitejs.dev/) garantindo tempos de carregamento instantâneos (SPA).
- **Animações**: [Framer Motion](https://www.framer.com/motion/) para transições de páginas, modais e partículas dinâmicas.
- **Backend as a Service (BaaS)**: [Supabase](https://supabase.com/) (PostgreSQL, Auth e Realtime).
- **Linter & Qualidade**: [Oxlint](https://oxc.rs/) para análise estática contínua sem erros.

---

## 3. Módulos Desenvolvidos e Status Atual

### 🌐 3.1. Portal Institucional Público (Landing Page)
- **Navegação & Header**: [`Header.tsx`](file:///f:/automation-test/src/components/Header.tsx) com logo animada, âncoras suaves e controle de menu mobile.
- **Hero & Apresentação**: [`HeroSection.tsx`](file:///f:/automation-test/src/components/HeroSection.tsx) e [`AboutSection.tsx`](file:///f:/automation-test/src/components/AboutSection.tsx) com background de partículas neon ([`ParticlesBackground.tsx`](file:///f:/automation-test/src/components/ParticlesBackground.tsx)).
- **Catálogo de Produtos Digitais**: [`ProductsSection.tsx`](file:///f:/automation-test/src/components/ProductsSection.tsx) com 7 soluções cadastradas em [`productsData.ts`](file:///f:/automation-test/src/data/productsData.ts).
- **Página de Detalhamento de Produto**: [`ProductPage.tsx`](file:///f:/automation-test/src/pages/ProductPage.tsx) com slugs dinâmicos (`/produtos/:slug`), galeria de especificações e CTAs de conversão.
- **Portfólio & Rodapé**: [`PortfolioSection.tsx`](file:///f:/automation-test/src/components/PortfolioSection.tsx), [`CtaSection.tsx`](file:///f:/automation-test/src/components/CtaSection.tsx) e [`Footer.tsx`](file:///f:/automation-test/src/components/Footer.tsx).

---

### 🔒 3.2. Área Autenticada do Cliente (Backstage Dashboard `/dashboard`)
- **Tela de Login Tech-Luxo**: [`Login.tsx`](file:///f:/automation-test/src/pages/Login.tsx) com formulário estilizado e alternância entre Pessoa Física (PF) e Jurídica (PJ).
- **Layout Minimalista**: [`DashboardLayout.tsx`](file:///f:/automation-test/src/layouts/DashboardLayout.tsx) com barra lateral responsiva e navegação limpa.
- **Overview de Negócio & Licenciamento**: [`Overview.tsx`](file:///f:/automation-test/src/pages/Dashboard/Overview.tsx) focado em métricas de valor (fase do projeto, entregas, mensalidades de ERP e faturamento recorrente - `RN-005`).
- **Detalhamento do Projeto**: [`ProjectDetail.tsx`](file:///f:/automation-test/src/pages/Dashboard/ProjectDetail.tsx) exibindo cronograma e linha do tempo de desenvolvimento.

---

### 👑 3.3. Painel de Administração Master (`/admin`)
- **Conexão Reativa com Supabase**: [`AdminOverview.tsx`](file:///f:/automation-test/src/pages/Admin/AdminOverview.tsx) integrado reativamente com as funções [`fetchAllProfiles`](file:///f:/automation-test/src/services/profileServices.ts#L18) e [`updateProfileStatus`](file:///f:/automation-test/src/services/profileServices.ts#L63).
- **Cards com Métricas em Tempo Real**:
  - `TOTAL DE CLIENTES ATIVOS`: Calculado dinamicamente (`${profiles.filter(p => p.status === 'ativo').length} ATIVOS`).
  - `SOLICITAÇÕES PENDENTES`: Calculado dinamicamente (`${profiles.filter(p => p.status === 'pendente').length} PENDENTES`).
- **Tabela de Gestão (PF / PJ)**:
  - Exibição de Razão Social/Nome Completo, documento com badge `[PF]` ou `[PJ]`, e-mail e telefone.
  - Badges de status no padrão Tech-Luxo: `pendente` (amarelo), `ativo` (verde neon `#a3e635`) e `recusado` (vermelho).
  - Botões em UPPERCASE (`APROVAR` e `RECUSAR`) conectados à função `handleStatusChange` com recarregamento via `loadProfiles()`.

---

### ⚡ 3.4. Infraestrutura Backend & Supabase (Fases 1, 2 e 3 Parcial)
- **Cliente Supabase**: Configurado em [`supabase.ts`](file:///f:/automation-test/src/lib/supabase.ts) com suporte a `.env.local`.
- **Tipagem de Banco**: [`database.ts`](file:///f:/automation-test/src/types/database.ts) mapeando a tabela `profiles` e enums (`user_role`, `user_status`, `tipo_pessoa`).
- **Camada de Serviços**: [`profileServices.ts`](file:///f:/automation-test/src/services/profileServices.ts) abstraindo as queries PostgreSQL do Supabase.
- **Políticas RLS**: Resolução do bloqueio do Row Level Security (RLS) no Supabase liberando consultas de leitura `SELECT` para a interface.

---

## 4. Matriz de Progresso e Status de Entregas

| Componente / Módulo | Status | Descrição |
| :--- | :--- | :--- |
| **Landing Page & Páginas Públicas** | 🟢 **Concluído** | Interface 100% responsiva em estética Tech-Luxo |
| **Design System & Animações** | 🟢 **Concluído** | Tokens Tailwind, Framer Motion e background de partículas |
| **Painel Admin Reativo (`/admin`)** | 🟢 **Concluído** | Conectado ao Supabase com métricas dinâmicas e aprovação atômica |
| **Cliente Supabase & Profile Services** | 🟢 **Concluído** | CRUD de perfis e funções de consulta integradas |
| **Supabase Auth & RLS Guard** | 🟡 **Em Andamento** | Integração dos formulários de login/cadastro e rotas protegidas |
| **Modelagem de Projetos e Faturas** | 🔵 **Planejado** | Migração dos dados de faturamento (MRR) para tabelas do Supabase |

---

## 5. Próximos Passos (Roadmap de Execução)

### 📌 Passo 1: Sincronização em Tempo Real (`Supabase Realtime`)
- Adicionar subscriptions de escuta em tempo real no [`AdminOverview.tsx`](file:///f:/automation-test/src/pages/Admin/AdminOverview.tsx) para que novos cadastros de clientes surjam instantaneamente no painel admin sem necessidade de recarregar a tela.

### 📌 Passo 2: Suíte de Testes e Homologação Final
- Realizar validação dos fluxos E2E de cadastro de cliente PF/PJ, aprovação do admin e liberação de acesso ao dashboard.

---

## 6. Fluxo de Onboarding Técnico com IA & Funil Admin
A plataforma agora conta com a esteira automatizada completa de onboarding:
1. **Formulário Wizard Unificado (`/solicitar-proposta`)**: Captação do lead estruturada em 4 passos (Identificação, Marca, Métricas, Requisitos de Escopo) salvando perfil, projeto e briefing em uma única submissão, com carregamento dinâmico de produtos ativos.
2. **Briefing Público Resiliente (`/briefing/:projectId`)**: Preenchimento complementar com verificação contra IDs de projetos inválidos e tratamento de fallback `project_id: null` para evitar violações da restrição `FK briefings_project_id_fkey` no Supabase.
3. **Integração n8n/IA**: Envio automatizado para o webhook do n8n para precificação com retorno do escopo dinâmico e upsells no portal (`/proposta/:briefingId`).
4. **Linha de Acompanhamento Reativa (Funil) & Alinhamento CHECK**: O Administrador monitora o onboarding reativamente em `/admin` através de um Stepper horizontal com ícones. Os status foram alinhados às restrições estritas `CHECK` da tabela `briefings` (`'pendente'`, `'em_analise_ia'`, `'proposta_enviada'`, `'pago'`, `'aprovado'`).
5. **Proteção Operacional**: Double-click guards em nível de estado bloqueiam submissões simultâneas acidentais.
