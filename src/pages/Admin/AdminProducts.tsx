import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Package, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Edit3, 
  Power,
  RefreshCw,
  Tag,
  DollarSign
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  fetchAllProducts, 
  toggleProductStatus 
} from '../../services/productServices'
import type { Product, ProductCategory } from '../../types/database'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import AdminHeader from '../../components/Admin/AdminHeader'

export default function AdminProducts() {
  // Sidebar state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  // Products and filter states
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const navigate = useNavigate()

  // Load products from Supabase/Service
  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await fetchAllProducts()
      setProducts(data)
    } catch (err) {
      console.error('Erro ao carregar produtos:', err)
      showToast('FALHA AO CONECTAR COM O BANCO DE DADOS.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Filter products by search query and selected category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        !searchQuery.trim() ||
        (p.nome && p.nome.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
        (p.slug && p.slug.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
        (p.descricao_curta && p.descricao_curta.toLowerCase().includes(searchQuery.toLowerCase().trim()))

      const matchesCategory = 
        selectedCategory === 'all' || p.categoria === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory])

  // Handle Status Toggle (Ativar / Inativar)
  const handleToggleStatus = async (product: Product) => {
    setUpdatingId(product.id)
    try {
      const updated = await toggleProductStatus(product.id, Boolean(product.status ?? product.ativo))
      if (updated) {
        await loadProducts()
        showToast(
          `PRODUTO ${(product.nome || product.slug).toUpperCase()} FOI ${!product.status ? 'ATIVADO' : 'INATIVADO'} COM SUCESSO!`,
          'success'
        )
      } else {
        showToast('ERRO AO ALTERAR STATUS DO PRODUTO.', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('FALHA AO PROCESSAR COMANDO NO BANCO DE DADOS.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  // Redirect to Dedicated Pages
  const handleOpenCreatePage = () => {
    navigate('/admin/produtos/novo')
  }

  const handleOpenEditPage = (prod: Product) => {
    navigate(`/admin/produtos/editar/${prod.id}`)
  }

  // Formatting helpers
  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null || val === 0) return 'R$ 0,00'
    return `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const categoryLabels: Record<ProductCategory, string> = {
    design_web: 'Design / Web',
    desenvolvimento: 'Desenvolvimento',
    erp_saas: 'ERP & SaaS',
    automacao: 'Automação',
    ia: 'Agentes de IA',
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans relative overflow-x-hidden">
      
      {/* Background Decorative Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-neon/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Collapsible Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        activeItem="produtos"
      />

      {/* Top Header */}
      <AdminHeader
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        activeSectionLabel="Produtos"
        onRefresh={loadProducts}
        isRefreshing={loading}
      />

      {/* Toast Notification Floating */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-6 z-50 px-5 py-3.5 rounded border text-xs font-mono tracking-wider uppercase backdrop-blur-md shadow-2xl flex items-center gap-3 ${
              toast.type === 'success' 
                ? 'bg-brand-neon/15 border-brand-neon text-brand-neon shadow-brand-neon/10' 
                : 'bg-rose-500/15 border-rose-500 text-rose-400 shadow-rose-500/10'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main
        className={`p-6 sm:p-8 space-y-8 transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Page Header (Title + Subtitle + Action Button) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-6 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-space font-extrabold tracking-tight text-white uppercase">
              Produtos & Soluções
            </h1>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Gerencie o catálogo de produtos e planos de assinatura.
            </p>
          </div>

          {/* Action Button: + NOVO PRODUTO */}
          <button
            onClick={handleOpenCreatePage}
            className="px-5 py-3 bg-brand-neon text-black rounded text-xs font-mono font-extrabold tracking-wider hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300 uppercase flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            + NOVO PRODUTO
          </button>
        </div>

        {/* Filter Bar (Search + Category Select) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 bg-brand-gray/90 border border-brand-gray rounded-lg p-3.5 backdrop-blur-sm shadow-xl flex items-center gap-3">
            <Search className="w-5 h-5 text-brand-neon shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por Nome do produto, Slug ou Descrição..."
              className="w-full bg-transparent outline-none text-xs text-white placeholder-gray-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-gray-500 hover:text-white font-mono uppercase"
              >
                LIMPAR
              </button>
            )}
          </div>

          {/* Category Select */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-2 backdrop-blur-sm shadow-xl flex items-center">
            <Tag className="w-4 h-4 text-brand-neon ml-3 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-white uppercase font-mono px-3 py-2 cursor-pointer"
            >
              <option value="all">Todas as Categorias</option>
              <option value="design_web">Design / Web</option>
              <option value="desenvolvimento">Desenvolvimento</option>
              <option value="erp_saas">ERP & SaaS</option>
              <option value="automacao">Automação de Processos</option>
              <option value="ia">Agentes de IA</option>
            </select>
          </div>
        </div>

        {/* Products Table Container */}
        <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-2xl">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-neon" />
              TOTAL DE PRODUTOS NO CATÁLOGO: <strong className="text-white font-bold">{filteredProducts.length}</strong>
            </span>

            <button
              onClick={loadProducts}
              className="p-1.5 rounded border border-white/10 text-gray-400 hover:text-brand-neon hover:border-brand-neon/30 transition-all text-[10px] font-mono uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-neon' : ''}`} />
              Sincronizar
            </button>
          </div>

          {/* Table Loading State */}
          {loading ? (
            <div className="py-16 text-center space-y-3 bg-black/20 rounded border border-white/5 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-brand-neon animate-spin mx-auto" />
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                CARREGANDO CATÁLOGO DE PRODUTOS...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Table Empty State */
            <div className="py-16 text-center space-y-3 bg-black/20 rounded border border-white/5 backdrop-blur-sm">
              <Package className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-sm font-space font-bold text-gray-300 uppercase tracking-wider">
                NENHUM PRODUTO ENCONTRADO
              </p>
              <p className="text-xs text-gray-500 font-mono max-w-md mx-auto">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Nenhum item corresponde aos filtros selecionados.' 
                  : 'O catálogo está vazio. Clique em "+ NOVO PRODUTO" para cadastrar.'}
              </p>
            </div>
          ) : (
            /* Products Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[9px] font-mono text-gray-400 uppercase tracking-widest bg-white/[0.02]">
                    <th className="py-4 px-4 font-semibold">Nome / Slug</th>
                    <th className="py-4 px-4 font-semibold">Categoria</th>
                    <th className="py-4 px-4 font-semibold">Tipo de Cobrança</th>
                    <th className="py-4 px-4 font-semibold">Preço Setup / Mensal</th>
                    <th className="py-4 px-4 font-semibold">Status</th>
                    <th className="py-4 px-4 font-semibold text-right">Ações Gerenciais</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredProducts.map((product) => {
                    const isUpdating = updatingId === product.id

                    return (
                      <tr key={product.id} className="text-xs hover:bg-white/[0.02] transition-all duration-200">
                        {/* Nome / Slug */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-brand-neon shrink-0" />
                              {product.nome || 'Produto Sem Nome'}
                            </span>
                            <span className="text-[10px] text-brand-neon/80 font-mono lowercase">
                              /{product.slug}
                            </span>
                          </div>
                        </td>

                        {/* Categoria */}
                        <td className="py-4 px-4 font-mono text-gray-300">
                          <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[10px] uppercase text-gray-300">
                            {product.categoria ? (categoryLabels[product.categoria] || product.categoria) : 'GERAL'}
                          </span>
                        </td>

                        {/* Tipo de Cobrança */}
                        <td className="py-4 px-4 font-mono">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                            product.tipo_cobranca === 'unico'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                              : product.tipo_cobranca === 'recorrente'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          }`}>
                            {product.tipo_cobranca === 'unico' ? 'ÚNICO (PROJETO)' : product.tipo_cobranca === 'recorrente' ? 'RECORRENTE (MRR)' : 'HÍBRIDO'}
                          </span>
                        </td>

                        {/* Preço Setup / Mensal */}
                        <td className="py-4 px-4 font-mono">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-white font-bold flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-brand-neon" />
                              Setup: {formatCurrency(product.preco_setup)}
                            </span>
                            {Number(product.preco_mensal) > 0 && (
                              <span className="text-[10px] text-emerald-400">
                                Mensal: {formatCurrency(product.preco_mensal)}/mês
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status Badges */}
                        <td className="py-4 px-4 font-mono">
                          {product.status ? (
                            <span className="inline-flex items-center gap-1 bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/30 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              <CheckCircle2 className="w-3 h-3" />
                              ATIVO
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-zinc-800 text-gray-400 border border-zinc-700 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              <XCircle className="w-3 h-3" />
                              INATIVO
                            </span>
                          )}
                        </td>

                        {/* Ações (Editar, Inativar/Ativar) */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Botão EDITAR */}
                            <button
                              onClick={() => handleOpenEditPage(product)}
                              disabled={isUpdating}
                              className="px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-wider rounded uppercase bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1"
                              title="Editar produto"
                            >
                              <Edit3 className="w-3 h-3" />
                              EDITAR
                            </button>

                            {/* Botão INATIVAR / ATIVAR */}
                            <button
                              onClick={() => handleToggleStatus(product)}
                              disabled={isUpdating}
                              className={`px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-wider rounded uppercase transition-all cursor-pointer flex items-center gap-1 ${
                                product.status
                                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                              }`}
                            >
                              {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Power className="w-3 h-3" />}
                              {product.status ? 'INATIVAR' : 'ATIVAR'}
                            </button>

                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

    </div>
  )
}
