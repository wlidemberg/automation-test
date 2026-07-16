import { motion } from 'framer-motion'
import { Terminal, Shield, Cpu, ExternalLink } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col justify-between items-center p-6 relative overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-brand-gray)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-brand-gray)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center z-10 border-b border-brand-gray pb-4">
        <div className="flex items-center gap-2">
          <Terminal className="text-brand-neon w-6 h-6" />
          <span className="font-space font-bold tracking-widest text-lg">AUTOMATION <span className="text-brand-neon">TEST</span></span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-brand-neon rounded-full animate-ping" />
            <span className="text-white font-mono text-xs">v1.0.0-alpha</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center max-w-4xl text-center z-10 my-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-brand-gray border border-brand-gray px-4 py-1.5 rounded-full text-xs text-gray-400 uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-brand-neon" />
            Design System Base Configurado
          </div>

          <h1 className="text-5xl md:text-7xl font-space font-bold tracking-tight leading-none">
            Tech-Luxo Portal & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-brand-neon">
              Client Management
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-xl mx-auto font-light leading-relaxed">
            O tema base do Tailwind CSS foi configurado na branch <code className="text-brand-neon bg-brand-gray/50 px-1.5 py-0.5 rounded">chore/setup-design-system</code> seguindo a identidade visual exclusiva.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="/documentacao/design_system.md"
              target="_blank"
              className="px-6 py-3 bg-brand-neon text-black font-semibold rounded-md text-sm flex items-center gap-2 transition-shadow shadow-glow-neon hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] duration-300"
            >
              Explorar Design System
              <ExternalLink className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="/documentacao/levantamento_requisitos.md"
              target="_blank"
              className="px-6 py-3 bg-brand-gray border border-brand-gray text-white rounded-md text-sm hover:border-neutral-700 transition-colors"
            >
              Ver Requisitos
            </motion.a>
          </div>
        </motion.div>

        {/* Features Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full"
        >
          <div className="bg-brand-gray border border-brand-gray p-6 rounded-md text-left group hover:border-brand-neon/30 transition-all duration-300">
            <Shield className="text-brand-neon w-8 h-8 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
            <h3 className="font-space font-semibold text-lg mb-2">Supabase Ready</h3>
            <p className="text-gray-500 text-sm">Estrutura preparada para integração transparente com autenticação e banco relacional.</p>
          </div>

          <div className="bg-brand-gray border border-brand-gray p-6 rounded-md text-left group hover:border-brand-neon/30 transition-all duration-300">
            <Cpu className="text-brand-neon w-8 h-8 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
            <h3 className="font-space font-semibold text-lg mb-2">Tailwind v4 & Config</h3>
            <p className="text-gray-500 text-sm">Tema customizado configurado com cores e fontes herdadas do arquivo tailwind.config.js.</p>
          </div>

          <div className="bg-brand-gray border border-brand-gray p-6 rounded-md text-left group hover:border-brand-neon/30 transition-all duration-300">
            <Terminal className="text-brand-neon w-8 h-8 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
            <h3 className="font-space font-semibold text-lg mb-2">Framer Motion</h3>
            <p className="text-gray-500 text-sm">Animações de entrada e interações fluidas para proporcionar uma experiência de alta patente.</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center z-10 border-t border-brand-gray pt-4 text-xs text-gray-500 gap-4">
        <div>
          © 2026 Automation Test. Todos os direitos reservados.
        </div>
        <div className="flex gap-4">
          <a href="/documentacao/fluxo_git.md" target="_blank" className="hover:text-brand-neon transition-colors">Fluxo Git</a>
          <span>•</span>
          <a href="https://github.com" target="_blank" className="hover:text-brand-neon transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  )
}

export default App
