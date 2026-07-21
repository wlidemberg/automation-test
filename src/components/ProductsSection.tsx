import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowUpRight, Terminal, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/productService'
import { productsData } from '../data/productsData'

export default function ProductsSection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const dbProducts = await fetchProducts()
        
        // Mapeia os produtos do Supabase agregando os assets locais do productsData
        const mapped = dbProducts.map(dbProd => {
          const localMeta = productsData.find(p => p.slug === dbProd.slug)
          return {
            ...dbProd,
            icon: localMeta?.icon || Terminal,
            badge: localMeta?.badge || 'Solução Digital',
            bgImage: localMeta?.bgImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
          }
        })
        setProducts(mapped)
      } catch (err) {
        console.error(err)
        setError('Não foi possível carregar o catálogo de produtos.')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

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
    <section 
      id="produtos" 
      className="relative py-32 px-6 bg-brand-dark bg-cover bg-center bg-no-repeat overflow-hidden border-t border-brand-gray/60"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(5, 5, 5, 0.95), rgba(5, 5, 5, 0.97)), url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop')` }}
    >
      
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

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-brand-neon animate-spin animate-duration-1000" />
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500">Carregando catálogo oficial...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-brand-gray/30 border border-red-500/20 rounded-lg max-w-md mx-auto space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-brand-neon text-black font-semibold rounded text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all duration-300"
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        ) : (
          /* Bento Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product, index) => {
              const Icon = product.icon
              return (
                <motion.div
                  key={product.id || index}
                  variants={cardVariants}
                  className="group bg-zinc-900/40 border border-white/10 p-8 rounded-lg flex flex-col justify-between hover:border-brand-neon/30 hover:bg-zinc-900/60 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
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
                        {product.nome}
                      </h3>
                      <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                        {product.descricao}
                      </p>
                    </div>

                    {/* Preços Setup & Recorrência */}
                    <div className="flex gap-4 pt-4 border-t border-white/5 font-mono">
                      <div className="flex-1 bg-brand-gray/60 border border-white/5 rounded p-2.5 backdrop-blur-sm text-center">
                        <span className="text-[9px] uppercase tracking-wider text-gray-500 block mb-0.5">Setup</span>
                        <span className="text-sm font-bold text-white">
                          {product.valor_implementacao > 0 
                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.valor_implementacao)
                            : 'Gratuito'}
                        </span>
                      </div>
                      <div className="flex-1 bg-brand-gray/60 border border-white/5 rounded p-2.5 backdrop-blur-sm text-center">
                        <span className="text-[9px] uppercase tracking-wider text-gray-500 block mb-0.5">Mensalidade</span>
                        <span className="text-sm font-bold text-brand-neon">
                          {product.valor_mensalidade > 0 
                            ? `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.valor_mensalidade)}/mês`
                            : 'Isento'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 mt-auto flex flex-wrap gap-x-6 gap-y-2 items-center">
                    <a
                      href="/#contato"
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-gray-400 group-hover:text-brand-neon transition-colors duration-300"
                    >
                      ADQUIRIR PRODUTO
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <Link
                      to={`/produtos/${product.slug}`}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-gray-500 hover:text-white transition-colors duration-300"
                    >
                      SABER MAIS
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

      </div>
    </section>
  )
}
