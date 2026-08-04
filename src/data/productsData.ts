import { 
  Globe, 
  Rocket, 
  ShoppingBag, 
  Calendar, 
  Database, 
  Zap, 
  Bot, 
  Cpu, 
  MessageSquare, 
  Terminal, 
  ShieldCheck, 
  Layout, 
  Search, 
  Smartphone, 
  Code2, 
  Workflow, 
  Sparkles, 
  Layers, 
  Clock, 
  Lock, 
  BarChart3, 
  CheckCircle2, 
  FileText, 
  Users, 
  CreditCard 
} from 'lucide-react'
import type { ElementType } from 'react'

export interface PilarProduto {
  titulo: string
  descricao: string
  icone: string
}

export interface EtapaRoadmap {
  passo: number
  titulo: string
  descricao: string
}

export interface Product {
  id: string
  slug: string
  nome: string
  title: string // Alias para nome (compatibilidade)
  categoria: string
  subtitulo: string
  descricaoExecutiva: string
  badge: string
  description: string // Alias para descricaoExecutiva (compatibilidade)
  descricaoLonga: string
  beneficios: string[]
  tecnologias: string[]
  icon: ElementType
  bgImage: string
  oQueCompoe: PilarProduto[]
  roadmap: EtapaRoadmap[]
}

export const productsData: Product[] = [
  {
    id: 'prod-site-institucional',
    slug: 'site-institucional',
    nome: 'Site Institucional',
    title: 'Site Institucional',
    categoria: 'Design / Web Design',
    subtitulo: 'Autoridade digital e performance extrema sob medida para sua marca',
    badge: 'Autoridade Digital',
    descricaoExecutiva: 'Desenvolvimento de portais corporativos sob medida para consolidar a presença online da sua empresa com velocidade e otimização avançada de SEO. Construído sob a arquitetura Tech-Luxo em React e Vite em CDN global, eliminando a lentidão e vulnerabilidades de CMSs legados como WordPress.',
    description: 'Desenvolvimento de portais corporativos sob medida para consolidar a presença online da sua empresa com velocidade e otimização avançada de SEO.',
    descricaoLonga: 'Nossos sites institucionais são construídos com React e integrados com soluções de SEO de última geração. Em vez de utilizar plataformas lentas com dezenas de plugins, criamos estruturas estáticas hiper-rápidas que carregam instantaneamente em qualquer dispositivo. Isso eleva seu posicionamento orgânico no Google, reduz a taxa de rejeição e projeta extrema autoridade corporativa.',
    beneficios: [
      'Carregamento Instantâneo (< 1s)',
      'SEO Técnico Avançado e Indexação Google',
      'Código Limpo, Modular e Seguro',
      'Design Exclusivo em Efeito Glassmorphism',
      'Hospedagem em CDN Global Distribuída'
    ],
    tecnologias: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    icon: Globe,
    bgImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'UI/UX Design Tech-Luxo',
        descricao: 'Interface visual exclusiva adaptada à identidade de marca, com tipografia moderna, efeitos glassmorphism e paleta de alto impacto.',
        icone: 'Layout'
      },
      {
        titulo: 'Arquitetura JAMstack Otimizada',
        descricao: 'Frontend desvinculado de servidores pesados, entregue via edge network para carregamento ultra-rápido.',
        icone: 'Globe'
      },
      {
        titulo: 'Engenharia de SEO & Metadados',
        descricao: 'Estruturação de tags OpenGraph, dados estruturados JSON-LD e sitemaps dinâmicos para indexação no Google.',
        icone: 'Search'
      },
      {
        titulo: 'Responsividade Líquida & Mobile-First',
        descricao: 'Experiência perfeita em todos os tamanhos de tela, de smartphones a monitores ultrawide 4K.',
        icone: 'Smartphone'
      },
      {
        titulo: 'Segurança & Criptografia SSL',
        descricao: 'Proteção total contra invasões e headers de segurança HTTP modernos pré-configurados.',
        icone: 'ShieldCheck'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Briefing & Arquitetura', descricao: 'Alinhamento dos objetivos corporativos, análise da concorrência e definição da hierarquia de páginas.' },
      { passo: 2, titulo: 'Wireframe & Prototipagem', descricao: 'Criação da estrutura visual e mapas de navegação em alta fidelidade para aprovação.' },
      { passo: 3, titulo: 'Desenvolvimento Front-End', descricao: 'Codificação modular em React + Tailwind CSS seguindo padrões SOLID e DRY.' },
      { passo: 4, titulo: 'Otimização & Performance', descricao: 'Auditoria Lighthouse, compressão de ativos e ajustes de velocidade de renderização.' },
      { passo: 5, titulo: 'Homologação & Revisão', descricao: 'Testes de navegabilidade, formulários e integração em ambiente de validação.' },
      { passo: 6, titulo: 'Lançamento & Go-Live', descricao: 'Apontamento de domínio DNS, emissão de certificado SSL e publicação em CDN.' }
    ]
  },
  {
    id: 'prod-landing-page',
    slug: 'landing-page',
    nome: 'Landing Page',
    title: 'Landing Page',
    categoria: 'Design / Web Design',
    subtitulo: 'Páginas de alta conversão para acelerar captação de leads e ROI em tráfego',
    badge: 'Foco em Conversão',
    descricaoExecutiva: 'Páginas otimizadas de alta performance criadas para capturar leads qualificados e acelerar o retorno de campanhas de tráfego pago (Google Ads, Meta Ads). Com carregamento em menos de 1 segundo e pontuação máxima no Google Lighthouse, maximizamos a taxa de conversão do seu funil.',
    description: 'Páginas otimizadas de alta performance criadas para capturar leads qualificados e acelerar o retorno de campanhas de tráfego pago.',
    descricaoLonga: 'Cada segundo de lentidão em uma Landing Page custa orçamento de mídia pago. Desenvolvemos páginas focadas em experiência do usuário e velocidade máxima. Integramos nativamente com seu CRM, WhatsApp e ferramentas de analytics para rastreamento de eventos em tempo real.',
    beneficios: [
      'Pontuação Máxima no Google Lighthouse',
      'Rastreamento Avançado (Pixel Meta, GA4)',
      'Formulários Inteligentes com Proteção Duplicados',
      'Design Direcionado a Chamadas de Ação (CTA)',
      'Integração Nativa de Webhooks com CRMs'
    ],
    tecnologias: ['React', 'Tailwind CSS', 'Framer Motion', 'Google Analytics', 'Meta Pixel'],
    icon: Rocket,
    bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Copywriting & Seções Estratégicas',
        descricao: 'Estruturação persuasiva de gatilhos mentais, dores do cliente, benefícios e provas sociais.',
        icone: 'FileText'
      },
      {
        titulo: 'Formulários Inteligentes Multi-Etapas',
        descricao: 'Coleta otimizada de informações sem gerar atrito ou abandono na navegação.',
        icone: 'Users'
      },
      {
        titulo: 'Velocidade Sub-Segundo',
        descricao: 'Ativos minificados e carregamento progressivo para retenção total de visitantes de tráfego pago.',
        icone: 'Zap'
      },
      {
        titulo: 'Rastreamento de Conversão',
        descricao: 'Disparo de eventos customizados para otimização de algoritmos de anúncios do Meta e Google.',
        icone: 'BarChart3'
      },
      {
        titulo: 'Botões Flutuantes & CTAs Diretos',
        descricao: 'Encaminhamento rápido para o WhatsApp ou formulário de proposta técnica com 1 clique.',
        icone: 'MessageSquare'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Alinhamento da Oferta', descricao: 'Estudo do produto ou serviço, perfil do lead ideal e definição da proposta de valor central.' },
      { passo: 2, titulo: 'Estruturação da Copy', descricao: 'Redação da narrativa persuasiva, títulos de impacto e organização das chamadas para ação.' },
      { passo: 3, titulo: 'Design & Prototipagem', descricao: 'Criação do layout exclusivo no padrão Tech-Luxo com foco na experiência mobile.' },
      { passo: 4, titulo: 'Engenharia Front-End', descricao: 'Construção rápida e otimizada da página com componentes responsivos.' },
      { passo: 5, titulo: 'Integração de Pixels & CRM', descricao: 'Instalação das tags de rastreamento e conexão de formulários com o CRM/n8n.' },
      { passo: 6, titulo: 'Publicação & Validação', descricao: 'Testes de velocidade, envio de leads de teste e liberação para tráfego pago.' }
    ]
  },
  {
    id: 'prod-ecommerce',
    slug: 'ecommerce',
    nome: 'E-Commerce Headless',
    title: 'E-Commerce Headless',
    categoria: 'Desenvolvimento Web',
    subtitulo: 'Plataforma de comércio eletrônico robusta com checkout fluido e alta velocidade',
    badge: 'E-Commerce Completo',
    descricaoExecutiva: 'Sistemas de comércio eletrônico robustos, painéis de gestão integrados e checkout fluido para impulsionar suas vendas de ponta a ponta. Arquitetura headless com React e Supabase, oferecendo segurança máxima, alto desempenho e controle total de catálogo e pedidos.',
    description: 'Sistemas de comércio eletrônico robustos, painéis de gestão integrados e checkout fluido para impulsionar suas vendas de ponta a ponta.',
    descricaoLonga: 'Desenvolvemos e-commerces completos sob medida, descartando plataformas genéricas e pesadas. Com integrações de gateways de pagamento modernos (Stripe, PIX), o processo de compra é simples e sem atritos, reduzindo drasticamente o abandono de carrinho.',
    beneficios: [
      'Checkout Transparente e Sem Fricções',
      'Painel de Gestão de Catálogo e Vendas',
      'Integração com Gateways de Pagamento & PIX',
      'Controle Automático de Estoque e Clientes',
      'Segurança Avançada de Dados Transacionais'
    ],
    tecnologias: ['React', 'Supabase', 'Stripe', 'Tailwind CSS', 'Node.js'],
    icon: ShoppingBag,
    bgImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Catálogo Dinâmico de Produtos',
        descricao: 'Filtros avançados, categorias, variações de atributos (tamanho, cor) e busca instantânea.',
        icone: 'ShoppingBag'
      },
      {
        titulo: 'Carrinho & Checkout Fluidos',
        descricao: 'Fluxo de pagamento limpo sem redirecionamentos externos confusos, com cálculo de frete.',
        icone: 'CreditCard'
      },
      {
        titulo: 'Painel Administrativo Próprio',
        descricao: 'Gestão intuitiva de pedidos, alteração de status de entregas e cadastro de novos itens.',
        icone: 'Database'
      },
      {
        titulo: 'Integração de Gateways & PIX',
        descricao: 'Recebimento seguro via Cartão de Crédito, PIX com confirmação via webhook em tempo real.',
        icone: 'Lock'
      },
      {
        titulo: 'Segurança & Auditoria de Pedidos',
        descricao: 'Criptografia de ponta a ponta e controle estrito de acessos aos dados dos clientes.',
        icone: 'ShieldCheck'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Mapeamento de Produtos', descricao: 'Estruturação das categorias, atributos de produtos e regras de precificação/frete.' },
      { passo: 2, titulo: 'Design do E-Commerce', descricao: 'Prototipagem das telas de vitrine, página do produto, carrinho e painel administrativo.' },
      { passo: 3, titulo: 'Modelagem de Banco de Dados', descricao: 'Construção das tabelas relacionais de produtos, clientes e faturas no Postgres.' },
      { passo: 4, titulo: 'Integração de Pagamentos', descricao: 'Conexão dos gateways (Stripe, Mercado Pago) e rotas de webhooks de confirmação.' },
      { passo: 5, titulo: 'Testes Transacionais', descricao: 'Simulação completa de compras, geração de faturas e testes de segurança RLS.' },
      { passo: 6, titulo: 'Lançamento da Loja', descricao: 'Publicação oficial do e-commerce e ativação da esteira de atendimento.' }
    ]
  },
  {
    id: 'prod-agendamento-inteligente',
    slug: 'agendamento-inteligente',
    nome: 'Sistema de Agendamento Inteligente',
    title: 'Sistema de Agendamento Inteligente',
    categoria: 'Desenvolvimento Web',
    subtitulo: 'Gestão autônoma de marcação de horários e atendimento ao cliente',
    badge: 'Reservas & Marcações',
    descricaoExecutiva: 'Plataformas intuitivas de reserva e controle de horários com notificações automáticas para otimizar o fluxo de atendimento da sua equipe. Permite que seus clientes escolham serviços, profissionais e horários 24 horas por dia sem intermediários.',
    description: 'Plataformas intuitivas de reserva e controle de horários com notificações automáticas para otimizar o fluxo de atendimento.',
    descricaoLonga: 'Elimine o atrito de trocas manuais de mensagens para marcar reuniões ou consultas. Nossa plataforma oferece sincronização em tempo real com calendários corporativos e envio de lembretes automáticos para diminuir taxas de ausência (no-show).',
    beneficios: [
      'Agendamento Online 24 Horas por Dia',
      'Lembretes Automáticos por E-mail e WhatsApp',
      'Sincronização Bidirecional com Google Calendar',
      'Painel Multi-Profissional e Gestão de Agendas',
      'Regras de Bloqueio e Feriados Personalizáveis'
    ],
    tecnologias: ['React', 'Supabase', 'Twilio', 'Tailwind CSS', 'Google Calendar API'],
    icon: Calendar,
    bgImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Grade de Horários Dinâmica',
        descricao: 'Seleção intuitiva de data, horário disponível e profissional conforme regras de atendimento.',
        icone: 'Calendar'
      },
      {
        titulo: 'Lembretes & Disparos WhatsApp',
        descricao: 'Notificações automáticas pré-atendimento para confirmação ou reagendamento de clientes.',
        icone: 'MessageSquare'
      },
      {
        titulo: 'Sincronização Google Calendar',
        descricao: 'Integração bidirecional garantindo que novos compromissos sejam espelhados na agenda oficial.',
        icone: 'Clock'
      },
      {
        titulo: 'Painel Multi-Atendente',
        descricao: 'Visão consolidada para gerentes e profissionais acompanharem seus compromissos diários.',
        icone: 'Users'
      },
      {
        titulo: 'Histórico & CRM de Clientes',
        descricao: 'Registro centralizado dos atendimentos passados, preferências e dados de contato.',
        icone: 'Database'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Levantamento de Regras', descricao: 'Definição das etapas de agendamento, duração dos serviços e horários de funcionamento.' },
      { passo: 2, titulo: 'Design do Fluxo de Reserva', descricao: 'Criação de uma experiência simples de marcação em 3 cliques para o cliente final.' },
      { passo: 3, titulo: 'Integração de APIs de Agenda', descricao: 'Conexão com Google Calendar e APIs de mensageria para confirmações.' },
      { passo: 4, titulo: 'Painel de Controle Interno', descricao: 'Construção da área administrativa para gestão de horários e equipes.' },
      { passo: 5, titulo: 'Testes de Concorrência', descricao: 'Simulação de reservas simultâneas para garantir ausência de choque de horários.' },
      { passo: 6, titulo: 'Deploy & Onboarding', descricao: 'Publicação do sistema e treinamento da equipe de atendimento.' }
    ]
  },
  {
    id: 'prod-erp-commercial',
    slug: 'erp-commercial',
    nome: 'ERP Commercial SaaS',
    title: 'ERP Commercial SaaS',
    categoria: 'Sistemas & ERP',
    subtitulo: 'Gestão empresarial integrada para controle financeiro, estoque e operações',
    badge: 'Sistemas & ERP',
    descricaoExecutiva: 'Plataforma completa de gestão empresarial (ERP) desenvolvida sob medida para centralizar faturamento, relatórios financeiros, cadastro de clientes e fluxo de caixa com controle estrito de permissões (RLS) e suporte a múltiplos módulos corporativos.',
    description: 'Plataforma completa de gestão empresarial desenvolvida sob medida para centralizar faturamento, estoque e operações.',
    descricaoLonga: 'Substitua planilhas desconectadas por um sistema ERP corporativo seguro e escalável. Oferecemos visão estratégica completa do seu negócio com dados em tempo real, emissão de faturas, controle de mensalidades recorrentes e gestão simplificada.',
    beneficios: [
      'Visão Geral Financeira & DRE em Tempo Real',
      'Controle de Faturas, Mensalidades e Recorrência',
      'Gestão Centralizada de Perfis (Clientes/Admins)',
      'Segurança Estrita de Dados com Supabase RLS',
      'Módulos Expansíveis sob Medida'
    ],
    tecnologias: ['React', 'TypeScript', 'Supabase PostgreSQL', 'Tailwind CSS', 'Recharts'],
    icon: Database,
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Módulo Financeiro & Faturamento',
        descricao: 'Emissão e controle de cobranças de entrada, mensalidades e relatórios de fluxo de caixa.',
        icone: 'CreditCard'
      },
      {
        titulo: 'Gestão de Clientes & Projetos',
        descricao: 'Cadastro estruturado de perfis PF/PJ, histórico de contratos e status de evolução.',
        icone: 'Users'
      },
      {
        titulo: 'Relatórios & Dashboards Visuais',
        descricao: 'Gráficos interativos apresentando faturamento mensal, margens e projeção de receita.',
        icone: 'BarChart3'
      },
      {
        titulo: 'Segurança RLS & Permissões',
        descricao: 'Níveis de acesso distintos para Administradores e Clientes protegidos via banco relacional.',
        icone: 'Lock'
      },
      {
        titulo: 'Catálogo de Produtos & Serviços',
        descricao: 'Gerenciamento dos preços de setup, mensalidades e especificações operacionais.',
        icone: 'Layers'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Mapeamento de Processos', descricao: 'Estudo detalhado dos fluxos operacionais, financeiros e operacionais da empresa.' },
      { passo: 2, titulo: 'Arquitetura de Dados RLS', descricao: 'Modelagem de entidades, tabelas e políticas de segurança Row Level Security no PostgreSQL.' },
      { passo: 3, titulo: 'Desenvolvimento dos Módulos', descricao: 'Construção das telas de dashboard, clientes, faturas e controle de produtos.' },
      { passo: 4, titulo: 'Regras Financeiras & Cálculos', descricao: 'Implementação dos algoritmos de cálculo de recorrência, status de faturas e saldo.' },
      { passo: 5, titulo: 'Homologação de Segurança', descricao: 'Auditoria de dados para garantir isolamento de informações entre perfis.' },
      { passo: 6, titulo: 'Implantação Operacional', descricao: 'Migração de dados legados, treinamento dos colaboradores e ativação.' }
    ]
  },
  {
    id: 'prod-automacao-n8n',
    slug: 'automacao-n8n',
    nome: 'Automação de Processos com n8n',
    title: 'Automação de Processos com n8n',
    categoria: 'Automações de Processos',
    subtitulo: 'Conexão de sistemas, webhooks e eliminação de tarefas manuais repetitivas',
    badge: 'Automação & Webhooks',
    descricaoExecutiva: 'Fluxos automatizados de alta performance que conectam suas ferramentas, bancos de dados, CRMs e canais de mensageria via n8n. Elimine erros humanos e garanta o processamento de dados em tempo real em segundo plano.',
    description: 'Fluxos automatizados que conectam suas ferramentas, bancos de dados e canais para eliminar tarefas manuais repetitivas.',
    descricaoLonga: 'Conecte seus sistemas sem necessidade de código manual frágil. Criamos fluxos de trabalho no n8n para direcionar formulários ao CRM, gerar propostas em PDF automaticamente, emitir cobranças e enviar alertas imediatos via WhatsApp.',
    beneficios: [
      'Integração Instantânea entre Ferramentas Web',
      'Disparos Automáticos e Personalizados no WhatsApp',
      'Geração Automática de Documentos e PDFs',
      'Zero Erro Humano em Tarefas Repetitivas',
      'Monitoramento e Logs de Execução 24/7'
    ],
    tecnologias: ['Node.js', 'n8n Workflow Engine', 'PostgreSQL', 'Supabase Webhooks', 'WhatsApp API'],
    icon: Zap,
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Orquestração de Webhooks',
        descricao: 'Captura imediata de eventos de formulários, sistemas de pagamento e disparos externos.',
        icone: 'Workflow'
      },
      {
        titulo: 'Manipulação de Dados via Code Nodes',
        descricao: 'Transformação, tratamento e higienização de payloads JSON em JavaScript/TypeScript.',
        icone: 'Code2'
      },
      {
        titulo: 'Automação WhatsApp & Mensageria',
        descricao: 'Envio de mensagens personalizadas, links de pagamento e propostas em tempo real.',
        icone: 'MessageSquare'
      },
      {
        titulo: 'Sincronização de Banco de Dados',
        descricao: 'Atualização atômica de cadastros em tabelas Postgres sem intervenção humana.',
        icone: 'Database'
      },
      {
        titulo: 'Tratamento de Exceções & Retentativas',
        descricao: 'Arquitetura resiliente com alertas automáticos em caso de falha em serviços de terceiros.',
        icone: 'ShieldCheck'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Diagnóstico de Gargalos', descricao: 'Identificação das tarefas manuais mais repetitivas e lentas na rotina da empresa.' },
      { passo: 2, titulo: 'Mapeamento de Endpoints', descricao: 'Catalogação das APIs, chaves de autenticação e estruturas de webhooks necessárias.' },
      { passo: 3, titulo: 'Construção dos Workflows', descricao: 'Montagem e configuração visual e programática dos fluxos de trabalho no n8n.' },
      { passo: 4, titulo: 'Testes de Carga & Validação', descricao: 'Envio de múltiplos cenários de dados para garantir resiliência e tratamento de erros.' },
      { passo: 5, titulo: 'Homologação com a Equipe', descricao: 'Acompanhamento das execuções em tempo real junto aos operadores.' },
      { passo: 6, titulo: 'Produção & Monitoramento', descricao: 'Ativação em ambiente de produção com logs e métricas de execução contínuas.' }
    ]
  },
  {
    id: 'prod-agente-ia-247',
    slug: 'agente-ia-247',
    nome: 'Agente de IA 24/7',
    title: 'Agente de IA 24/7',
    categoria: 'Inteligência Artificial',
    subtitulo: 'Atendimento autônomo e qualificação de leads com IA gerativa contextualizada',
    badge: 'IA & Atendimento 24/7',
    descricaoExecutiva: 'Agentes de inteligência artificial treinados com a base de conhecimento exclusiva da sua empresa para atender clientes, responder dúvidas técnicas, qualificar leads e agendar reuniões no WhatsApp ou Web de forma ininterrupta.',
    description: 'Robôs inteligentes integrados capazes de responder dúvidas, qualificar contatos e direcionar leads em tempo integral.',
    descricaoLonga: 'Ofereça um atendimento de nível especialista a qualquer hora do dia ou da noite. Nossos Agentes de IA utilizam técnicas avançadas de RAG (Retrieval-Augmented Generation) para consultar seus manuais, tabelas e processos, respondendo com precisão corporativa.',
    beneficios: [
      'Disponibilidade Ininterrupta (24 horas por dia, 7 dias por semana)',
      'Respostas Contextualizadas via Base RAG',
      'Qualificação Automática de Leads e Sondagem',
      'Integração Nativa com WhatsApp e Web Chat',
      'Transição Fluida para Atendimento Humano'
    ],
    tecnologias: ['React', 'OpenAI API / Gemini API', 'Supabase Vector Store', 'LangChain', 'Node.js'],
    icon: Bot,
    bgImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Conexão com Base de Conhecimento RAG',
        descricao: 'Ingestão inteligente de documentos corporativos, FAQs e manuais para respostas sem alucinações.',
        icone: 'Sparkles'
      },
      {
        titulo: 'Modelos de Linguagem de Ponta (LLMs)',
        descricao: 'Utilização dos modelos GPT-4o e Claude 3.5 para conversas naturais e fluidas.',
        icone: 'Bot'
      },
      {
        titulo: 'Qualificação Automática de Contatos',
        descricao: 'Filtro e triagem de leads perguntando necessidade, orçamento e urgência antes de agendar.',
        icone: 'Users'
      },
      {
        titulo: 'Integração Multicanal (WhatsApp/Web)',
        descricao: 'Presença onde seu cliente está, mantendo o mesmo contexto histórico de conversas.',
        icone: 'MessageSquare'
      },
      {
        titulo: 'Handover Humano-IA',
        descricao: 'Mecanismo de transferência automática para o time de vendas quando o lead é altamente qualificado.',
        icone: 'Workflow'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Ingestão de Dados & FAQs', descricao: 'Coleta de manuais, tabelas de preços e histórico de atendimento para criar a base RAG.' },
      { passo: 2, titulo: 'Engenharia de Prompt & Tom', descricao: 'Definição da personalidade do agente, restrições corporativas e diretrizes éticas.' },
      { passo: 3, titulo: 'Configuração Vector Store', descricao: 'Indexação vetorial de documentos no banco de dados para busca de contexto hiper-rápida.' },
      { passo: 4, titulo: 'Integração de Canais', descricao: 'Conexão do motor de IA aos números de WhatsApp e widgets web do produto.' },
      { passo: 5, titulo: 'Simulação & Testes de Acurácia', descricao: 'Bateria de testes com perguntas desafiadoras para ajuste fino do modelo.' },
      { passo: 6, titulo: 'Deploy & Monitoramento', descricao: 'Liberação do agente para atendimento com painel de métricas e acompanhamento humano.' }
    ]
  }
]

// Mapeamento de slugs legados/alternativos para garantir busca resiliente
const slugAliases: Record<string, string> = {
  'sites-institucionais': 'site-institucional',
  'landing-pages': 'landing-page',
  'lojas-virtuais': 'ecommerce',
  'agendamentos': 'agendamento-inteligente',
  'erp-saas': 'erp-commercial',
  'automacoes': 'automacao-n8n',
  'agentes-de-ia-para-atendimento': 'agente-ia-247',
  'agentes-de-ia-especificos': 'agente-ia-247'
}

/**
 * Busca dados locais de produto pelo slug (suporta slugs exatos ou aliases legados)
 */
export function getLocalProductBySlug(slug: string): Product | undefined {
  const targetSlug = slugAliases[slug] || slug
  return productsData.find(p => p.slug === targetSlug)
}
