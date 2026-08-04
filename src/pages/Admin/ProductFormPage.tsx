import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Save, ArrowLeft, Loader2, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createProduct, updateProduct } from '../../services/productServices'
import { supabase } from '../../lib/supabase'
import type { Product, ProductCategory, PricingType } from '../../types/database'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import AdminHeader from '../../components/Admin/AdminHeader'

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  // Sidebar collapsible state
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Form states
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [rotulo, setRotulo] = useState('')
  const [categoria, setCategoria] = useState<ProductCategory>('design_web')
  const [tipoCobranca, setTipoCobranca] = useState<PricingType>('unico')
  const [precoSetup, setPrecoSetup] = useState<string>('0')
  const [precoMensal, setPrecoMensal] = useState<string>('0')
  const [descricaoCurta, setDescricaoCurta] = useState('')
  const [icone, setIcone] = useState('Package')
  const [recursos, setRecursos] = useState<string[]>([])
  const [newRecursoInput, setNewRecursoInput] = useState('')

  // UI States
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Load product if editing
  useEffect(() => {
    async function loadProductData() {
      if (!id) return
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !data) {
          showToast('PRODUTO NÃO ENCONTRADO NO BANCO DE DADOS.', 'error')
          setTimeout(() => navigate('/admin/produtos'), 2000)
          return
        }

        setNome(data.nome || '')
        setSlug(data.slug || '')
        setRotulo(data.rotulo || '')
        setCategoria(data.categoria || 'design_web')
        setTipoCobranca(data.tipo_cobranca || 'unico')
        setPrecoSetup(data.preco_setup ? String(data.preco_setup) : '0')
        setPrecoMensal(data.preco_mensal ? String(data.preco_mensal) : '0')
        setDescricaoCurta(data.descricao_curta || '')
        setIcone(data.icone || 'Package')

        let recs: string[] = []
        if (Array.isArray(data.recursos)) {
          recs = data.recursos
        } else if (typeof data.recursos === 'string') {
          try {
            recs = JSON.parse(data.recursos)
          } catch {
            recs = []
          }
        }
        setRecursos(recs)
      } catch (err) {
        console.error(err)
        showToast('ERRO AO CARREGAR DADOS DO PRODUTO.', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    loadProductData()
  }, [id, navigate])

  const handleNomeChange = (val: string) => {
    setNome(val)
    if (!isEditing || !slug) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setSlug(generatedSlug)
    }
  }

  const handleAddRecurso = () => {
    if (newRecursoInput.trim()) {
      setRecursos([...recursos, newRecursoInput.trim()])
      setNewRecursoInput('')
    }
  }

  const handleRemoveRecurso = (index: number) => {
    setRecursos(recursos.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !slug || !descricaoCurta) {
      showToast('POR FAVOR, PREENCHA OS CAMPOS OBRIGATÓRIOS (*).', 'error')
      return
    }

    setIsSaving(true)

    const payload: Partial<Product> = {
      nome,
      slug,
      rotulo,
      categoria,
      tipo_cobranca: tipoCobranca,
      preco_setup: parseFloat(precoSetup) || 0,
      preco_mensal: parseFloat(precoMensal) || 0,
      descricao_curta: descricaoCurta,
      icone,
      recursos,
    }

    try {
      if (isEditing && id) {
        const updated = await updateProduct(id, payload)
        if (updated) {
          showToast('PRODUTO ATUALIZADO COM SUCESSO!', 'success')
          setTimeout(() => navigate('/admin/produtos'), 1500)
        } else {
          showToast('ERRO AO ATUALIZAR PRODUTO NO BANCO DE DADOS.', 'error')
        }
      } else {
        const created = await createProduct(payload)
        if (created) {
          showToast('NOVO PRODUTO CADASTRADO NO CATÁLOGO!', 'success')
          setTimeout(() => navigate('/admin/produtos'), 1500)
        } else {
          showToast('ERRO AO CRIAR PRODUTO NO BANCO DE DADOS.', 'error')
        }
      }
    } catch (err) {
      console.error(err)
      showToast('FALHA DE COMUNICAÇÃO COM O SERVIDOR.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans relative overflow-x-hidden">
      
      {/* Decorative Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-neon/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Collapsible Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        activeItem="produtos"
      />

      {/* Main Top Header */}
      <AdminHeader
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        activeSectionLabel="Produtos"
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

      <main
        className={`p-6 sm:p-8 space-y-6 transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-5 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <Link to="/admin" className="hover:text-white">Admin</Link>
              <span>/</span>
              <Link to="/admin/produtos" className="hover:text-white">Produtos</Link>
              <span>/</span>
              <span className="text-brand-neon">{isEditing ? 'Editar Produto' : 'Cadastrar Produto'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-space font-extrabold tracking-tight text-white uppercase">
              {isEditing ? 'Editar Produto' : 'Cadastrar Produto'}
            </h1>
          </div>

          <Link
            to="/admin/produtos"
            className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white rounded text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 hover:bg-white/5 transition-all self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            VOLTAR PARA LISTA
          </Link>
        </div>

        {isLoading ? (
          <div className="py-24 text-center space-y-4 bg-brand-gray/50 border border-white/5 rounded-lg">
            <Loader2 className="w-8 h-8 text-brand-neon animate-spin mx-auto" />
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Carregando dados do produto...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {/* 1. Informações Básicas */}
            <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
              
              <div className="border-b border-white/5 pb-3">
                <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider">
                  1. INFORMAÇÕES BÁSICAS DA SOLUÇÃO
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">NOME DO PRODUTO *</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => handleNomeChange(e.target.value)}
                    placeholder="Ex: Integração Multi-APIs de WhatsApp"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">SLUG (URL AMIGÁVEL) *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Ex: integracao-whatsapp"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-brand-neon font-mono"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">RÓTULO / BADGE DE DESTAQUE</label>
                  <input
                    type="text"
                    value={rotulo}
                    onChange={(e) => setRotulo(e.target.value)}
                    placeholder="Ex: AUTOMAÇÃO ROBUSTA, ESCALA ENTERPRISE"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white font-mono uppercase"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">CATEGORIA *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as ProductCategory)}
                    className="w-full bg-black/45 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-3 py-3 text-xs text-white uppercase font-sans cursor-pointer"
                  >
                    <option value="design_web">Design / Web (Sites & Landing Pages)</option>
                    <option value="desenvolvimento">Desenvolvimento (Lojas & Portais)</option>
                    <option value="erp_saas">Sistemas ERP & SaaS</option>
                    <option value="automacao">Automação de Processos</option>
                    <option value="ia">Agentes de IA</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Precificação */}
            <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon/40 to-transparent" />
              
              <div className="border-b border-white/5 pb-3">
                <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider">
                  2. MODELO DE PRECIFICAÇÃO DO PRODUTO
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">TIPO DE COBRANÇA *</label>
                  <select
                    value={tipoCobranca}
                    onChange={(e) => setTipoCobranca(e.target.value as PricingType)}
                    className="w-full bg-black/45 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-3 py-3 text-xs text-white uppercase font-sans cursor-pointer"
                  >
                    <option value="unico">Projeto Único (Setup)</option>
                    <option value="recorrente">Recorrente Mensal (MRR)</option>
                    <option value="hibrido">Híbrido (Setup + Mensalidade)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">VALOR DE SETUP (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={precoSetup}
                    onChange={(e) => setPrecoSetup(e.target.value)}
                    placeholder="0.00"
                    disabled={tipoCobranca === 'recorrente'}
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white font-mono disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">MENSALIDADE (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={precoMensal}
                    onChange={(e) => setPrecoMensal(e.target.value)}
                    placeholder="0.00"
                    disabled={tipoCobranca === 'unico'}
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white font-mono disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 3. Apresentação & Mídia */}
            <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
              
              <div className="border-b border-white/5 pb-3">
                <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider">
                  3. APRESENTAÇÃO E DETALHAMENTO DO PRODUTO
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">DESCRIÇÃO CURTA *</label>
                  <textarea
                    required
                    rows={3}
                    value={descricaoCurta}
                    onChange={(e) => setDescricaoCurta(e.target.value)}
                    placeholder="Descreva a solução de forma curta e atrativa comercialmente..."
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">ÍCONE LUCIDE-REACT</label>
                  <input
                    type="text"
                    value={icone}
                    onChange={(e) => setIcone(e.target.value)}
                    placeholder="Ex: Globe, Cpu, ShoppingBag, Database, Bot, Zap"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">RECURSOS E CARACTERÍSTICAS (TAGS)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRecursoInput}
                      onChange={(e) => setNewRecursoInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRecurso(); } }}
                      placeholder="Ex: Painel Exclusivo, Backup Automático, Rastreamento Realtime"
                      className="flex-1 bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-2.5 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddRecurso}
                      className="px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded text-xs font-mono font-bold hover:bg-white/20 transition-all uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      ADICIONAR
                    </button>
                  </div>

                  {recursos.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {recursos.map((rec, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 bg-brand-neon/10 border border-brand-neon/30 text-brand-neon text-[10px] font-mono px-2.5 py-1 rounded"
                        >
                          {rec}
                          <button
                            type="button"
                            onClick={() => handleRemoveRecurso(index)}
                            className="hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions Form */}
            <div className="border-t border-white/5 pt-6 flex justify-end gap-3 font-mono">
              <Link
                to="/admin/produtos"
                className="px-6 py-3 border border-white/10 text-gray-300 hover:text-white rounded text-xs tracking-wider font-semibold hover:bg-white/5 uppercase transition-all duration-300"
              >
                CANCELAR
              </Link>
              
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-brand-neon text-black rounded text-xs tracking-wider font-extrabold hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300 uppercase flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    SALVANDO...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    SALVAR PRODUTO
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
