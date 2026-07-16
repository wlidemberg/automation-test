import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight, ExternalLink, Globe, Layers, ShieldCheck } from 'lucide-react'

export default function PortfolioSection() {
  const projects = [
    {
      title: 'TH Moda Fitness',
      subtitle: 'E-commerce de Alta Performance',
      description: 'Redesenho completo da experiência de compra digital com foco em carregamento instantâneo de páginas e fluxos de checkout otimizados, resultando em um aumento de 40% nas vendas convertidas.',
      tags: ['React', 'Tailwind CSS', 'Framer Motion', 'GraphQL'],
      buttonText: 'Ver Estudo de Caso',
      icon: Layers,
      gradient: 'from-zinc-950 via-zinc-900 to-brand-neon/10'
    },
    {
      title: 'Portal Assescor',
      subtitle: 'Plataforma SaaS & Automação contábil',
      description: 'Desenvolvimento de ecossistema digital corporativo para geração automatizada de relatórios fiscais integrando fluxos de comunicação direta com clientes via API do WhatsApp.',
      tags: ['Next.js', 'Supabase', 'Node.js', 'WhatsApp API'],
      buttonText: 'Visitar Site',
      icon: ShieldCheck,
      gradient: 'from-zinc-950 via-zinc-900 to-white/5'
    }
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
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
    <section id="portfolio" className="relative py-32 px-6 bg-brand-dark overflow-hidden border-t border-brand-gray/60">
      
      {/* Background ambient grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-brand-gray)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-brand-gray)_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-[0.15] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-neon block">
            PROJETOS EM DESTAQUE
          </span>
          <h2 className="text-3xl sm:text-5xl font-space font-bold tracking-tight text-white leading-tight">
            Engenharia e design aplicados na prática
          </h2>
          <div className="w-12 h-[1px] bg-brand-neon mx-auto mt-4" />
        </div>

        {/* Featured Projects Stack */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          {projects.map((project, index) => {
            const ProjectIcon = project.icon
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group bg-zinc-900/40 border border-white/10 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 hover:border-brand-neon/30 transition-all duration-500 backdrop-blur-sm shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
              >
                
                {/* Text Side (Column 1) */}
                <div className="p-8 sm:p-12 flex flex-col justify-between space-y-8">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-brand-neon bg-brand-neon/10 border border-brand-neon/20 px-3 py-1 rounded-full inline-block">
                      {project.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-space font-bold text-white group-hover:text-brand-neon transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-gray-400 font-light leading-relaxed pt-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags and CTA */}
                  <div className="space-y-6 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] sm:text-xs font-mono text-gray-400 bg-brand-gray border border-white/5 px-3 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <a
                      href="#contato"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider font-semibold text-white group-hover:text-brand-neon transition-colors duration-300"
                    >
                      {project.buttonText}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                  </div>
                </div>

                {/* Visual / Image Side (Column 2) */}
                <div className={`relative h-[250px] lg:h-auto min-h-[300px] bg-gradient-to-tr ${project.gradient} flex items-center justify-center overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10 group-hover:border-brand-neon/20 transition-all duration-500`}>
                  {/* Digital Overlay Grid inside placeholder */}
                  <div className="absolute inset-0 bg-[radial-gradient(var(--color-brand-gray)_1.5px,transparent_1.5px)] bg-[size:1rem_1rem] opacity-25" />
                  
                  {/* Decorative Glassmorphic Floating Element */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="w-4/5 h-3/5 bg-black/60 border border-white/10 rounded backdrop-blur-md p-6 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-10"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="text-brand-neon w-4 h-4" />
                        <span className="text-[10px] font-mono text-gray-500">production_node_ready</span>
                      </div>
                      <ExternalLink className="text-gray-600 w-3.5 h-3.5" />
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center py-4">
                      <ProjectIcon className="text-white w-12 h-12 opacity-80 group-hover:text-brand-neon group-hover:scale-110 transition-all duration-500" />
                    </div>
                    
                    <div className="flex justify-between items-center text-[8px] font-mono text-gray-600">
                      <span>STATUS: ONLINE</span>
                      <span>SECURE CONNECTED</span>
                    </div>
                  </motion.div>

                  {/* Aesthetic Background Shapes */}
                  <div className="absolute w-[200px] h-[200px] rounded-full bg-brand-neon/5 blur-[50px] pointer-events-none -bottom-10 -right-10" />
                </div>

              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
