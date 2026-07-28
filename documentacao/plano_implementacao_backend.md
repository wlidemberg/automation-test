# Plano de Implementação Backend & Supabase - Automation Test

Este documento especifica o plano de execução e o status atual da infraestrutura backend, banco de dados PostgreSQL relacional no Supabase e integrações com o Painel Administrativo e Área do Cliente.

---

## 1. Status das Etapas de Implementação

- [x] **Etapa 1: Configuração Base da Infraestrutura Supabase**
  - Cliente oficial Supabase em `src/lib/supabase.ts`.
  - Variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` integradas.

- [x] **Etapa 2: Serviço de Perfis de Usuários (`profileServices.ts`)**
  - CRUD e métodos de consulta (`getProfileById`, `getAllProfiles`, `getPendingProfiles`, `updateProfile`, `updateProfileStatus`).
  - Suporte a tipos de pessoa (`PF` e `PJ`) e status de conta (`pendente`, `ativo`, `recusado`).

- [x] **Etapa 3: Integração do Painel Administrativo com Supabase & Reestruturação do Layout**
  - Reestruturação da interface do Admin com componentes desacoplados (`AdminSidebar.tsx` e `AdminHeader.tsx`).
  - Navegação por **Sidebar Retrátil (Collapsible)** com animação fluida, tooltips e alternância de estado `isCollapsed`.
  - Grid responsiva de **8 Cards de KPIs** em estilo Glassmorphism, integrando a contagem de clientes e pendências em tempo real com o banco Supabase.
  - Módulo completo de **Gestão de Clientes (`/admin/clientes`)** com busca dinâmica reativa e modal CRUD em Glassmorphism (`ClientModal.tsx`).
  - Módulo completo de **Gestão de Produtos & Soluções (`/admin/produtos`)** com suporte a categorias, precificação (Único, Recorrente, Híbrido), filtro reativo e modal CRUD (`ProductModal.tsx`).
  - Camada de serviços de catálogo em `productServices.ts` com **proibição estrita de deleção física (DELETE)**, operando via inativação (`status: false`) e suporte a fallback local resiliente contra erros RLS com a função `fetchActiveProducts()`.
  - Atribuição automática de `status: 'ativo'` para cadastros novos realizados diretamente pelo Administrador.

- [ ] **Etapa 4: Autenticação & RLS (Row Level Security)**
  - Configuração de políticas RLS na tabela `profiles`.
  - Fluxo de login e cadastro na landing page com Supabase Auth.

- [x] **Etapa 5: Gestão de Projetos e Faturas Recorrentes (MRR)**
  - Criação das tabelas `projects` e `invoices` no Supabase PostgreSQL.
  - Suporte a propostas personalizadas, precificação de setup/mensalidade e geração automática de faturas de entrada (50%).
  - Aceite de propostas integrado com simulação de pagamento e ativação automática do cliente.

- [x] **Etapa 6: Substituição do Checkout Direto por Solicitação de Proposta/Diagnóstico (Briefing)**
  - Remoção do antigo checkout comercial direto da landing page.
  - Implementação do novo formulário de briefing/proposta técnica (`ProposalModal.tsx` público) para captação de leads.
  - Fluxo integrado com Supabase (`leadServices.ts`) para criação automática de perfis com `status: 'pendente'` e novos projetos em fase `briefing` (com valor zerado), adicionando resiliência e fallback automático contra falhas de RLS/Supabase no ambiente de desenvolvimento local.

- [x] **Etapa 7: Reestruturação de Modais em Páginas Dedicadas**
  - Conversão do formulário público de propostas em página inteira (`/solicitar-proposta` -> `ProposalPage.tsx`).
  - Conversão do CRUD de Clientes do Admin em páginas dedicadas (`/admin/clientes/novo` e `/admin/clientes/editar/:id` -> `ClientFormPage.tsx`).
  - Conversão do CRUD de Produtos do Admin em páginas dedicadas (`/admin/produtos/novo` e `/admin/produtos/editar/:id` -> `ProductFormPage.tsx`).
  - Remoção de todos os modais obsoletos do catálogo e de cadastros.

- [x] **Etapa 8: Fluxo Completo de Briefing Técnico e Propostas IA com n8n**
  - Criação da página de Briefing Técnico (`BriefingPage.tsx`) na rota `/briefing/:projectId` coletando dados detalhados (marca, dores, faturamento, features, integrações).
  - Validação inteligente contra duplicação de cadastros por e-mail/CPF/CNPJ na camada de serviço (`briefingServices.ts`).
  - Integração com automação de inteligência artificial através de webhook `POST` para o n8n.
  - Tela de visualização de proposta recomendada pela IA (`ProposalViewPage.tsx`) na rota `/proposta/:briefingId` com detalhamento dinâmico de escopo, entregáveis e precificação dividida com suporte opcional a Upsells de alto valor.
  - Atualização do painel administrativo (`AdminOverview.tsx`) integrando aprovação de cadastros vinculada a contratos gerados de forma inteligente após a detecção do pagamento da entrada.

---

## 2. Cronograma de Entregas

| Ciclo | Funcionalidade | Status |
| :--- | :--- | :--- |
| **Fase 1** | Supabase Base Client & Profile Service | **Concluído** |
| **Fase 2** | Conexão Real Painel Admin & Aprovações | **Concluído** |
| **Fase 3** | Supabase Auth & RLS Policies | **Concluído** |
| **Fase 4** | Fluxo Completo de Briefing & Propostas IA | **Concluído** |
| **Fase 5** | Sincronização em Tempo Real (Realtime) | Planejado |
