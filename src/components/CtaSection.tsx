import { motion } from 'framer-motion'
import { ArrowRight, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const MotionLink = motion(Link)

export default function CtaSection() {
  return (
    <section 
      id="contato" 
      className="relative py-28 px-6 bg-brand-dark bg-cover bg-center bg-no-repeat overflow-hidden border-t border-brand-gray/60 flex flex-col items-center justify-center"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(5, 5, 5, 0.92), rgba(5, 5, 5, 0.95)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop')` }}
    >
      
      {/* Decorative background visual elements */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-brand-gray)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 -z-10" />

      {/* Deep Neon Glow Backdrop to emphasize call-to-action */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brand-neon/[0.035] blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Styled Central Bento CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-zinc-900/40 border border-white/10 rounded-lg p-10 sm:p-16 text-center space-y-8 relative overflow-hidden backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-brand-neon/20 transition-colors duration-500"
      >
        {/* Aesthetic background mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(204,255,0,0.01)_100%)] pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-neon">
            FALE CONOSCO
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-white leading-tight">
            PRONTO PARA ESCALAR <br />
            SUA OPERAÇÃO?
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Fale com nossos especialistas e descubra como nossas soluções de engenharia digital podem transformar seu negócio, impulsionar suas conversões e eliminar processos repetitivos.
          </p>
        </div>

        {/* Buttons Action Group */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10 pt-4 w-full sm:w-auto mx-auto">
          <motion.a
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 0 25px rgba(204, 255, 0, 0.45)"
            }}
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-brand-neon text-black font-semibold rounded text-sm tracking-wider uppercase transition-shadow duration-300 flex items-center justify-center gap-2"
          >
            Iniciar Projeto
            <ArrowRight className="w-4 h-4" />
          </motion.a>

          <MotionLink
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 text-white font-semibold rounded text-sm tracking-wider uppercase hover:bg-brand-gray/40 hover:border-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Acessar Área do Cliente
            <UserCheck className="w-4 h-4 text-brand-neon" />
          </MotionLink>
        </div>

      </motion.div>
    </section>
  )
}
