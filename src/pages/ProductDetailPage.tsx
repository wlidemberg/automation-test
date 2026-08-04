import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Rocket, 
  ShoppingBag, 
  Calendar, 
  Database, 
  Zap, 
  Bot, 
  ShieldCheck, 
  Layout as LayoutIcon, 
  Search, 
  Smartphone, 
  Code2, 
  Workflow, 
  Sparkles, 
  Layers, 
  Clock, 
  Lock, 
  BarChart3, 
  CheckCircle2, 
  FileText, 
  Users, 
  CreditCard,
  MessageSquare,
  ArrowLeft, 
  ArrowUpRight, 
  Loader2,
  ChevronRight,
  Package
} from 'lucide-react'
import type { ElementType } from 'react'

import Layout from '../components/Layout'
import { productsData, getLocalProductBySlug } from '../data/productsData'
import type { Product as ProductDataType } from '../data/productsData'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<ProductDataType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Rolagem automática para o topo ao alterar o produto
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    function loadProductData() {
      if (!slug) {
        setProduct(null)
        setLoading(false)
        return
      }

      setLoading(true)
      // Tenta obter o produto local enriquecido pelo helper de slugs/aliases
      const localMeta = getLocalProductBySlug(slug)

      if (localMeta) {
        setProduct(localMeta)
      } else {
        const fallback = productsData.find(p => p.slug === slug)
        setProduct(fallback || null)
      }
      setLoading(false)
    }

    loadProductData()
  }, [slug])

  // Mapeador dinâmico de ícones Lucide por nome em string
  const renderIcon = (iconName: string) => {
    const map: Record<string, ElementType> = {
      Layout: LayoutIcon,
      Globe: Globe,
      Search: Search,
      Smartphone: Smartphone,
      ShieldCheck: ShieldCheck,
      FileText: FileText,
      Users: Users,
      Zap: Zap,
      BarChart3: BarChart3,
      MessageSquare: MessageSquare,
      ShoppingBag: ShoppingBag,
      CreditCard: CreditCard,
      Database: Database,
      Lock: Lock,
      Calendar: Calendar,
      Clock: Clock,
      Layers: Layers,
      Workflow: Workflow,
      Code2: Code2,
      Sparkles: Sparkles,
      Bot: Bot,
      Rocket: Rocket
    }
    const IconComp = map[iconName] || Package
    return <IconComp className="w-5 h-5 text-brand-neon" />
  }

  // Estado de Carregamento
  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-brand-dark">
          <Loader2 className="w-10 h-10 text-brand-neon animate-spin" />
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
            Carregando especificações da solução...
          </p>
        </div>
      </Layout>
    )
  }

  // Estado de Produto Não Encontrado
  if (!product) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center space-y-8 bg-brand-dark">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-red-500 font-mono block">
              PRODUTO NÃO ENCONTRADO
            </span>
            <h1 className="text-4xl sm:text-5xl font-space font-extrabold tracking-tight text-white uppercase">
              SOLUÇÃO INDISPONÍVEL
            </h1>
            <p className="font-sans text-gray-400 max-w-md mx-auto font-light leading-relaxed text-sm">
              A solução especificada não foi encontrada no nosso catálogo ativo.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-black font-semibold rounded text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLTAR PARA HOME
          </Link>
        </div>
      </Layout>
    )
  }

  const ProductIcon = product.icon || Globe

  return (
    <Layout>
      {/* Background Wrapper */}
      <div className="bg-brand-dark text-white font-sans selection:bg-brand-neon selection:text-black">
        
        {/* Navigation Breadcrumbs Bar (Limpo, sem barra de rolagem horizontal feia) */}
        <div className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between font-mono text-xs text-gray-400">
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
              <Link to="/" className="hover:text-white transition-colors">HOME</Link>
              <ChevronRight className="w-3 h-3 text-gray-600 shrink-0" />
              <Link to="/#produtos" className="hover:text-white transition-colors shrink-0">PRODUTOS</Link>
              <ChevronRight className="w-3 h-3 text-gray-600 shrink-0" />
              <span className="text-brand-neon font-semibold uppercase truncate">{product.nome}</span>
            </div>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors uppercase tracking-wider text-[11px] shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              VOLTAR À HOME
            </Link>
          </div>
        </div>

        {/* HERO SECTION */}
        <section 
          className="relative py-20 sm:py-28 px-6 overflow-hidden border-b border-brand-gray/60 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(5, 5, 5, 0.88), rgba(5, 5, 5, 0.96)), url(${product.bgImage})` 
          }}
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-neon/[0.03] blur-[160px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-5xl mx-auto text-center space-y-8">
            
            {/* Badge Neon da Categoria */}
            <div className="inline-flex items-center gap-2.5 bg-brand-neon/10 border border-brand-neon/30 px-4 py-1.5 rounded-full backdrop-blur-md mx-auto">
              <ProductIcon className="w-4 h-4 text-brand-neon" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold text-brand-neon">
                {product.categoria}
              </span>
            </div>

            {/* Nome do Produto */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-space font-extrabold tracking-tight uppercase leading-[1.08] text-white">
              {product.nome}
            </h1>

            {/* Subtítulo Persuasivo Focado nas Dores do Cliente */}
            <p className="font-sans text-gray-200 text-lg sm:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
              {product.subtitulo}
            </p>

            {/* Botão UPPERCASE: SOLICITAR PROPOSTA TÉCNICA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(204, 255, 0, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/solicitar-proposta?produto=${product.slug}`)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-neon text-black font-space font-bold text-xs tracking-[0.15em] uppercase rounded transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.2)]"
              >
                SOLICITAR PROPOSTA TÉCNICA
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </motion.button>

              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-gray/80 text-gray-300 border border-white/10 hover:border-white/20 font-mono text-xs tracking-wider uppercase rounded transition-all duration-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                VOLTAR AO INÍCIO
              </Link>
            </div>

          </div>
        </section>

        {/* BLOCO 1: DESCRIÇÃO EXECUTIVA & IMPACTO NO NEGÓCIO (Glassmorphism Card) */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="bg-zinc-900/40 border border-white/10 p-8 sm:p-12 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-2xl space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-neon/[0.02] blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-brand-neon rounded-full" />
              <div>
                <span className="text-xs uppercase tracking-[0.25em] font-mono text-brand-neon font-semibold block">
                  RESOLUÇÃO DE PROBLEMAS & IMPACTO NO NEGÓCIO
                </span>
                <h2 className="text-2xl sm:text-3xl font-space font-bold text-white uppercase tracking-tight">
                  Como Esta Solução Transforma Seu Negócio
                </h2>
              </div>
            </div>

            <p className="font-sans text-gray-300 text-base sm:text-xl font-light leading-relaxed border-t border-white/5 pt-6">
              {product.descricaoExecutiva}
            </p>

            <div className="pt-4 border-t border-white/5 flex flex-wrap gap-4 items-center font-mono text-xs text-gray-400">
              <span className="text-brand-neon font-bold">✓ RESULTADOS ESPERADOS:</span>
              <span className="bg-brand-gray/80 border border-white/10 px-3 py-1 rounded text-gray-300">
                Aumento de Conversão
              </span>
              <span className="bg-brand-gray/80 border border-white/10 px-3 py-1 rounded text-gray-300">
                Redução de Custos Operacionais
              </span>
              <span className="bg-brand-gray/80 border border-white/10 px-3 py-1 rounded text-gray-300">
                Retenção & Satisfação do Cliente
              </span>
            </div>
          </div>
        </section>

        {/* BLOCO 2: O QUE COMPÕE ESTE PRODUTO (Grid de 5 Pilares) */}
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-neon font-mono block">
              ENTREGÁVEIS DE ALTO VALOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-space font-bold text-white uppercase tracking-tight">
              O que compõe este produto
            </h2>
            <p className="font-sans text-gray-400 text-sm sm:text-base font-light">
              Os 5 pilares estratégicos desenhados para resolver Gargalos e escalar suas vendas com segurança.
            </p>
            <div className="w-12 h-[1px] bg-brand-neon mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(product.oQueCompoe || []).map((pilar, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="group bg-zinc-900/40 border border-white/10 p-8 rounded-xl flex flex-col justify-between hover:border-brand-neon/40 hover:bg-zinc-900/70 transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
              >
                {/* Glow sutil ao passar o mouse */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/[0.02] blur-xl group-hover:bg-brand-neon/[0.05] transition-all duration-300" />

                <div className="space-y-4">
                  {/* Ícone & Número */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-brand-gray border border-white/10 flex items-center justify-center group-hover:border-brand-neon/50 transition-colors duration-300">
                      {renderIcon(pilar.icone)}
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-600 group-hover:text-brand-neon transition-colors duration-300">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Título & Descrição */}
                  <h3 className="text-lg font-space font-bold text-white group-hover:text-brand-neon transition-colors duration-300">
                    {pilar.titulo}
                  </h3>
                  <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                    {pilar.descricao}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-[11px] font-mono text-gray-500 group-hover:text-gray-300 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-neon" />
                  <span>Pilar de Alto Valor Garantido</span>
                </div>
              </motion.div>
            ))}

            {/* Card Extra de Benefícios Certificados */}
            <div className="bg-brand-neon/5 border border-brand-neon/20 p-8 rounded-xl flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-mono text-brand-neon font-bold block">
                  VANTAGENS EXCLUSIVAS
                </span>
                <h3 className="text-lg font-space font-bold text-white uppercase">
                  Por que Escolher Esta Solução?
                </h3>
                <ul className="space-y-3 font-sans text-xs text-gray-300 font-light">
                  {(product.beneficios || []).map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-neon shrink-0 mt-1" />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-brand-neon/20">
                <span className="text-[10px] font-mono uppercase text-brand-neon font-semibold">
                  SOLUÇÃO SOB MEDIDA PARA SEU CRESCIMENTO
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* BLOCO 3: ROADMAP DE DESENVOLVIMENTO (Como Trabalhamos em 6 Etapas) */}
        <section className="py-20 px-6 max-w-7xl mx-auto space-y-16 border-t border-white/10">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-neon font-mono block">
              METODOLOGIA DE ENTREGA
            </span>
            <h2 className="text-3xl sm:text-4xl font-space font-bold text-white uppercase tracking-tight">
              Como Trabalhamos
            </h2>
            <p className="font-sans text-gray-400 text-sm sm:text-base font-light">
              Processo em 6 etapas estruturadas para garantir previsibilidade, transparência e retorno imediato.
            </p>
            <div className="w-12 h-[1px] bg-brand-neon mx-auto mt-4" />
          </div>

          {/* Timeline de 6 Etapas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {(product.roadmap || []).map((etapa) => (
              <div
                key={etapa.passo}
                className="bg-zinc-900/50 border border-white/10 p-8 rounded-xl space-y-4 relative overflow-hidden backdrop-blur-sm hover:border-brand-neon/30 transition-all duration-300"
              >
                {/* Header do Passo */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
                    ETAPA
                  </span>
                  <div className="w-8 h-8 rounded bg-brand-neon text-black font-space font-bold text-sm flex items-center justify-center shadow-[0_0_10px_rgba(204,255,0,0.3)]">
                    0{etapa.passo}
                  </div>
                </div>

                {/* Título & Descrição da Etapa */}
                <h3 className="text-lg font-space font-bold text-white">
                  {etapa.titulo}
                </h3>
                <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                  {etapa.descricao}
                </p>

                <div className="pt-4 flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
                  <span className="w-2 h-2 rounded-full bg-brand-neon/60" />
                  <span>Entregável Garantido</span>
                </div>
              </div>
            ))}
          </div>

          {/* Banner de CTA Final da Página do Produto */}
          <div className="bg-gradient-to-r from-zinc-900 via-brand-gray to-zinc-900 border border-brand-neon/30 p-8 sm:p-12 rounded-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-neon/[0.04] blur-[120px] rounded-full pointer-events-none" />
            
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-neon font-bold block">
              PRONTO PARA RESOLVER ESTES GARGALOS?
            </span>
            <h3 className="text-2xl sm:text-4xl font-space font-bold text-white uppercase max-w-2xl mx-auto">
              Inicie a implementação do {product.nome} agora mesmo
            </h3>
            <p className="font-sans text-gray-300 text-sm sm:text-base font-light max-w-xl mx-auto">
              Solicite uma proposta técnica sem compromisso e veja como podemos acelerar seus resultados.
            </p>
            
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(204, 255, 0, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/solicitar-proposta?produto=${product.slug}`)}
                className="inline-flex items-center gap-3 px-10 py-5 bg-brand-neon text-black font-space font-extrabold text-xs tracking-[0.2em] uppercase rounded shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all duration-300 cursor-pointer"
              >
                SOLICITAR PROPOSTA TÉCNICA
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </motion.button>
            </div>
          </div>

        </section>

      </div>
    </Layout>
  )
}
