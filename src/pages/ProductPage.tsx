import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowLeft, ArrowUpRight } from 'lucide-react'
import Layout from '../components/Layout'
import { productsData } from '../data/productsData'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()

  // Find product by slug
  const product = productsData.find(p => p.slug === slug)

  if (!product) {
    return (
      <Layout>
        <div className="flex-grow flex flex-col items-center justify-center px-6 py-20 text-center space-y-8 relative z-10">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-red-500 font-mono block">Erro 404</span>
            <h1 className="text-4xl sm:text-5xl font-space font-extrabold tracking-tight">
              PRODUTO NÃO ENCONTRADO
            </h1>
            <p className="font-sans text-gray-400 max-w-md mx-auto font-light leading-relaxed">
              O produto que você está tentando acessar não existe ou foi removido do nosso catálogo.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-black font-semibold rounded text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
        </div>
      </Layout>
    )
  }

  const Icon = product.icon

  return (
    <Layout>
      {/* Product Hero Section with Dark Themed Background Image */}
      <section
        className="relative py-24 sm:py-32 px-6 border-b border-brand-gray/60 overflow-hidden flex flex-col items-center justify-center text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(5, 5, 5, 0.90), rgba(5, 5, 5, 0.95)), url(${product.bgImage})` }}
      >
        {/* Ambient Neon Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brand-neon/5 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Products Quick Navigation */}
        <div className="max-w-7xl w-full mx-auto text-left mb-6 flex flex-wrap gap-x-6 gap-y-2 items-center text-xs font-mono border-b border-white/10 pb-4">

          {productsData.map((p) => {
            const isActive = p.slug === slug;
            return (
              <Link
                key={p.slug}
                to={`/produtos/${p.slug}`}
                className={`uppercase tracking-wider transition-colors duration-200 hover:text-white ${isActive
                    ? 'text-brand-neon font-bold border-b border-brand-neon pb-0.5'
                    : 'text-gray-400'
                  }`}
              >
                {p.title}
              </Link>
            )
          })}
        </div>

        {/* Breadcrumb / Back button */}
        <div className="max-w-7xl w-full mx-auto text-left mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Início
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge / Icon */}
          <div className="inline-flex items-center gap-3 bg-brand-gray/80 border border-brand-gray px-4 py-2 rounded-full backdrop-blur-sm mx-auto">
            <Icon className="w-4 h-4 text-brand-neon animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-300">
              {product.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold tracking-tight leading-[1.1] uppercase text-white">
            {product.title}
          </h1>

          {/* Summary */}
          <p className="font-sans text-gray-400 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            {product.description}
          </p>

          {/* Hero CTA */}
          <div className="pt-4">
            <motion.a
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 25px rgba(204, 255, 0, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              href="/#contato"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-neon text-black font-semibold rounded text-xs tracking-wider uppercase transition-all duration-300"
            >
              Solicitar Orçamento Deste Produto
            </motion.a>
          </div>
        </div>
      </section>

      {/* Split Details Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left Column: Long Pitch */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-mono text-brand-neon font-bold block">
                Visão Geral e Diferenciais
              </span>
              <h2 className="text-2xl sm:text-4xl font-space font-bold tracking-tight text-white">
                Por que escolher nossa arquitetura de engenharia para {product.title}?
              </h2>
            </div>

            <div className="w-16 h-[1px] bg-brand-neon/40" />

            <p className="font-sans text-gray-300 text-base sm:text-lg font-light leading-relaxed whitespace-pre-line">
              {product.descricaoLonga}
            </p>

            {/* Extra persuasion block */}
            <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-lg space-y-4 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-neon/[0.02] blur-xl rounded-full pointer-events-none" />
              <h3 className="font-space font-bold text-white uppercase tracking-wider text-sm">
                O Impacto da Alta Performance
              </h3>
              <p className="font-sans text-gray-400 text-sm font-light leading-relaxed">
                Não entregamos apenas código. Desenvolvemos produtos digitais que resolvem dores reais de conversão e gargalos operacionais. Cada linha do projeto é testada e configurada sob os mais rígidos padrões internacionais de web design e SEO.
              </p>
            </div>
          </div>

          {/* Right Column: Spec Card / Benefits & Techs */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-lg space-y-8 relative overflow-hidden backdrop-blur-sm shadow-xl">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon/40 to-transparent" />

              {/* Benefits */}
              <div className="space-y-6">
                <h3 className="font-space font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                  <span>Benefícios Inclusos</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-neon" />
                </h3>

                <ul className="space-y-4">
                  {product.beneficios.map((beneficio, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-brand-neon/10 flex items-center justify-center border border-brand-neon/20 shrink-0">
                        <Check className="w-3 h-3 text-brand-neon" />
                      </div>
                      <span className="font-sans text-sm text-gray-300 font-light leading-relaxed">
                        {beneficio}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <h3 className="font-space font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                  <span>Tecnologias Utilizadas</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-neon" />
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.tecnologias.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono font-medium text-gray-300 bg-brand-gray border border-white/5 px-3 py-1.5 rounded hover:border-brand-neon/30 hover:text-brand-neon transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Call-to-action Card */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <p className="font-sans text-[11px] text-gray-500 font-light uppercase tracking-wider text-center">
                  Pronto para acelerar seu negócio?
                </p>
                <a
                  href="/#contato"
                  className="w-full py-3.5 bg-transparent border border-brand-neon text-brand-neon font-semibold rounded text-xs tracking-wider uppercase hover:bg-brand-neon hover:text-black transition-all duration-300 flex items-center justify-center gap-2 shadow-inner"
                >
                  Fale com o Tech Lead
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  )
}
