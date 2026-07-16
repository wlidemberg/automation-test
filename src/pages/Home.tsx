import HeroSection from '../components/HeroSection'

export default function Home() {
  return (
    <div className="w-full bg-brand-dark overflow-hidden">
      {/* Hero Entrance Section */}
      <HeroSection />

      {/* Placeholder sections to allow scroll demo */}
      <section id="sobre" className="py-32 px-6 max-w-7xl mx-auto flex flex-col justify-center border-t border-brand-gray/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-neon mb-4">Sobre Nós</h2>
            <h3 className="text-3xl md:text-5xl font-space font-bold tracking-tight text-white mb-6">
              Nós lideramos com engenharia de alto padrão.
            </h3>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              Somos especialistas em automação de processos corporativos, robótica de dados e desenvolvimento de interfaces de alto valor. Nosso propósito é acelerar as operações digitais de grandes corporações com o máximo nível de refino estético e estabilidade de infraestrutura.
            </p>
          </div>
          <div className="h-[300px] border border-brand-gray rounded bg-brand-gray/20 relative flex items-center justify-center group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-neon/5 to-transparent pointer-events-none" />
            <span className="text-gray-500 font-mono text-sm tracking-widest uppercase group-hover:text-brand-neon transition-colors duration-300">
              Interactive Hardware Mockup
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
