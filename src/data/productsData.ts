import { 
  Globe, 
  Rocket, 
  ShoppingBag, 
  Calendar, 
  Database, 
  Zap, 
  Bot 
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
  title: string
  categoria: string
  subtitulo: string
  descricaoExecutiva: string
  badge: string
  description: string
  descricaoLonga: string
  beneficios: string[]
  tecnologias?: string[]
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
    subtitulo: 'Transforme visitantes em clientes pagantes com uma presença digital corporativa que transmite autoridade imediata.',
    badge: 'Autoridade & Credibilidade',
    descricaoExecutiva: 'Um site amador ou lento faz sua empresa perder contratos valiosos antes mesmo da primeira conversa. Desenvolvemos portais corporativos de alto padrão com design exclusivo, carregamento instantâneo e navegação impecável. Posicione sua marca como líder incontestável de mercado e conquiste a confiança de clientes exigentes desde o primeiro segundo.',
    description: 'Portais corporativos de alto padrão desenhados para posicionar sua marca como líder e fechar grandes contratos.',
    descricaoLonga: 'Sua empresa é julgada pela primeira impressão no mundo digital. Se o seu site atual carrega devagar, tem visual ultrapassado ou não funciona bem no celular, seus potenciais clientes procuram imediatamente o concorrente. Nosso portal corporativo resolve isso oferecendo uma experiência premium de nível internacional, que destaca a reputação do seu negócio e gera um fluxo constante de contatos qualificados.',
    beneficios: [
      'Posicionamento de Marca Corporativa Premium',
      'Carregamento Ultra-Rápido sem Travamentos',
      'Experiência Perfeita em Celulares e Computadores',
      'Destaque no Google para Busca Organicmente Qualificada',
      'Estrutura Inviolável de Alta Confiabilidade'
    ],
    icon: Globe,
    bgImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Design Exclusivo de Alto Impacto',
        descricao: 'Interface visual única adaptada à essência da sua marca, transmitindo sofisticação, profissionalismo e liderança.',
        icone: 'Layout'
      },
      {
        titulo: 'Carregamento Instantâneo',
        descricao: 'Abertura imediata de páginas que retém a atenção do visitante e evita a perda de potenciais clientes.',
        icone: 'Zap'
      },
      {
        titulo: 'Arquitetura Otimizada para o Google',
        descricao: 'Estruturação estratégica para que sua empresa seja encontrada por compradores no momento exato da busca.',
        icone: 'Search'
      },
      {
        titulo: 'Adaptação Perfeita para Mobile',
        descricao: 'Navegação fluida e confortável para executivos e decisores que navegam diretamente pelo smartphone.',
        icone: 'Smartphone'
      },
      {
        titulo: 'Proteção & Confiabilidade Máxima',
        descricao: 'Ambiente seguro e estável que garante disponibilidade contínua sem riscos de queda ou invasão.',
        icone: 'ShieldCheck'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Entendimento do Negócio', descricao: 'Mapeamento do perfil dos seus melhores clientes, concorrentes e diferenciais competitivos.' },
      { passo: 2, titulo: 'Arquitetura de Navegação', descricao: 'Desenho da estrutura visual e da jornada do visitante para guiar o cliente até o contato.' },
      { passo: 3, titulo: 'Criação do Design Premium', descricao: 'Desenvolvimento visual personalizado com estética exclusiva de alto padrão e aprovação da sua equipe.' },
      { passo: 4, titulo: 'Construção & Otimização', descricao: 'Montagem do portal garantindo máxima velocidade, responsividade e fluidez.' },
      { passo: 5, titulo: 'Validação Geral', descricao: 'Testes rigorosos de formulários, botões de WhatsApp e carregamento em múltiplos dispositivos.' },
      { passo: 6, titulo: 'Lançamento Oficial', descricao: 'Publicação do portal com suporte completo para início imediato das operações.' }
    ]
  },
  {
    id: 'prod-landing-page',
    slug: 'landing-page',
    nome: 'Landing Page',
    title: 'Landing Page',
    categoria: 'Design / Web Design',
    subtitulo: 'Pare de queimar orçamento em anúncios com páginas lentas. Converta cliques em vendas reais.',
    badge: 'Foco em Vendas & Leads',
    descricaoExecutiva: 'Investir em tráfego pago sem uma Landing Page de alta conversão é como tentar encher um balde furado: você gasta milhares de reais em anúncios, mas a maioria dos visitantes abandona a página antes mesmo de carregar. Criamos Landing Pages ultrarrápidas, persuasivas e estrategicamente estruturadas para capturar a atenção imediata do seu comprador e multiplicar suas vendas.',
    description: 'Páginas de alta velocidade e conversão para transformar investimento em tráfego em lucro real.',
    descricaoLonga: 'Seus anúncios geram cliques, mas as vendas não acontecem? O problema quase sempre está na página de destino. Se o visitante espera mais de 2 segundos para ver a oferta, ele fecha a aba. Nossa Landing Page elimina essa perda de dinheiro, entregando uma comunicação direta, persuasiva e com velocidade sub-segundo que conduz o cliente direto para o fechamento.',
    beneficios: [
      'Multiplicação da Taxa de Conversão de Anúncios',
      'Carregamento Sub-Segundo que Evita Abandono',
      'Narrativa Persuasiva Focada nas Dores do Comprador',
      'Rastreamento Exato de Qual Anúncio Gerou Cada Venda',
      'Integração Direta com seu WhatsApp e Vendedores'
    ],
    icon: Rocket,
    bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Comunicação Persuasiva de Alto Impacto',
        descricao: 'Textos e argumentos estruturados para tocar nas dores exatas do cliente e demonstrar sua solução como a única escolha.',
        icone: 'FileText'
      },
      {
        titulo: 'Formulários Simplificados sem Atrito',
        descricao: 'Coleta rápida de dados de contato sem burocracia para garantir que o comprador finalize o cadastro.',
        icone: 'Users'
      },
      {
        titulo: 'Abertura Ultra-Rápida de Página',
        descricao: 'Velocidade extrema para aproveitar 100% dos cliques vindos do Google Ads e Meta Ads sem perda de tráfego.',
        icone: 'Zap'
      },
      {
        titulo: 'Métricas & Rastreamento de Vendas',
        descricao: 'Medição precisa de conversões para saber exatamente qual campanha está gerando mais lucro.',
        icone: 'BarChart3'
      },
      {
        titulo: 'Chamadas Diretas para o Comercial',
        descricao: 'Botões estratégicos de contato instantâneo que colocam o cliente qualificado direto em conversa com seu vendedor.',
        icone: 'MessageSquare'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Diagnóstico da Oferta', descricao: 'Análise profunda do produto, perfil do comprador e principais objeções de vendas.' },
      { passo: 2, titulo: 'Estruturação Persuasiva', descricao: 'Criação do roteiro de argumentos e gatilhos que direcionam o visitante até a conversão.' },
      { passo: 3, titulo: 'Design de Alta Conversão', descricao: 'Elaboração de visual marcante focado em direcionar os olhos do cliente para a ação de compra.' },
      { passo: 4, titulo: 'Desenvolvimento Otimizado', descricao: 'Construção técnica focada em velocidade máxima de carregamento em qualquer conexão.' },
      { passo: 5, titulo: 'Conexão de Rastreamento', descricao: 'Configuração dos rastreadores de anúncios para otimizar suas campanhas ativas.' },
      { passo: 6, titulo: 'Publicação & Vendas', descricao: 'Página pronta para receber tráfego pago e iniciar a conversão imediata de leads.' }
    ]
  },
  {
    id: 'prod-ecommerce',
    slug: 'ecommerce',
    nome: 'E-Commerce Headless',
    title: 'E-Commerce Headless',
    categoria: 'Desenvolvimento Web',
    subtitulo: 'Elimine o abandono de carrinho com uma loja virtual ultrarrápida e pagamento sem atrito.',
    badge: 'Escala de Vendas Online',
    descricaoExecutiva: 'Cada segundo de lentidão ou complicação no checkout faz o cliente desistir da compra e ir para o concorrente. Nosso E-Commerce Headless entrega uma experiência de compra instantânea, com checkout fluido em poucos cliques, integração de PIX imediata e painel completo para você gerenciar seus pedidos e faturar mais sem dor de cabeça.',
    description: 'Loja virtual de alta velocidade e checkout transparente para maximizar suas vendas online.',
    descricaoLonga: 'Plataformas genéricas de e-commerce sofrem com travamentos em dias de promoção, checkouts confusos com formulários longos e taxas de abandono altíssimas. Desenvolvemos lojas virtuais sob medida com navegação fluida, atualização automática de estoque e recebimento via PIX e cartão sem fricção, permitindo que seu e-commerce venda em grande escala.',
    beneficios: [
      'Redução Drástica do Abandono de Carrinho',
      'Pagamento Instantâneo via PIX e Cartão sem Erros',
      'Painel Simples para Gerenciar Vendas e Estoque',
      'Navegação Ultra-Rápida em Celulares',
      'Infraestrutura Pronta para Suportar Altos Volumes de Acessos'
    ],
    icon: ShoppingBag,
    bgImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Vitrine de Produtos Atraente',
        descricao: 'Exibição clara de imagens, detalhes, variações de cor/tamanho e busca instantânea de itens.',
        icone: 'ShoppingBag'
      },
      {
        titulo: 'Checkout Transparente em 1 Clique',
        descricao: 'Processo de compra direto e sem páginas intermediárias confusas para garantir a finalização do pedido.',
        icone: 'CreditCard'
      },
      {
        titulo: 'Central de Gestão de Vendas',
        descricao: 'Painel intuitivo para acompanhar pedidos aprovados, emitir notas e atualizar entregas.',
        icone: 'Database'
      },
      {
        titulo: 'Confirmação Automática de Pagamento',
        descricao: 'Integração direta com PIX e gateways de cartão para liberação imediata do pedido.',
        icone: 'Lock'
      },
      {
        titulo: 'Cálculo Automático de Frete',
        descricao: 'Integração transparente com correios e transportadoras para exibição clara de prazos e valores.',
        icone: 'ShieldCheck'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Estruturação do Catálogo', descricao: 'Organização de categorias, produtos, variações e regras de frete da loja.' },
      { passo: 2, titulo: 'Design do E-Commerce', descricao: 'Prototipagem das páginas de produto e fluxo de pagamento focando em usabilidade.' },
      { passo: 3, titulo: 'Desenvolvimento do Sistema', descricao: 'Construção da loja virtual com foco em velocidade de navegação e segurança.' },
      { passo: 4, titulo: 'Integração Financeira', descricao: 'Conexão segura com os meios de pagamento PIX e cartão de crédito.' },
      { passo: 5, titulo: 'Simulação de Compras', descricao: 'Testes de pedidos, cálculos de frete e atualização de estoque em tempo real.' },
      { passo: 6, titulo: 'Abertura para Vendas', descricao: 'Loja virtual ativa e pronta para receber pedidos dos clientes.' }
    ]
  },
  {
    id: 'prod-agendamento-inteligente',
    slug: 'agendamento-inteligente',
    nome: 'Sistema de Agendamento Inteligente',
    title: 'Sistema de Agendamento Inteligente',
    categoria: 'Desenvolvimento Web',
    subtitulo: 'Acabe com a troca manual de mensagens e lote sua agenda 24h por dia no piloto automático.',
    badge: 'Automação de Agendas',
    descricaoExecutiva: 'Sua equipe perde horas respondendo mensagens no WhatsApp apenas para tentar alinhar horários disponíveis, e ainda assim sofre com faltas indevidas de clientes. Nosso Sistema de Agendamento Inteligente permite que seu cliente escolha o serviço e o horário ideal em segundos, confirma a reserva automaticamente e envia lembretes para garantir presença garantida.',
    description: 'Plataforma autônoma de marcação de horários que elimina atendimentos manuais e reduz faltas de clientes.',
    descricaoLonga: 'Gerenciar horários por mensagens avulsas gera confusão, sobreposição de compromissos e perda de novos clientes que querem agendar fora do horário de expediente. Com nossa plataforma, sua agenda fica aberta 24 horas por dia com atualização em tempo real, enviando confirmações diretas e organizando o fluxo de atendimento de toda a sua equipe.',
    beneficios: [
      'Agendamentos Autônomos 24 Horas por Dia',
      'Redução Drástica de Faltas (No-Shows) com Lembretes',
      'Zero Confusão ou Conflito de Horários',
      'Organização Inteligente de Múltiplos Atendentes',
      'Liberação da sua Equipe para Focar no Atendimento'
    ],
    icon: Calendar,
    bgImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Grade de Marcação Intuitiva',
        descricao: 'Visualização clara dos horários livres onde o cliente escolhe a data e horário ideal com poucos toques.',
        icone: 'Calendar'
      },
      {
        titulo: 'Lembretes Automáticos no WhatsApp',
        descricao: 'Envio automático de alertas de confirmação que lembram o cliente do compromisso com antecedência.',
        icone: 'MessageSquare'
      },
      {
        titulo: 'Sincronização de Agenda Corporativa',
        descricao: 'Conexão contínua com seu calendário para evitar agendamentos em horários já ocupados.',
        icone: 'Clock'
      },
      {
        titulo: 'Gestão da Equipe de Atendimento',
        descricao: 'Painel onde cada profissional visualiza seus compromissos e disponibilidades diárias.',
        icone: 'Users'
      },
      {
        titulo: 'Histórico de Atendimento ao Cliente',
        descricao: 'Registro completo de consultas anteriores, contatos e preferências de cada cliente.',
        icone: 'Database'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Mapeamento dos Serviços', descricao: 'Definição das durações, profissionais atendentes e horários de funcionamento.' },
      { passo: 2, titulo: 'Desenho do Fluxo de Reserva', descricao: 'Criação de um processo simples onde o cliente agenda em menos de 1 minuto.' },
      { passo: 3, titulo: 'Construção da Plataforma', descricao: 'Desenvolvimento do sistema com sincronização automática e regras de horários.' },
      { passo: 4, titulo: 'Configuração de Lembretes', descricao: 'Ativação dos disparos automáticos de confirmação de presença via mensagem.' },
      { passo: 5, titulo: 'Treinamento da Equipe', descricao: 'Apresentação do painel de controle simples para os profissionais acompanharem a agenda.' },
      { passo: 6, titulo: 'Liberação do Link de Agendamento', descricao: 'Divulgação do canal de agendamentos no seu site, redes sociais e WhatsApp.' }
    ]
  },
  {
    id: 'prod-erp-commercial',
    slug: 'erp-commercial',
    nome: 'ERP Commercial SaaS',
    title: 'ERP Commercial SaaS',
    categoria: 'Sistemas & ERP',
    subtitulo: 'Tome o controle total da sua empresa com gestão financeira e operacional centralizada em um só lugar.',
    badge: 'Controle & Gestão Empresarial',
    descricaoExecutiva: 'Gerenciar uma empresa através de planilhas desconectadas gera erros financeiros, atrasos de cobranças e cegueira sobre o lucro real do negócio. O ERP Commercial SaaS centraliza seu faturamento, controle de clientes, cobranças recorrentes e relatórios gerenciais em uma plataforma intuitiva, segura e ágil para você tomar decisões lucrativas com total confiança.',
    description: 'Sistema completo de gestão para controlar financeiro, vendas, faturas e clientes sem complicação.',
    descricaoLonga: 'Se você não sabe exatamente quanto sua empresa vai faturar no próximo mês ou perde tempo cobrando clientes manualmente, seu negócio está correndo riscos invisíveis. Nosso ERP elimina a bagunça operacional organizando faturas, contratos, pagamentos recorrentes e indicadores de desempenho em um painel claro e descomplicado.',
    beneficios: [
      'Visão Exata do Lucro e Faturamento em Tempo Real',
      'Automação de Faturas e Cobranças Recorrentes',
      'Fim da Dependência de Planilhas Lentas e Frágeis',
      'Controle Total de Clientes, Contratos e Serviços',
      'Acesso Seguro de Qualquer Lugar com Níveis de Permissão'
    ],
    icon: Database,
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Gestão Financeira & Faturamento',
        descricao: 'Emissão e controle de cobranças de entrada, mensalidades e relatórios de fluxo de caixa.',
        icone: 'CreditCard'
      },
      {
        titulo: 'Cadastro Estruturado de Clientes',
        descricao: 'Centralização de dados de contatos, histórico de contratos e status de cada cliente.',
        icone: 'Users'
      },
      {
        titulo: 'Dashboards & Indicadores de Desempenho',
        descricao: 'Gráficos simples que mostram a receita mensal, despesas e previsibilidade do negócio.',
        icone: 'BarChart3'
      },
      {
        titulo: 'Controle de Acessos & Segurança',
        descricao: 'Definição de o que cada colaborador ou administrador pode visualizar ou alterar.',
        icone: 'Lock'
      },
      {
        titulo: 'Gestão de Produtos & Serviços',
        descricao: 'Organização do catálogo de ofertas, valores de setup e mensalidades da empresa.',
        icone: 'Layers'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Mapeamento Financeiro', descricao: 'Estudo dos fluxos de caixa, modelos de cobrança e rotinas administrativas atuais.' },
      { passo: 2, titulo: 'Estruturação do Sistema', descricao: 'Modelagem do banco de dados focado em segurança estrita e agilidade de consulta.' },
      { passo: 3, titulo: 'Desenvolvimento dos Módulos', descricao: 'Construção das telas de controle financeiro, faturas, clientes e relatórios.' },
      { passo: 4, titulo: 'Configuração de Cobranças', descricao: 'Definição das regras de notificação de faturas e controle de inadimplência.' },
      { passo: 5, titulo: 'Validação Operacional', descricao: 'Testes de precisão dos cálculos financeiros e auditoria de segurança de dados.' },
      { passo: 6, titulo: 'Implantação no Negócio', descricao: 'Organização dos dados iniciais, treinamento dos usuários e início do uso.' }
    ]
  },
  {
    id: 'prod-automacao-n8n',
    slug: 'automacao-n8n',
    nome: 'Automação de Processos com n8n',
    title: 'Automação de Processos com n8n',
    categoria: 'Automações de Processos',
    subtitulo: 'Elimine o trabalho braçal e conecte seus sistemas para sua operação rodar sem falhas humanas.',
    badge: 'Eficiência Operacional',
    descricaoExecutiva: 'Sua equipe gasta horas valiosas copiando dados de planilhas, enviando e-mails manualmente e digitando propostas em sistemas diferentes. Com a Automação de Processos, conectamos todas as suas ferramentas para que tarefas repetitivas sejam executadas instantaneamente em segundo plano, reduzindo custos operacionais e liberando seu time para focar no crescimento do negócio.',
    description: 'Integração total de sistemas para automatizar tarefas repetitivas, envios e processos operacionais.',
    descricaoLonga: 'Erros de digitação, esquecimento de envios e atrasos no repasse de informações acontecem quando o trabalho operacional é 100% humano. Criamos fluxos inteligentes que conectam seu site, CRM, e-mail e WhatsApp para que novos cadastros gerem propostas automáticas, avisem vendedores e atualizem seu banco de dados sem que ninguém precise mover um dedo.',
    beneficios: [
      'Eliminação de Tarefas Manuais Repetitivas',
      'Zero Erros de Digitação ou Perda de Informações',
      'Velocidade Instantânea no Processamento de Dados',
      'Conexão Fluida entre Todas as Suas Ferramentas',
      'Redução Significativa nos Custos Operacionais'
    ],
    icon: Zap,
    bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Conexão Automática entre Sistemas',
        descricao: 'Troca de informações em tempo real entre formulários do site, WhatsApp, e-mail e CRM.',
        icone: 'Workflow'
      },
      {
        titulo: 'Tratamento & Organização de Dados',
        descricao: 'Limpeza e padronização automática de cadastros de clientes sem intervenção manual.',
        icone: 'Code2'
      },
      {
        titulo: 'Disparos Automáticos no WhatsApp',
        descricao: 'Envio imediato de confirmações, links de pagamentos e propostas direto para o cliente.',
        icone: 'MessageSquare'
      },
      {
        titulo: 'Sincronização de Banco de Dados',
        descricao: 'Atualização instantânea do status de pedidos e cadastros em todas as suas telas.',
        icone: 'Database'
      },
      {
        titulo: 'Alerta & Monitoramento Continuo',
        descricao: 'Sistema inteligente de avisos imediatos em caso de qualquer inconsistência operacional.',
        icone: 'ShieldCheck'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Mapeamento de Gargalos', descricao: 'Identificação das rotinas manuais que mais consomem tempo e geram erros na sua empresa.' },
      { passo: 2, titulo: 'Desenho das Automações', descricao: 'Criação do mapa de fluxo de como os dados vão trafegar entre suas ferramentas.' },
      { passo: 3, titulo: 'Construção dos Fluxos', descricao: 'Configuração e programação da esteira de automação com conexão direta de APIs.' },
      { passo: 4, titulo: 'Testes de Confiabilidade', descricao: 'Simulação de múltiplos cenários para garantir que nenhuma informação seja perdida.' },
      { passo: 5, titulo: 'Acompanhamento Inicial', descricao: 'Monitoramento das primeiras execuções automáticas junto com a sua equipe.' },
      { passo: 6, titulo: 'Operação 100% Automática', descricao: 'Ativação definitiva da esteira gerando economia de tempo diária.' }
    ]
  },
  {
    id: 'prod-agente-ia-247',
    slug: 'agente-ia-247',
    nome: 'Agente de IA 24/7',
    title: 'Agente de IA 24/7',
    categoria: 'Inteligência Artificial',
    subtitulo: 'Atenda e qualifique clientes 24 horas por dia sem precisar aumentar sua equipe de vendas.',
    badge: 'Vendas & Atendimento 24/7',
    descricaoExecutiva: 'Mais de 60% dos leads de alto valor entram em contato à noite ou nos finais de semana. Se sua empresa demora para responder, o cliente compra do concorrente que atendeu primeiro. Nosso Agente de IA 24/7 responde dúvidas técnicas com precisão humana, qualifica a real intenção de compra do cliente e realiza o pré-agendamento de reuniões a qualquer hora do dia ou da noite.',
    description: 'Inteligência Artificial para atendimento ininterrupto, qualificação de leads e agendamentos de vendas.',
    descricaoLonga: 'Diferente de robôs antigos que respondem menus genéricos e irritam o comprador, nosso Agente de IA é treinado com todas as informações dos seus produtos e serviços. Ele conversa naturalmente no WhatsApp ou no site, entende o que o cliente precisa, tira dúvidas complexas e passa o comprador pronto para o seu vendedor fechar o contrato.',
    beneficios: [
      'Atendimento Instantâneo 24 Horas por Dia, 7 Dias por Semana',
      'Respostas Humanizadas Baseadas na Sua Empresa',
      'Filtro Automático dos Clientes Mais Lucrativos',
      'Presença no WhatsApp e no Site da Empresa',
      'Encaminhamento Direto de Compradores Prontos para Venda'
    ],
    icon: Bot,
    bgImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop',
    oQueCompoe: [
      {
        titulo: 'Treinamento Exclusivo do Negócio',
        descricao: 'IA capacitada com todos os manuais, preços e informações oficiais da sua empresa.',
        icone: 'Sparkles'
      },
      {
        titulo: 'Conversação Humana Avançada',
        descricao: 'Diálogos naturais e fluidos que tiram dúvidas técnicas com máxima cordialidade e clareza.',
        icone: 'Bot'
      },
      {
        titulo: 'Qualificação Inteligente de Leads',
        descricao: 'Perguntas estratégicas que identificam o orçamento e urgência do cliente antes do atendimento humano.',
        icone: 'Users'
      },
      {
        titulo: 'Presença Multicanal no WhatsApp',
        descricao: 'Integração no canal de mensagens preferido dos seus clientes com retenção de histórico.',
        icone: 'MessageSquare'
      },
      {
        titulo: 'Transferência para Vendedor Humano',
        descricao: 'Passagem automática do cliente quente direto para o WhatsApp da sua equipe de vendas.',
        icone: 'Workflow'
      }
    ],
    roadmap: [
      { passo: 1, titulo: 'Coleta de Informações', descricao: 'Reunião de todas as dúvidas frequentes, tabelas e regras comerciais do seu negócio.' },
      { passo: 2, titulo: 'Definição da Personalidade', descricao: 'Configuração do tom de voz, postura e limites do Agente de IA.' },
      { passo: 3, titulo: 'Treinamento do Motor de IA', descricao: 'Carregamento do conhecimento oficial da sua empresa no sistema de inteligência.' },
      { passo: 4, titulo: 'Conexão com WhatsApp e Site', descricao: 'Instalação do robô nos canais de comunicação com os clientes.' },
      { passo: 5, titulo: 'Testes de Diálogos', descricao: 'Simulações reais de conversas para garantir que todas as perguntas recebam respostas perfeitas.' },
      { passo: 6, titulo: 'Ativação do Atendimento 24/7', descricao: 'Agente ativo gerando oportunidades de vendas dia e noite.' }
    ]
  }
]

// Mapeamento amplo e resiliente de aliases e abreviações de URLs para garantir busca sem erros
const slugAliases: Record<string, string> = {
  // Agente de IA 24/7
  'agente-ia': 'agente-ia-247',
  'agente-ia-247': 'agente-ia-247',
  'agentes-de-ia-para-atendimento': 'agente-ia-247',
  'agentes-de-ia-especificos': 'agente-ia-247',
  'agente-de-ia': 'agente-ia-247',
  'agentes-de-ia': 'agente-ia-247',
  'ia-247': 'agente-ia-247',
  'ia': 'agente-ia-247',

  // Site Institucional
  'site-institucional': 'site-institucional',
  'sites-institucionais': 'site-institucional',
  'site': 'site-institucional',
  'sites': 'site-institucional',
  'site-institucionais': 'site-institucional',

  // Landing Page
  'landing-page': 'landing-page',
  'landing-pages': 'landing-page',
  'landing': 'landing-page',
  'landings': 'landing-page',

  // E-Commerce
  'ecommerce': 'ecommerce',
  'e-commerce': 'ecommerce',
  'lojas-virtuais': 'ecommerce',
  'loja-virtual': 'ecommerce',
  'loja': 'ecommerce',
  'lojas': 'ecommerce',

  // Sistema de Agendamento Inteligente
  'agendamento-inteligente': 'agendamento-inteligente',
  'agendamentos': 'agendamento-inteligente',
  'agendamento': 'agendamento-inteligente',
  'agendamento-online': 'agendamento-inteligente',

  // ERP Commercial SaaS
  'erp-commercial': 'erp-commercial',
  'erp-saas': 'erp-commercial',
  'erp': 'erp-commercial',
  'sistemas-erp': 'erp-commercial',
  'erp-comercial': 'erp-commercial',

  // Automação de Processos com n8n
  'automacao-n8n': 'automacao-n8n',
  'automacoes': 'automacao-n8n',
  'automacao': 'automacao-n8n',
  'n8n': 'automacao-n8n',
  'automacao-de-processos': 'automacao-n8n'
}

/**
 * Busca dados locais de produto pelo slug com busca inteligente em 3 estágios
 */
export function getLocalProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined
  const normalized = slug.toLowerCase().trim()

  // Estágio 1: Match direto pelo slug original ou pelo mapeador estrito de aliases
  const targetSlug = slugAliases[normalized] || normalized
  const exact = productsData.find(p => p.slug === targetSlug)
  if (exact) return exact

  // Estágio 2: Busca por palavras-chave centrais na URL digitada pelo usuário
  if (normalized.includes('ia') || normalized.includes('agente') || normalized.includes('bot')) {
    return productsData.find(p => p.slug === 'agente-ia-247')
  }
  if (normalized.includes('site')) {
    return productsData.find(p => p.slug === 'site-institucional')
  }
  if (normalized.includes('landing')) {
    return productsData.find(p => p.slug === 'landing-page')
  }
  if (normalized.includes('ecom') || normalized.includes('loja')) {
    return productsData.find(p => p.slug === 'ecommerce')
  }
  if (normalized.includes('agend')) {
    return productsData.find(p => p.slug === 'agendamento-inteligente')
  }
  if (normalized.includes('erp') || normalized.includes('saas')) {
    return productsData.find(p => p.slug === 'erp-commercial')
  }
  if (normalized.includes('auto') || normalized.includes('n8n')) {
    return productsData.find(p => p.slug === 'automacao-n8n')
  }

  // Estágio 3: Busca por inclusão parcial em qualquer slug ou id do produto
  return productsData.find(p => 
    p.slug.includes(normalized) || 
    normalized.includes(p.slug) ||
    p.id.includes(normalized)
  )
}
