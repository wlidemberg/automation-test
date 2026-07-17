import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import ParticlesBackground from './ParticlesBackground'

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] // Custom ease curve for premium feel
      }
    }
  };


  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center bg-brand-dark px-6 overflow-hidden">
      
      {/* Interactive Constellation Particle Background */}
      <ParticlesBackground />

      {/* Decorative Premium Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-brand-gray)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-brand-gray)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none -z-10" />

      {/* Decorative Neon Ambient Light (Glow) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-neon/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center space-y-8"
      >
        {/* Micro-Mono Subtitle */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-brand-gray/80 border border-brand-gray px-4 py-2 rounded-full backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-neon" />
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-400">
            Soluções Web de Alta Performance
          </span>
        </motion.div>

        {/* Monumental Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-8xl font-sans font-extrabold tracking-tight leading-[1.05] text-white flex flex-col"
        >
          <span>DESENVOLVEMOS SITES</span>
          <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)] [text-stroke:1px_rgba(255,255,255,0.35)]">
            QUE GERAM
          </span>
          <span className="text-brand-neon drop-shadow-[0_0_20px_rgba(204,255,0,0.2)]">
            RESULTADOS
          </span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p 
          variants={itemVariants}
          className="font-sans text-gray-400 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed"
        >
          Soluções modernas, rápidas e estratégicas para escalar sua empresa e criar uma presença digital marcante.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4 w-full sm:w-auto"
        >
          <motion.a
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 0 25px rgba(204, 255, 0, 0.4)" 
            }}
            whileTap={{ scale: 0.98 }}
            href="#portfolio"
            className="w-full sm:w-auto px-8 py-4 bg-brand-neon text-black font-semibold rounded text-sm tracking-wide uppercase transition-shadow duration-300"
          >
            Ver Projetos
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href="#contato"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-brand-gray text-white font-semibold rounded text-sm tracking-wide uppercase hover:bg-brand-gray/40 hover:border-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Falar com Especialista
            <ArrowRight className="w-4 h-4 text-brand-neon" />
          </motion.a>
        </motion.div>

        {/* Client Area Access Link */}
        <motion.div variants={itemVariants} className="pt-2">
          <Link
            to="/login"
            className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-brand-neon transition-colors duration-300 flex items-center justify-center gap-1.5 font-mono group"
          >
            Acessar Área do Cliente
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200 text-brand-neon" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.6, y: 10 }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 1.5,
          ease: "easeInOut",
          delay: 1.5
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 hover:text-brand-neon cursor-pointer z-10 flex flex-col items-center gap-1"
        onClick={() => {
          document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>

    </section>
  )
}
