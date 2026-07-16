# Levantamento de Requisitos - Automation Test

Este documento consolida o levantamento de requisitos para a plataforma **Automation Test**. Ele é dividido em Requisitos Funcionais, Requisitos Não Funcionais e Regras de Negócio, servindo como guia de escopo para os ciclos de desenvolvimento.

---

## 1. Requisitos Funcionais (RF)

Os Requisitos Funcionais descrevem as funcionalidades que o portal e o painel de gerenciamento devem oferecer aos usuários.

### 1.1. Portal Institucional e Serviços (Landing Page)
*   **RF-001**: O sistema deve exibir uma Landing Page premium com a apresentação dos serviços de automação disponíveis.
*   **RF-002**: O sistema deve permitir que o usuário explore o catálogo de serviços web oferecidos.
*   **RF-003**: O sistema deve fornecer um formulário de contato integrado para solicitação de orçamentos personalizados.
*   **RF-004**: O sistema deve possuir uma área de autenticação (Login e Cadastro de clientes).
*   **RF-012**: O sistema deve possuir navegação global persistente e responsiva através de um cabeçalho fixo.

### 1.2. Painel do Cliente (Dashboard)
*   **RF-005**: O cliente autenticado deve ter acesso a um dashboard contendo o resumo dos serviços contratados.
*   **RF-006**: O painel deve exibir métricas de uso em tempo real dos serviços (ex: chamadas de API consumidas, status de servidores, relatórios de execução).
*   **RF-007**: O cliente deve poder abrir chamados de suporte técnico diretamente pelo painel.
*   **RF-008**: O cliente deve poder atualizar seus dados cadastrais e de faturamento.

### 1.3. Gestão de Clientes e Serviços (Administrador)
*   **RF-009**: O administrador do portal deve ter acesso a uma visão geral de todos os clientes cadastrados.
*   **RF-010**: O administrador deve poder ativar, suspender ou alterar o plano de serviços de qualquer cliente.
*   **RF-011**: O administrador deve poder monitorar logs de erros e alertas de integridade de serviços globais.

---

## 2. Requisitos Não Funcionais (RNF)

Os Requisitos Não Funcionais especificam os critérios de operação do sistema, como desempenho, usabilidade, segurança e confiabilidade.

### 2.1. Desempenho e Escalabilidade
*   **RNF-001**: O carregamento inicial de qualquer página do portal não deve exceder **1.5 segundos** sob conexões padrão de internet.
*   **RNF-002**: A aplicação deve ser construída no modelo SPA (Single Page Application) utilizando **React** e compilada com **Vite** para otimizar o empacotamento dos ativos.
*   **RNF-003**: Todas as animações de interface devem rodar a **60 FPS** consistentes, implementadas de forma otimizada via **Framer Motion**.

### 2.2. Usabilidade e Estética
*   **RNF-004**: A interface gráfica deve seguir rigorosamente o padrão visual **Tech-Luxo** detalhado no [Design System](file:///f:/automation-test/documentacao/design_system.md).
*   **RNF-005**: O sistema deve ser totalmente responsivo, garantindo excelente experiência de uso em dispositivos móveis, tablets e desktops de alta resolução.
*   **RNF-006**: A acessibilidade deve ser garantida por meio do uso correto de tags HTML semânticas e atributos ARIA.
*   **RNF-009**: A plataforma deve seguir o padrão visual Dark Mode focado em alto contraste e performance de renderização.
*   **RNF-010**: As páginas devem utilizar animações de entrada suaves (Fade e Transformação) para melhorar a percepção de qualidade do usuário sem prejudicar o tempo de carregamento.

### 2.3. Tecnologia e Custo
*   **RNF-007**: A infraestrutura do backend deve utilizar o **Supabase** (Banco de dados PostgreSQL relacional, Auth e Realtime) sob o plano gratuito (Free Tier).
*   **RNF-008**: O versionamento de código deve seguir o fluxo de trabalho **Git Flow** simplificado, utilizando convenções estruturadas para mensagens de commit.

---

## 3. Regras de Negócio (RN)

As Regras de Negócio definem as premissas operacionais e restrições de fluxo de trabalho do portal.

*   **RN-001 (Faturamento e Acesso)**: Clientes com faturas vencidas há mais de **5 dias úteis** terão seus serviços de automação suspensos automaticamente, permitindo apenas o acesso ao dashboard de faturamento para regularização.
*   **RN-002 (Criação de Conta)**: O e-mail informado no cadastro deve ser verificado antes de liberar o acesso a qualquer serviço ou painel da plataforma.
*   **RN-003 (Limites de Consumo)**: Cada plano de serviço de automação possui um limite mensal de requisições. Caso o cliente atinja **90%** do seu limite, uma notificação visual em destaque no dashboard e um alerta por e-mail devem ser gerados. Ao atingir **100%**, o serviço é pausado até o próximo ciclo ou upgrade de plano.
*   **RN-004 (Níveis de Acesso)**: Um usuário do tipo "Cliente" não pode, sob qualquer circunstância, visualizar ou manipular dados de outros clientes ou acessar painéis de administração global.
