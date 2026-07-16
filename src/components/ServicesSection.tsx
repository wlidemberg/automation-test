import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Globe, Rocket, ShoppingBag, ArrowUpRight } from 'lucide-react'

export default function ServicesSection() {
  const services = [
    {
      title: 'Sites Institucionais',
      description: 'Presença digital sólida com design sob medida, otimização de SEO de ponta e performance excepcional para consolidar sua marca no mercado.',
      icon: Globe,
      link: '#contato'
    },
    {
      title: 'Landing Pages',
      description: 'Páginas de alta conversão projetadas cirurgicamente para campanhas de marketing, com foco em usabilidade, velocidade máxima e captura de leads.',
      icon: Rocket,
      link: '#contato'
    },
    {
      title: 'Lojas Virtuais',
      description: 'E-commerce premium de alta escala, fluxos de checkout otimizados e painel de gerenciamento completo para maximizar suas vendas online.',
      icon: ShoppingBag,
      link: '#contato'
    }
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <section id="servicos" className="relative py-32 px-6 bg-brand-dark overflow-hidden border-t border-brand-gray/60">
      
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-neon/[0.015] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-neon block">
            NOSSOS SERVIÇOS
          </span>
          <h2 className="text-3xl sm:text-5xl font-space font-bold tracking-tight text-white leading-tight">
            Soluções para cada estágio do seu negócio
          </h2>
          <div className="w-12 h-[1px] bg-brand-neon mx-auto mt-4" />
        </div>

        {/* Services Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group bg-brand-gray/40 border border-white/5 p-8 rounded-lg flex flex-col justify-between hover:border-brand-neon/30 hover:bg-brand-gray/60 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
              >
                {/* Visual card hover reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-neon/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="space-y-6">
                  {/* Icon wrap */}
                  <div className="w-12 h-12 rounded bg-brand-gray flex items-center justify-center border border-white/10 group-hover:border-brand-neon/40 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-white group-hover:text-brand-neon transition-colors duration-300" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-space font-bold text-white group-hover:text-brand-neon transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="pt-8 mt-auto">
                  <a
                    href={service.link}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-gray-400 group-hover:text-brand-neon transition-colors duration-300"
                  >
                    Contratar Serviço
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
