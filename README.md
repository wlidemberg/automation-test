# Automation Test - Ecossistema Digital

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

O **Automation Test** é uma plataforma digital corporativa estruturada sob uma identidade visual corporativa de alto padrão (**Tech-Luxo**). O ecossistema integra um portal público responsivo para exibição de portfólios, catálogos e orçamentos, associado a um painel restrito de cliente (Dashboard) e uma esteira comercial completa de propostas personalizadas geradas por IA (`/admin/propostas`).

---

## 📌 Principais Funcionalidades

### 🌐 Portal Institucional (Área Pública)
- **Vitrine Tecnológica**: Exposição fluida de produtos de alta performance (Websites, Lojas Headless, Agentes de IA).
- **Páginas de Produtos**: Detalhamento individual com slugs dinâmicos, especificações e badges.
- **Chamada de Ação (CTA)**: Seções focadas em conversão com direcionamento para contato e formulário Wizard.
- **Header & Footer Persistentes**: Navegação otimizada com âncoras internas suaves (`#sobre`, `#produtos`, `#contato`).

### 🤖 Esteira Comercial de Propostas IA & Admin (`/admin/propostas`)
- **Formulário Wizard (`/solicitar-proposta`)**: Captação de requisitos, faturamento e marca do cliente.
- **Gestão no Painel Admin (`/admin/propostas`)**: Filtros por status (`PENDENTES ADMIN`, `ENVIADAS AO CLIENTE`, `ACEITAS / PAGAMENTO`, `RECUSADAS`).
- **Revisão Humana & Solicitação de Reajuste IA**: O administrador aprova e envia por e-mail via webhook n8n ou envia orientações técnicas para a IA refazer a proposta.
- **Caixa Explicativa de Pendência (StatusBadge)**: Passar o cursor sobre a tag de status exibe uma caixa em Glassmorphism detalhando a pendência exata em tempo real (ex: *Aguardando Aprovação do Admin*, *Aguardando Aprovação do Cliente*, *Proposta Aceita pelo Cliente - Aguardando Pagamento da Entrada 50%*).

### ✉️ Aceite de Proposta pelo Cliente (`/proposta/:token`)
- **Acesso Seguro via Magic Link**: O cliente recebe o link seguro contendo o `token_acesso` hexadecimal de 24 bytes no e-mail.
- **Visualização Completa**: Exibição do resumo do escopo técnico, entregáveis, setup base, mensalidade e adicionais opcionais (upsells).
- **Aceite & Contrato em Tempo Real**: O clique em aceitar cria o contrato em `public.contracts` e a fatura de sinal (50%) em `public.invoices`.

---

## 🛠️ Stack Tecnológica

O projeto foi arquitetado com ferramentas modernas e de alta performance:

- **Core**: [React](https://react.dev/) (v19) com [TypeScript](https://www.typescriptlang.org/) para tipagem estática e segurança.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4 via Vite config plugin) e CSS customizado para os efeitos glassmorphism e sombras de neon.
- **Routing**: [React Router](https://reactrouter.com/) (v7) gerenciando navegação em Single Page Application (SPA).
- **Animações & Tooltips**: [Framer Motion](https://www.framer.com/motion/) para transições de entrada, tooltips de pendências e partículas dinâmicas.
- **Backend as a Service (BaaS)**: [Supabase](https://supabase.com/) (PostgreSQL relacional, Row Level Security e Triggers).
- **Deploy & SPA Rewrite**: [Vercel](https://vercel.com/) com `vercel.json` para suporte completo a rotas amigáveis da SPA.

---

## 📁 Estrutura de Diretórios

```bash
automation-test/
├── documentacao/            # Requisitos, DDL do Supabase e relatórios de arquitetura
├── public/                  # Ativos estáticos e mídias públicas
├── src/
│   ├── assets/              # Estilos e mídias compiladas
│   ├── components/          # Componentes visuais (Header, Footer, StatusBadge, Tooltips)
│   ├── data/                # Bases de dados locais e constantes
│   ├── layouts/             # Wrappers estruturais (Public Layout, Dashboard Layout)
│   ├── pages/               # Views / Páginas da SPA (Home, Admin, Proposals, Login)
│   │   ├── Admin/           # Esteira comercial Admin (/admin, /admin/propostas, detalhe)
│   │   └── Dashboard/       # Sub-rotas e seções internas da Área Logada do Cliente
│   ├── services/            # Serviços de integração Supabase (proposals, contracts, profiles)
│   ├── types/               # Mapeamentos e interfaces TypeScript (database.ts)
│   ├── App.tsx              # Roteador central e inicialização
│   └── main.tsx             # Ponto de entrada do React
├── vercel.json              # Reescreve rotas SPA para index.html na Vercel
├── tailwind.config.js       # Tokens de cores de design estendidas
└── vite.config.ts           # Configurações do bundler Vite
```

---

## 🚀 Como Executar o Projeto Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 1. Clonar o repositório
```bash
git clone https://github.com/wlidemberg/automation-test.git
cd automation-test
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Rodar em ambiente de desenvolvimento
```bash
npm run dev
```
O servidor local iniciará em `http://localhost:5173`.

### 4. Compilar para produção (Build)
```bash
npx tsc -b && npx vite build
```

---

## 🤖 Fluxo Completo da Esteira Comercial IA

1. **Wizard de Solicitação (`/solicitar-proposta`)**: Form de captação gravando o lead no Supabase.
2. **Revisão Humana Admin (`/admin/propostas`)**: O admin visualiza propostas pendentes e aprova ou solicita revisão da IA.
3. **Disparo do E-mail (n8n)**: Webhook envia o e-mail ao cliente com o Magic Link seguro contendo o `token_acesso`.
4. **Aceite pelo Cliente (`/proposta/:token`)**: O cliente abre a proposta comercial, seleciona opcionais e aceita o contrato.
5. **Geração de Contrato e Fatura**: O sistema altera o status da proposta para `'aceita'`, criando o registro de contrato em `public.contracts` e fatura de entrada (50%) em `public.invoices`.
