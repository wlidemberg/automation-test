import { Globe, Rocket, ShoppingBag, Calendar, Cpu, MessageSquare, Terminal } from 'lucide-react'
import type { ElementType } from 'react'

export interface Product {
  id: string
  slug: string
  title: string
  badge: string
  description: string
  descricaoLonga: string
  beneficios: string[]
  tecnologias: string[]
  icon: ElementType
  bgImage: string
}

export const productsData: Product[] = [
  {
    id: 'prod-sites-institucionais',
    slug: 'sites-institucionais',
    title: 'Sites Institucionais',
    badge: 'Autoridade digital',
    description: 'Desenvolvimento de portais corporativos sob medida para consolidar a presença online da sua empresa com velocidade e otimização avançada de SEO.',
    descricaoLonga: 'Nossos sites institucionais são construídos com React e integrados com soluções de SEO de última geração. Em vez de utilizar plataformas lentas como WordPress, criamos estruturas estáticas hiper-rápidas que carregam instantaneamente. Isso melhora o posicionamento orgânico no Google, reduz a taxa de rejeição e passa uma imagem de extrema autoridade digital para sua empresa. Ideal para empresas de engenharia, consultorias e negócios de alto padrão que necessitam de uma vitrine digital impecável.',
    beneficios: [
      'Carregamento Instantâneo',
      'SEO Técnico Avançado',
      'Código Limpo e Seguro',
      'Design Exclusivo e Premium',
      'Hospedagem em CDN Global'
    ],
    tecnologias: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    icon: Globe,
    bgImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'prod-landing-pages',
    slug: 'landing-pages',
    title: 'Landing Pages',
    badge: 'Foco extremo em conversão',
    description: 'Páginas otimizadas de alta performance criadas para capturar leads qualificados e acelerar o retorno de campanhas de tráfego pago.',
    descricaoLonga: 'Cada segundo de carregamento em uma Landing Page pode custar milhares de reais em anúncios perdidos. Nossas Landing Pages são desenhadas focando na experiência do usuário e na velocidade de carregamento. Utilizando tecnologias modernas, garantimos pontuações máximas no Google Lighthouse. Integramos diretamente com seu CRM, WhatsApp e ferramentas de analytics para rastreamento de conversão em tempo real. A solução definitiva para infoprodutores, lançamentos e campanhas de Google/Meta Ads focadas em ROI.',
    beneficios: [
      'Pontuação Máxima Lighthouse',
      'Rastreamento de Leads Integrado',
      'Design Focado em Conversão',
      'Estrutura Ultra Responsiva',
      'Carregamento Menor que 1s'
    ],
    tecnologias: ['React', 'Tailwind CSS', 'Framer Motion', 'Google Analytics', 'Meta Pixel'],
    icon: Rocket,
    bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'prod-lojas-virtuais',
    slug: 'lojas-virtuais',
    title: 'Lojas Virtuais',
    badge: 'E-commerce completo',
    description: 'Sistemas de comércio eletrônico robustos, painéis de gestão integrados e checkout fluido para impulsionar suas vendas de ponta a ponta.',
    descricaoLonga: 'Criamos e-commerces completos utilizando uma arquitetura headless com React e Supabase, oferecendo segurança máxima e flexibilidade incomparável. Com integrações nativas como Stripe e gateways locais, o processo de pagamento é totalmente fluido e livre de fricções, diminuindo drasticamente o abandono de carrinho. Inclui um painel administrativo poderoso para gestão de estoque, pedidos e clientes sem depender de plugins pesados de terceiros.',
    beneficios: [
      'Checkout Fluido e Seguro',
      'Painel Administrativo Próprio',
      'Integração de Frete e Correios',
      'Gestão de Estoque em Tempo Real',
      'Pagamentos via Stripe e PIX'
    ],
    tecnologias: ['React', 'Supabase', 'Stripe', 'Tailwind CSS', 'Node.js'],
    icon: ShoppingBag,
    bgImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'prod-agendamentos',
    slug: 'agendamentos',
    title: 'Agendamentos',
    badge: 'Sistemas de reserva/marcação',
    description: 'Plataformas intuitivas de reserva e controle de horários com notificações automáticas para otimizar o fluxo de atendimento da sua equipe.',
    descricaoLonga: 'Gerencie o fluxo de atendimento da sua clínica, escritório ou empresa com uma plataforma de agendamento exclusiva. Esqueça sistemas prontos com taxas mensais caras. Desenvolvemos uma interface limpa onde seus clientes escolhem o profissional, data e horário com poucos cliques. Inclui automação de envio de lembretes por e-mail ou WhatsApp para reduzir ausências e cancelamentos de última hora.',
    beneficios: [
      'Painel de Controle Multi-Profissional',
      'Lembretes Automáticos por WhatsApp/E-mail',
      'Sincronização com Google Calendar',
      'Bloqueio Inteligente de Horários',
      'Histórico Completo do Cliente'
    ],
    tecnologias: ['React', 'Supabase', 'Twilio', 'Tailwind CSS', 'Google Calendar API'],
    icon: Calendar,
    bgImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'prod-automacoes',
    slug: 'automacoes',
    title: 'Automações',
    badge: 'Integrações e WhatsApp',
    description: 'Fluxos automatizados que conectam suas ferramentas, bancos de dados e canais do WhatsApp para eliminar tarefas manuais repetitivas.',
    descricaoLonga: 'Elimine o trabalho manual e erros operacionais conectando seus sistemas. Criamos fluxos de trabalho automáticos que enviam contatos do site diretamente para o CRM, geram contratos PDF dinamicamente, emitem notas fiscais e disparam mensagens personalizadas de WhatsApp. Tudo rodando em segundo plano de forma extremamente confiável e escalável utilizando APIs robustas.',
    beneficios: [
      'Sincronização Automática entre Sistemas',
      'Disparos Inteligentes via API do WhatsApp',
      'Geração Automática de Documentos/PDF',
      'Redução de Erros Manuais',
      'Relatórios de Sucesso da Automação'
    ],
    tecnologias: ['Node.js', 'n8n / Make', 'PostgreSQL', 'Supabase', 'WhatsApp API'],
    icon: Cpu,
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'prod-agentes-de-ia-para-atendimento',
    slug: 'agentes-de-ia-para-atendimento',
    title: 'Agentes de IA para Atendimento',
    badge: 'Chatbots inteligentes',
    description: 'Robôs inteligentes integrados capazes de responder dúvidas frequentes, qualificar contatos e direcionar leads em tempo integral.',
    descricaoLonga: 'Atenda seus clientes 24 horas por dia, 7 dias por semana, com inteligência artificial avançada baseada em LLMs. Nossos agentes de IA compreendem o contexto das conversas e consultam sua base de conhecimento própria para responder dúvidas complexas sobre seus produtos ou serviços, realizar triagem de leads, agendar reuniões e transferir atendimentos críticos para humanos de forma fluida.',
    beneficios: [
      'Disponibilidade 24/7',
      'Respostas Contextuais Inteligentes',
      'Integração Direta com WhatsApp/Web',
      'Qualificação Automática de Leads',
      'Painel de Transição Humano-IA'
    ],
    tecnologias: ['React', 'OpenAI API / Gemini API', 'Supabase Vector Store', 'LangChain', 'Node.js'],
    icon: MessageSquare,
    bgImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'prod-agentes-de-ia-especificos',
    slug: 'agentes-de-ia-especificos',
    title: 'Agentes de IA Específicos',
    badge: 'Soluções IA sob medida',
    description: 'Desenvolvimento de inteligência artificial personalizada para processamento interno de documentos, análise de relatórios e tomada de decisão.',
    descricaoLonga: 'Aumente a inteligência analítica da sua empresa com agentes autônomos de IA focados em processos internos. Se sua empresa lida com grandes volumes de dados, contratos, propostas comerciais ou planilhas complexas, desenvolvemos soluções de IA capazes de ler, extrair informações cruciais, analisar tendências de mercado, gerar relatórios técnicos automáticos e acelerar a tomada de decisões corporativas.',
    beneficios: [
      'Análise Automática de Documentos e PDFs',
      'Extração Inteligente de Metadados',
      'Automação de Relatórios Complexos',
      'Segurança de Dados Corporativos',
      'Tomada de Decisão Acelerada'
    ],
    tecnologias: ['Python / Node.js', 'LangChain / LangGraph', 'Vector Databases (Pinecone/Supabase)', 'Gemini 1.5 Pro / Claude 3.5 Sonnet', 'React'],
    icon: Terminal,
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'
  }
]
