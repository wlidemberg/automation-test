import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Globe, Rocket, ShoppingBag, Calendar, Cpu, MessageSquare, Terminal, ArrowUpRight } from 'lucide-react'

export default function ProductsSection() {
  const products = [
    {
      title: 'Sites Institucionais',
      badge: 'Autoridade digital',
      description: 'Desenvolvimento de portais corporativos sob medida para consolidar a presença online da sua empresa com velocidade e otimização avançada de SEO.',
      icon: Globe
    },
    {
      title: 'Landing Pages',
      badge: 'Foco extremo em conversão',
      description: 'Páginas otimizadas de alta performance criadas para capturar leads qualificados e acelerar o retorno de campanhas de tráfego pago.',
      icon: Rocket
    },
    {
      title: 'Lojas Virtuais',
      badge: 'E-commerce completo',
      description: 'Sistemas de comércio eletrônico robustos, painéis de gestão integrados e checkout fluido para impulsionar suas vendas de ponta a ponta.',
      icon: ShoppingBag
    },
    {
      title: 'Agendamentos',
      badge: 'Sistemas de reserva/marcação',
      description: 'Plataformas intuitivas de reserva e controle de horários com notificações automáticas para otimizar o fluxo de atendimento da sua equipe.',
      icon: Calendar
    },
    {
      title: 'Automações',
      badge: 'Integrações e WhatsApp',
      description: 'Fluxos automatizados que conectam suas ferramentas, bancos de dados e canais do WhatsApp para eliminar tarefas manuais repetitivas.',
      icon: Cpu
    },
    {
      title: 'Agentes de IA para Atendimento',
      badge: 'Chatbots inteligentes',
      description: 'Robôs inteligentes integrados capazes de responder dúvidas frequentes, qualificar contatos e direcionar leads em tempo integral.',
      icon: MessageSquare
    },
    {
      title: 'Agentes de IA Específicos',
      badge: 'Soluções IA sob medida',
      description: 'Desenvolvimento de inteligência artificial personalizada para processamento interno de documentos, análise de relatórios e tomada de decisão.',
      icon: Terminal
    }
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <section id="servicos" className="relative py-32 px-6 bg-brand-dark overflow-hidden border-t border-brand-gray/60">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-neon/[0.015] blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-neon block">
            NOSSOS PRODUTOS
          </span>
          <h2 className="text-3xl sm:text-5xl font-space font-bold tracking-tight text-white leading-tight">
            Soluções estruturadas para o seu crescimento
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base font-light leading-relaxed">
            Acelere a operação da sua empresa com ecossistemas digitais pré-formatados. Da captação de leads à automação do atendimento, nossos produtos são estruturados para escalar suas vendas e reduzir o esforço manual da sua equipe.
          </p>
          <div className="w-12 h-[1px] bg-brand-neon mx-auto mt-4" />
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => {
            const Icon = product.icon
            // Let the 7th item span 2 columns on large screens for a Bento Grid balance
            const isLast = index === products.length - 1
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className={`group bg-zinc-900/40 border border-white/10 p-8 rounded-lg flex flex-col justify-between hover:border-brand-neon/30 hover:bg-zinc-900/60 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
                  isLast ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                {/* Visual card hover light effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-neon/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="space-y-6">
                  {/* Icon and badge */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded bg-brand-gray flex items-center justify-center border border-white/10 group-hover:border-brand-neon/40 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-white group-hover:text-brand-neon transition-colors duration-300" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-brand-gray border border-white/5 px-2.5 py-1 rounded text-gray-500 group-hover:text-brand-neon group-hover:border-brand-neon/20 transition-all duration-300">
                      {product.badge}
                    </span>
                  </div>

                  {/* Title and summary */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-space font-bold text-white group-hover:text-brand-neon transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="pt-8 mt-auto">
                  <a
                    href="#contato"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-gray-400 group-hover:text-brand-neon transition-colors duration-300"
                  >
                    Adquirir Produto
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
