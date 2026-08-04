import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Send } from 'lucide-react'
import { fetchAllProfiles } from '../../services/profileServices'
import { fetchAllProducts } from '../../services/productServices'
import { createProposal, sendProposalToClient } from '../../services/proposalServices'
import type { Profile, Product } from '../../types/database'

interface ProposalModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function ProposalModal({ isOpen, onClose, onSuccess }: ProposalModalProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [valorSetup, setValorSetup] = useState('')
  const [valorMensal, setValorMensal] = useState('')
  const [escopo, setEscopo] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Load clients and products when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        setLoadingData(true)
        setErrorMsg('')
        setSuccessMsg('')
        try {
          const [profilesData, productsData] = await Promise.all([
            fetchAllProfiles(),
            fetchAllProducts()
          ])
          // Apenas perfis com role = client
          const clientsOnly = profilesData.filter(p => p.role === 'client')
          setProfiles(clientsOnly)
          setProducts(productsData)
        } catch (err) {
          console.error(err)
          setErrorMsg('Falha ao carregar dados do banco.')
        } finally {
          setLoadingData(false)
        }
      }
      loadData()
      // Limpar form
      setSelectedClientId('')
      setSelectedProductId('')
      setValorSetup('')
      setValorMensal('')
      setEscopo('')
    }
  }, [isOpen])

  // Pre-fill fields when selecting product
  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId)
    const product = products.find(p => p.id === prodId)
    if (product) {
      // Usando preenchimento compatível com ambos os nomes de campos das tabelas
      const setup = product.valor_setup !== undefined ? product.valor_setup : (product.preco_setup || 0)
      const mensal = product.valor_mensalidade !== undefined ? product.valor_mensalidade : (product.preco_mensal || 0)
      const desc = product.descricao || product.descricao_curta || ''

      setValorSetup(setup.toString())
      setValorMensal(mensal.toString())
      setEscopo(`Desenvolvimento de: ${product.nome}. ${desc}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClientId || !selectedProductId || !valorSetup || !escopo) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (*).')
      return
    }

    setSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const client = profiles.find(p => p.id === selectedClientId)
      const product = products.find(p => p.id === selectedProductId)
      if (!client || !product) {
        throw new Error('Cliente ou Produto inválido.')
      }

      // 1. Criar proposta/projeto em estado pendente
      const projectPayload = {
        client_id: selectedClientId,
        nome: product.nome.toUpperCase(),
        descricao: escopo,
        fase_atual: 'proposta_pendente' as any, // Cast temporário de tipo para ProjectPhase
        ativo: true
      }

      const createdProject = await createProposal(projectPayload)
      if (!createdProject) {
        throw new Error('Falha ao criar o registro do projeto.')
      }

      // 2. Enviar proposta ao cliente (muda fase para proposta_enviada e gera a fatura de 50%)
      const result = await sendProposalToClient(
        createdProject.id,
        parseFloat(valorSetup),
        parseFloat(valorMensal) || 0,
        escopo
      )

      if (!result) {
        throw new Error('Falha ao finalizar o envio da proposta.')
      }

      setSuccessMsg('PROPOSTA ENVIADA AO CLIENTE COM SUCESSO!')
      setTimeout(() => {
        if (onSuccess) onSuccess()
        onClose()
      }, 1500)

    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Falha ao processar proposta.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
          />

          {/* Modal Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg bg-zinc-900/90 border border-white/10 rounded-lg p-6 sm:p-8 relative overflow-hidden backdrop-blur-lg shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/60 to-transparent" />
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6">
              <div>
                <span className="text-[9px] tracking-widest font-mono text-[#CCFF00] uppercase font-bold block mb-1">
                  NOVA PROPOSTA COMERCIAL
                </span>
                <h3 className="font-space font-bold text-white text-base uppercase">
                  Enviar proposta personalizada
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white rounded border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            {loadingData ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#CCFF00] animate-spin mx-auto" />
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  CARREGANDO PARÂMETROS...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded text-xs font-mono uppercase text-center">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-[#CCFF00]/15 border border-[#CCFF00]/20 text-[#CCFF00] rounded text-xs font-mono uppercase text-center font-bold">
                    {successMsg}
                  </div>
                )}

                {/* Cliente */}
                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                    CLIENTE DESTINATÁRIO *
                  </label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] outline-none transition-all duration-300 rounded px-3 py-2.5 text-xs text-white uppercase font-sans cursor-pointer"
                  >
                    <option value="">Selecione o Cliente</option>
                    {profiles.map(p => {
                      const name = p.razao_social || p.nome_completo || p.email
                      return (
                        <option key={p.id} value={p.id}>
                          {name.toUpperCase()} ({p.tipo_pessoa})
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Produto do catálogo */}
                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                    PRODUTO / BASE DO SERVIÇO *
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] outline-none transition-all duration-300 rounded px-3 py-2.5 text-xs text-white uppercase font-sans cursor-pointer"
                  >
                    <option value="">Selecione o Produto</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Precificação setup e mensal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                      VALOR IMPLEMENTAÇÃO / SETUP (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ex: 5000"
                      value={valorSetup}
                      onChange={(e) => setValorSetup(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                      VALOR RECORRÊNCIA / MENSAL (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 800"
                      value={valorMensal}
                      onChange={(e) => setValorMensal(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* Resumo escopo */}
                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                    ESCOPO / RESUMO DO PROJETO *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detalhamento das entregas e termos da proposta"
                    value={escopo}
                    onChange={(e) => setEscopo(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-sans resize-none"
                  />
                </div>

                {/* Footer buttons */}
                <div className="border-t border-white/5 pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 border border-white/10 text-white rounded text-[10px] tracking-wider font-semibold hover:bg-white/5 uppercase transition-all duration-300 font-mono cursor-pointer"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-[#CCFF00] text-black rounded text-[10px] tracking-wider font-bold hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all duration-300 uppercase flex items-center gap-1.5 cursor-pointer font-mono disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    ENVIAR PROPOSTA AO CLIENTE
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
