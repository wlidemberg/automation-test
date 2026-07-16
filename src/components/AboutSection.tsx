import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Terminal, Shield, CheckCircle } from 'lucide-react'

export default function AboutSection() {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Motion values for 3D tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Map normalized coordinates to rotation degrees (smooth spring response)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 25 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 25 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    
    // Calculate normalized position relative to center of element (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5
    
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const mockCode = `// Core automation service initialized
const automation = new ProcessAutomation({
  engine: "V8-Core",
  security: "Shield-RSA",
  supabase: {
    realtime: true,
    db: "PostgreSQL"
  }
});

await automation.optimize({
  compression: "Brotli",
  latencyTarget: "< 150ms"
});`

  return (
    <section id="sobre" className="relative py-32 px-6 bg-brand-dark overflow-hidden border-t border-brand-gray/60">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-brand-neon/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Column (Text content) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-neon block">
            SOBRE NÓS
          </span>
          
          <h2 className="text-3xl sm:text-5xl font-space font-bold tracking-tight text-white leading-tight">
            Nós lideramos com engenharia de alto padrão.
          </h2>
          
          <p className="text-gray-400 font-light leading-relaxed">
            Somos especialistas em automação de processos corporativos, robótica de dados e desenvolvimento de interfaces de alto valor. Nosso propósito é acelerar as operações digitais de empresas com o máximo nível de refino estético e estabilidade de infraestrutura.
          </p>

          <div className="space-y-4 pt-4">
            {[
              "Interfaces interativas construídas com React & Tailwind",
              "Animações premium para experiências imersivas",
              "Preparação para integração nativa com Supabase"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="text-brand-neon w-5 h-5 flex-shrink-0" />
                <span className="text-sm text-gray-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column (Interactive 3D Hardware Mockup) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center items-center relative group"
        >
          {/* Neon Glow Backdrop that fades in on group hover */}
          <div className="absolute inset-0 bg-brand-neon/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500 rounded-lg pointer-events-none -z-10" />

          {/* Perspective Wrapper for 3D Tilt */}
          <div className="w-full max-w-[500px] h-[360px] [perspective:1000px]">
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: 'preserve-3d'
              }}
              className="w-full h-full bg-brand-gray border border-white/10 rounded-lg p-6 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:border-brand-neon/30 hover:shadow-[0_0_30px_rgba(204,255,0,0.15)] transition-all duration-300 relative overflow-hidden"
            >
              {/* Header inside mockup */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="text-brand-neon w-4 h-4" />
                  <span className="text-xs font-mono text-gray-400">service.automation.ts</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>

              {/* Mockup code area */}
              <div className="flex-1 py-6 flex items-start text-left overflow-auto font-mono text-[10px] sm:text-xs leading-relaxed text-gray-300 [style:preserve-3d]">
                <pre className="w-full">
                  <code>
                    {mockCode}
                  </code>
                </pre>
              </div>

              {/* Status bar */}
              <div className="flex justify-between items-center border-t border-white/5 pt-4 text-[10px] font-mono text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-neon" />
                  Shield Mode Active
                </span>
                <span>UTF-8</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
