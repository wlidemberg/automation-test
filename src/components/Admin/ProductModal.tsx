import React, { useState, useEffect } from 'react'
import { X, Package, Save, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product, ProductCategory, PricingType } from '../../types/database'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Product>) => Promise<void>
  initialData?: Product | null
  isSaving?: boolean
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false
}: ProductModalProps) {
  const isEditing = Boolean(initialData?.id)

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

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || '')
      setSlug(initialData.slug || '')
      setRotulo(initialData.rotulo || '')
      setCategoria(initialData.categoria || 'design_web')
      setTipoCobranca(initialData.tipo_cobranca || 'unico')
      setPrecoSetup(initialData.preco_setup ? String(initialData.preco_setup) : '0')
      setPrecoMensal(initialData.preco_mensal ? String(initialData.preco_mensal) : '0')
      setDescricaoCurta(initialData.descricao_curta || '')
      setIcone(initialData.icone || 'Package')

      // Trata recursos se vier como array ou jsonb
      let recs: string[] = []
      if (Array.isArray(initialData.recursos)) {
        recs = initialData.recursos
      } else if (typeof initialData.recursos === 'string') {
        try {
          recs = JSON.parse(initialData.recursos)
        } catch {
          recs = []
        }
      }
      setRecursos(recs)
    } else {
      setNome('')
      setSlug('')
      setRotulo('')
      setCategoria('design_web')
      setTipoCobranca('unico')
      setPrecoSetup('0')
      setPrecoMensal('0')
      setDescricaoCurta('')
      setIcone('Package')
      setRecursos([])
    }
  }, [initialData, isOpen])

  // Gerador automático de Slug a partir do nome
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

    const payload: Partial<Product> = {
      ...(initialData || {}),
      nome,
      slug: slug || nome.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rotulo,
      categoria,
      tipo_cobranca: tipoCobranca,
      preco_setup: parseFloat(precoSetup) || 0,
      preco_mensal: parseFloat(precoMensal) || 0,
      descricao_curta: descricaoCurta,
      icone,
      recursos,
      status: initialData?.status !== undefined ? initialData.status : true,
    }

    await onSave(payload)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop (Dark Overlay) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black backdrop-blur-sm"
        />

        {/* Modal Body Tech-Luxo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-brand-gray/95 border border-white/10 rounded-lg p-6 sm:p-8 relative z-10 backdrop-blur-lg shadow-[0_25px_50px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto"
        >
          {/* Neon Accent Top Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon/70 to-transparent" />

          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-6">
            <div>
              <span className="text-[9px] tracking-widest font-mono text-brand-neon uppercase font-bold block mb-1">
                {isEditing ? 'Gestão do Catálogo' : 'Novo Produto & Solução'}
              </span>
              <h3 className="font-space font-extrabold text-white text-lg uppercase flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-neon" />
                {isEditing ? 'EDITAR PRODUTO' : 'CADASTRAR PRODUTO'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome do Produto */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                  NOME DO PRODUTO *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => handleNomeChange(e.target.value)}
                  placeholder="Ex: Landing Page de Alta Conversão"
                  className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-sans"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                  SLUG (URL AMIGÁVEL)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="landing-page"
                  className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-brand-neon font-mono"
                />
              </div>
            </div>

            {/* Rótulo / Badge Destaque */}
            <div className="space-y-2">
              <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                RÓTULO / BADGE DE DESTAQUE (EX: AUTORIDADE DIGITAL)
              </label>
              <input
                type="text"
                value={rotulo}
                onChange={(e) => setRotulo(e.target.value)}
                placeholder="Ex: AUTORIDADE DIGITAL, FOCO EXTREMO EM CONVERSÃO"
                className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Categoria */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                  CATEGORIA *
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as ProductCategory)}
                  className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-3 py-2.5 text-xs text-white uppercase font-sans cursor-pointer"
                >
                  <option value="design_web">Design / Web (Sites & Landing Pages)</option>
                  <option value="desenvolvimento">Desenvolvimento (Lojas & Portais)</option>
                  <option value="erp_saas">Sistemas ERP & SaaS</option>
                  <option value="automacao">Automação de Processos</option>
                  <option value="ia">Agentes de IA</option>
                </select>
              </div>

              {/* Tipo de Cobrança */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                  TIPO DE COBRANÇA *
                </label>
                <select
                  value={tipoCobranca}
                  onChange={(e) => setTipoCobranca(e.target.value as PricingType)}
                  className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-3 py-2.5 text-xs text-white uppercase font-sans cursor-pointer"
                >
                  <option value="unico">Projeto Sob Medida (Único)</option>
                  <option value="recorrente">Licença Recorrente (MRR)</option>
                  <option value="hibrido">Híbrido (Setup + Recorrência)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preço de Setup */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                  PREÇO SETUP / PROJETO (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={precoSetup}
                  onChange={(e) => setPrecoSetup(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              {/* Preço Mensal */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                  MENSALIDADE / RECORRÊNCIA (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={precoMensal}
                  onChange={(e) => setPrecoMensal(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Descrição Curta */}
            <div className="space-y-2">
              <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                DESCRIÇÃO CURTA *
              </label>
              <textarea
                required
                rows={3}
                value={descricaoCurta}
                onChange={(e) => setDescricaoCurta(e.target.value)}
                placeholder="Descrição de alto impacto comercial do produto..."
                className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-sans resize-none"
              />
            </div>

            {/* Ícone Lucide */}
            <div className="space-y-2">
              <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                ÍCONE DA ILUSTRAÇÃO (LUCIDE-REACT)
              </label>
              <input
                type="text"
                value={icone}
                onChange={(e) => setIcone(e.target.value)}
                placeholder="Ex: Globe, Layout, ShoppingBag, Database, Zap, Bot"
                className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>

            {/* Recursos / Especificações Tags */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                RECURSOS E ESPECIFICAÇÕES (TAGS)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRecursoInput}
                  onChange={(e) => setNewRecursoInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRecurso(); } }}
                  placeholder="Ex: Design Responsivo, SEO Avançado, Checkout Transparente..."
                  className="flex-1 bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2 text-xs text-white font-sans"
                />
                <button
                  type="button"
                  onClick={handleAddRecurso}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded text-xs font-mono font-bold hover:bg-white/20 transition-all uppercase flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  ADD
                </button>
              </div>

              {/* Tag List */}
              {recursos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {recursos.map((rec, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-brand-neon/10 border border-brand-neon/30 text-brand-neon text-[10px] font-mono px-2.5 py-1 rounded"
                    >
                      {rec}
                      <button
                        type="button"
                        onClick={() => handleRemoveRecurso(idx)}
                        className="hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="border-t border-white/10 pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2.5 border border-white/10 text-gray-300 hover:text-white rounded text-[10px] tracking-wider font-semibold hover:bg-white/5 uppercase transition-all duration-300 font-mono cursor-pointer disabled:opacity-50"
              >
                CANCELAR
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-brand-neon text-black rounded text-[10px] tracking-wider font-extrabold hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all duration-300 uppercase flex items-center gap-2 cursor-pointer font-mono disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'SALVANDO...' : 'SALVAR PRODUTO'}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
