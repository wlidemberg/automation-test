# Automation Test - Ecossistema Digital

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

O **Automation Test** é uma plataforma digital corporativa estruturada sob a identidade visual de alto padrão **Tech-Luxo**. O ecossistema integra um portal público responsivo para exibição de portfólios, catálogos e orçamentos, associado a um painel restrito de cliente (Dashboard) para acompanhamento transparente de cronogramas e entregas de negócios.

---

## 📌 Principais Funcionalidades

### 🌐 Portal Institucional (Área Pública)
- **Vitrine Tecnológica**: Exposição fluida de produtos de alta performance (Websites, Lojas Headless, Agentes de IA).
- **Páginas de Produtos**: Detalhamento individual com slugs dinâmicos, especificações, tecnologias e badges.
- **Chamada de Ação (CTA)**: Seções focadas em conversão, com direcionamento rápido para contato e área logada.
- **Header & Footer Persistentes**: Navegação otimizada com âncoras internas suaves (`#sobre`, `#produtos`, `#contato`).

### 🔒 Backstage (Área do Cliente)
- **Tela de Login Premium**: Interface dedicada com efeito glassmorphism e inputs de estilo Tech-Luxo, sem Cabeçalhos/Rodapés públicos.
- **Dashboard Layout**: Painel interno exclusivo dotado de barra lateral de navegação minimalista e totalmente responsiva.
- **Overview de Negócio**: Acesso rápido a dados do projeto (Fase atual, Próxima entrega, Status do pagamento) sem jargões de desenvolvimento.
- **Tickets & Central de Ajuda**: Módulo integrado para envio direto de chamados ao Tech Lead do projeto.

---

## 🛠️ Stack Tecnológica

O projeto foi arquitetado com ferramentas modernas e de alta performance:

- **Core**: [React](https://react.dev/) (v19) com [TypeScript](https://www.typescriptlang.org/) para tipagem estática e segurança.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4 via Vite config plugin) e CSS customizado para os efeitos glassmorphism e sombras de neon.
- **Routing**: [React Router](https://reactrouter.com/) (v7) gerenciando navegação em Single Page Application (SPA).
- **Animações**: [Framer Motion](https://www.framer.com/motion/) para transições de entrada, micro-interações de botões e o menu lateral mobile.
- **Backend & Auth (Preparado)**: Integração modular pronta para receber o [Supabase](https://supabase.com/) para autenticação de clientes e sincronização de dados de projetos.
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter/introduction.html) rodando análises estáticas ultra-rápidas para assegurar a qualidade do código.

---

## 📁 Estrutura de Diretórios

```bash
automation-test/
├── documentacao/            # Requisitos e diretrizes de design (Design System)
├── public/                  # Ativos estáticos e mídias públicas
├── src/
│   ├── assets/              # Estilos e mídias compiladas
│   ├── components/          # Componentes visuais reutilizáveis (Header, Footer, CTA)
│   ├── data/                # Bases de dados locais e constantes
│   ├── layouts/             # Wrappers estruturais (Public Layout, Dashboard Layout)
│   ├── pages/               # Views / Páginas da SPA (Home, ProductPage, Login)
│   │   └── Dashboard/       # Sub-rotas e seções internas da Área Logada
│   ├── App.tsx              # Roteador central e inicialização
│   ├── main.tsx             # Ponto de entrada do React
│   └── index.css            # Customização de camadas base e regras Tech-Luxo
├── tailwind.config.js       # Tokens de cores de design estendidas
└── vite.config.ts           # Configurações do bundler Vite
```

---

## 🚀 Como Executar o Projeto Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/automation-test.git
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
O servidor local iniciará e o projeto estará disponível no endereço indicado no terminal (usualmente `http://localhost:5173`).

### 4. Compilar para produção (Build)
Para gerar o pacote de produção otimizado na pasta `/dist`:
```bash
npm run build
```

### 5. Executar o Linter
Para validar as boas práticas de desenvolvimento no código:
```bash
npm run lint
```
