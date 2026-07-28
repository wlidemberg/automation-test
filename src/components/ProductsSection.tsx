import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { 
  ArrowUpRight, 
  Globe, 
  Layout, 
  ShoppingBag, 
  Calendar, 
  Database, 
  Zap, 
  Bot, 
  Package, 
  Cpu, 
  Rocket, 
  MessageSquare, 
  Terminal,
  Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchAllProducts } from '../services/productServices'
import type { Product } from '../types/database'

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadProductsData = async () => {
      try {
        const data = await fetchAllProducts()
        // Exibe apenas produtos com status ativo (status = true)
        const activeProducts = data.filter(p => p.status)
        setProducts(activeProducts)
      } catch (err) {
        console.error('Erro ao carregar produtos na landing page:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProductsData()
  }, [])

  // Mapeador dinâmico de ícones da biblioteca lucide-react
  const getIconComponent = (iconName?: string | null) => {
    if (!iconName) return Package
    const lower = iconName.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (lower.includes('globe') || lower.includes('site')) return Globe
    if (lower.includes('layout') || lower.includes('landing')) return Layout
    if (lower.includes('shopping') || lower.includes('loja')) return ShoppingBag
    if (lower.includes('calendar') || lower.includes('agend')) return Calendar
    if (lower.includes('database') || lower.includes('erp')) return Database
    if (lower.includes('zap') || lower.includes('automac')) return Zap
    if (lower.includes('bot') || lower.includes('ia') || lower.includes('atend')) return Bot
    if (lower.includes('cpu')) return Cpu
    if (lower.includes('rocket')) return Rocket
    if (lower.includes('message')) return MessageSquare
    if (lower.includes('terminal')) return Terminal
    return Package
  }

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
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-neon block font-mono">
            NOSSOS PRODUTOS
          </span>
          <h2 className="text-3xl sm:text-5xl font-space font-bold tracking-tight text-white leading-tight uppercase">
            Soluções estruturadas para o seu crescimento
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base font-light leading-relaxed">
            Acelere a operação da sua empresa com ecossistemas digitais pré-formatados. Da captação de leads à automação do atendimento, nossos produtos são estruturados para escalar suas vendas e reduzir o esforço manual da sua equipe.
          </p>
          <div className="w-12 h-[1px] bg-brand-neon mx-auto mt-4" />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-neon animate-spin mx-auto" />
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
              CARREGANDO PRODUTOS DO BANCO DE DADOS...
            </p>
          </div>
        ) : (
          /* Bento Grid com Dados do Supabase */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => {
              const IconComponent = getIconComponent(product.icone)
              
              // Define o rótulo (badge superior direito)
              const rotuloBadge = product.rotulo || (
                product.categoria === 'design_web' ? 'AUTORIDADE DIGITAL' :
                product.categoria === 'desenvolvimento' ? 'SOLUÇÃO SOB MEDIDA' :
                product.categoria === 'erp_saas' ? 'GESTÃO CORPORATIVA' :
                product.categoria === 'automacao' ? 'EFICIÊNCIA OPERACIONAL' : 'IA AVANÇADA'
              )

              return (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  className="group bg-zinc-900/40 border border-white/10 p-8 rounded-lg flex flex-col justify-between hover:border-brand-neon/30 hover:bg-zinc-900/60 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
                >
                  {/* Visual card hover light effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-neon/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="space-y-6">
                    {/* Top Row: Icon and [rotulo] Badge */}
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded bg-brand-gray flex items-center justify-center border border-white/10 group-hover:border-brand-neon/40 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-white group-hover:text-brand-neon transition-colors duration-300" />
                      </div>
                      
                      {/* [rotulo] Badge em destaque no canto superior direito */}
                      <span className="text-[10px] uppercase font-mono tracking-wider bg-brand-gray border border-white/5 px-2.5 py-1 rounded text-gray-400 group-hover:text-brand-neon group-hover:border-brand-neon/20 transition-all duration-300">
                        {rotuloBadge}
                      </span>
                    </div>

                    {/* [Nome] and [Descrição] */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-space font-extrabold text-white uppercase group-hover:text-brand-neon transition-colors duration-300">
                        {product.nome}
                      </h3>
                      <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                        {product.descricao_curta}
                      </p>
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className="pt-8 mt-auto flex flex-wrap gap-x-6 gap-y-2 items-center">
                    <a
                      href="/#contato"
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-bold text-gray-400 group-hover:text-brand-neon transition-colors duration-300 font-mono"
                    >
                      ADQUIRIR PRODUTO
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <Link
                      to={`/produtos/${product.slug}`}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-gray-500 hover:text-white transition-colors duration-300 font-mono"
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
