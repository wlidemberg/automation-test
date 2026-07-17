import { 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  Check,
  Cpu,
  ArrowUpRight,
  ExternalLink,
  Sliders,
  Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Overview() {
  // Dynamically format today's date in Portuguese
  const today = new Date()
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const dateString = today.toLocaleDateString('pt-BR', dateOptions)
  const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)

  // Card items config
  const summaryCards = [
    {
      title: 'Andamento do Projeto',
      value: '60%',
      description: 'Fase de Integração de API',
      status: 'active',
      progress: 60,
      icon: TrendingUp,
      color: 'text-brand-neon',
      glow: 'shadow-[0_0_15px_rgba(204,255,0,0.1)]'
    },
    {
      title: 'Mensalidades e Faturas',
      value: 'Em Dia',
      description: 'PRÓXIMO VENCIMENTO: 10/08/2026',
      status: 'clean',
      progress: null,
      icon: Clock,
      color: 'text-brand-neon',
      glow: 'shadow-[0_0_15px_rgba(204,255,0,0.05)]'
    },
    {
      title: 'Tickets Ativos',
      value: '1',
      description: '1 aguardando sua resposta',
      status: 'warning',
      progress: null,
      icon: AlertCircle,
      color: 'text-brand-neon',
      glow: 'shadow-[0_0_15px_rgba(204,255,0,0.05)]'
    }
  ]



  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <div className="space-y-10">
      
      {/* Welcome Title and Current Date Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] font-mono text-brand-neon uppercase font-semibold block mb-1">
            Backstage / Visão Geral
          </span>
          <h1 className="text-3xl sm:text-4xl font-space font-extrabold tracking-tight text-white uppercase">
            Olá, Cliente
          </h1>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 px-4 py-2.5 rounded backdrop-blur-sm text-right">
          <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono block">Data de Hoje</span>
          <span className="text-xs text-gray-300 font-mono">{formattedDate}</span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {summaryCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className={`bg-zinc-900/40 border border-white/10 p-6 rounded-lg relative overflow-hidden backdrop-blur-sm ${card.glow} flex flex-col justify-between`}
            >
              {/* Card top row */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-sans font-bold tracking-wider text-gray-400 uppercase">
                  {card.title}
                </span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>

              {/* Card middle (value) */}
              <div className="mb-4">
                <span className="text-3xl font-space font-extrabold tracking-tight text-white">
                  {card.value}
                </span>
                <p className="font-sans text-xs text-gray-500 font-light mt-1">
                  {card.description}
                </p>
              </div>

              {/* Card progress bar if active */}
              {card.progress !== null ? (
                <div className="mt-2 space-y-1.5">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-neon rounded-full" 
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-gray-500">
                    <span>PROGRESSO</span>
                    <span>{card.progress}%</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-gray-500 uppercase">Status</span>
                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                    card.status === 'clean' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {card.status === 'clean' ? 'Regularizado' : 'Ação Requerida'}
                  </span>
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Dashboard Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Activities & Project Info (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main active project monitor */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 sm:p-8 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/[0.01] blur-xl rounded-full pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-neon/10 border border-brand-neon/20 rounded">
                  <Cpu className="w-5 h-5 text-brand-neon" />
                </div>
                <div>
                  <h3 className="font-space font-bold text-white text-sm uppercase">SISTEMA INTEGRADO DE AGENDAMENTOS E IA</h3>
                  <p className="text-[10px] text-gray-500 font-mono">ID DO PROJETO: #AT-PROJ-7729</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-brand-neon/10 text-brand-neon px-2.5 py-1 rounded border border-brand-neon/20 uppercase">
                Em Homologação
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-6">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono block">Data de Início</span>
                <span className="text-xs font-mono text-gray-300">01 Jun 2026</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono block">Previsão</span>
                <span className="text-xs font-mono text-gray-300">10 Ago 2026</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono block">Fase Atual</span>
                <span className="text-xs font-mono text-brand-neon">Homologação Visual</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono block">Próxima Entrega</span>
                <span className="text-xs font-mono text-gray-300">Integração WhatsApp</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono block">Status do Pagamento</span>
                <span className="text-xs font-mono text-gray-300">2/3 Parcelas Pagas</span>
              </div>
            </div>

            <p className="font-sans text-xs text-gray-400 font-light leading-relaxed mb-6">
              Seu ecossistema digital está na fase final de testes. Nossa equipe está validando os fluxos de agendamento para garantir que seus clientes tenham uma experiência perfeita antes do lançamento oficial.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <a 
                href="#homologacao" 
                className="inline-flex items-center gap-1.5 text-xs text-brand-neon hover:underline transition-colors duration-200 uppercase font-mono font-bold"
              >
                Ambiente de Testes
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-gray-700">|</span>
              <button 
                onClick={() => alert('Layout aprovado com sucesso!')}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors duration-200 uppercase font-mono font-bold cursor-pointer"
              >
                Aprovar Layout Atual
                <Check className="w-3.5 h-3.5 text-brand-neon" />
              </button>
            </div>
          </div>

          {/* Seus Sistemas e Projetos */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-space font-bold text-white text-sm uppercase tracking-wider">
                SEUS SISTEMAS E PROJETOS
              </h3>
              <p className="text-[10px] text-gray-500 font-mono mt-1">
                Acompanhe e gerencie outros serviços ativos na plataforma
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'portal-assescor',
                  name: 'PORTAL ASSESCOR',
                  description: 'Plataforma corporativa para automação de fluxos e captação de leads.',
                  url: 'https://www.assescor.com.br',
                  btn1Label: 'Ver Projeto Online',
                  btn2Label: 'Gerenciar'
                },
                {
                  id: 'erp-comercial',
                  name: 'SISTEMA ERP COMERCIAL',
                  description: 'Módulos ativos: Frente de Caixa, Gestão de Retaguarda e Emissão de Notas (NF-e / NFC-e).',
                  url: 'https://erp.automationtest.com',
                  btn1Label: 'Acessar Retaguarda',
                  btn2Label: 'Gerenciar Licença'
                }
              ].map((proj) => (
                <div 
                  key={proj.id} 
                  className="p-4 bg-black/30 border border-white/5 rounded-lg hover:border-brand-neon/20 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                >
                  <div className="space-y-1">
                    <h4 className="font-space font-bold text-white text-xs uppercase tracking-wider group-hover:text-brand-neon transition-colors duration-300">
                      {proj.name}
                    </h4>
                    <p className="font-sans text-[11px] text-gray-400 font-light leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex gap-3 shrink-0 w-full sm:w-auto">
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-white/10 text-[10px] tracking-wider font-semibold rounded hover:bg-white/5 transition-all text-gray-400 hover:text-white font-mono uppercase"
                    >
                      {proj.btn1Label}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <Link
                      to={`/dashboard/projeto/${proj.id}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-brand-neon text-black text-[10px] tracking-wider font-bold rounded hover:shadow-[0_0_10px_rgba(204,255,0,0.3)] transition-all uppercase"
                    >
                      {proj.btn2Label}
                      <Sliders className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Support Quick Action & Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Support Ticket Card */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-brand-neon font-mono font-bold block">Fale com o Tech Lead</span>
              <h3 className="font-space font-bold text-white text-base uppercase">SUPORTE RÁPIDO</h3>
              <p className="font-sans text-xs text-gray-400 font-light leading-relaxed">
                Tem alguma dúvida de engenharia ou quer sugerir um ajuste no escopo do projeto? Abra uma solicitação expressa.
              </p>
            </div>

            <textarea 
              placeholder="Descreva sua dúvida ou solicitação de suporte aqui..."
              rows={4}
              className="w-full bg-black/50 border border-white/10 focus:border-brand-neon focus:ring-1 focus:ring-brand-neon/30 outline-none transition-all duration-300 rounded p-3 text-xs text-white placeholder-gray-600 font-sans tracking-wide resize-none"
            />

            <button className="w-full py-3 bg-transparent border border-brand-neon text-brand-neon font-semibold rounded text-xs tracking-wider uppercase hover:bg-brand-neon hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
              Enviar Solicitação
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card Lateral de Recomendação Inteligente (Upsell) */}
          <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm space-y-6 relative overflow-hidden group">
            {/* Ambient neon gradient backglow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-neon/[0.04] blur-xl rounded-full group-hover:bg-brand-neon/[0.08] transition-all duration-500" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon/40 to-transparent" />
            
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-brand-neon/10 border border-brand-neon/20 text-[9px] text-brand-neon px-2.5 py-1 rounded font-mono tracking-widest uppercase font-semibold">
                <Sparkles className="w-3 h-3 text-brand-neon animate-pulse" />
                Recomendado Para Seu Negócio
              </span>
              <h3 className="font-space font-bold text-white text-base uppercase leading-snug">
                AUTOMAÇÃO DE MARKETING DIGITAL
              </h3>
              <p className="font-sans text-xs text-gray-400 font-light leading-relaxed">
                Recupere carrinhos abandonados, envie cupons automáticos via WhatsApp e multiplique a retenção dos seus clientes.
              </p>
            </div>

            <Link
              to="/produtos/automacoes"
              className="w-full py-3 bg-brand-neon text-black font-bold rounded text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Conhecer Solução
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  )
}
