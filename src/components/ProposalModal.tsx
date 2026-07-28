import React, { useState, useEffect } from 'react'
import { X, CheckCircle2, Loader2, Building2, User, Mail, Phone, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { productsData } from '../data/productsData'
import { submitProposalRequest } from '../services/leadServices'

interface ProposalModalProps {
  isOpen: boolean
  onClose: () => void
  initialProductSlug?: string
}

export default function ProposalModal({ isOpen, onClose, initialProductSlug }: ProposalModalProps) {
  // Form states
  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ'>('PJ')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [selectedProductSlug, setSelectedProductSlug] = useState('')
  const [needs, setNeeds] = useState('')

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Pre-select product when modal opens or initialProductSlug changes
  useEffect(() => {
    if (isOpen) {
      if (initialProductSlug) {
        setSelectedProductSlug(initialProductSlug)
      } else {
        setSelectedProductSlug('')
      }
      setIsSuccess(false)
      setIsSubmitting(false)
      // Lock scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore scroll
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, initialProductSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeCompleto || !email || !telefone || !selectedProductSlug || !needs) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setIsSubmitting(true)
    const product = productsData.find(p => p.slug === selectedProductSlug)

    const success = await submitProposalRequest({
      tipo_pessoa: tipoPessoa,
      nome_completo: nomeCompleto,
      email,
      telefone,
      produtoId: product?.id || '',
      produtoNome: product?.title || 'Personalizado',
      needs
    })

    setIsSubmitting(false)
    if (success) {
      setIsSuccess(true)
    } else {
      alert('Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop desfoque de vidro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-lg bg-brand-gray/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg z-10 flex flex-col max-h-[90vh]"
        >
          {/* Neon line decoration */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/60 to-transparent w-full" />

          {/* Absolute Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content area with internal scroll */}
          <div className="p-6 sm:p-8 overflow-y-auto">
            {!isSuccess ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="font-space font-extrabold text-2xl tracking-tight text-white uppercase">
                    SOLICITAR PROPOSTA TÉCNICA
                  </h3>
                  <p className="text-xs text-gray-400 font-sans font-light leading-relaxed">
                    Preencha os dados e receba um diagnóstico sob medida para a sua operação
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Toggle PF vs PJ */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">TIPO DE SOLICITANTE</label>
                    <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 border border-white/5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setTipoPessoa('PJ')}
                        className={`py-2 rounded text-xs font-mono font-bold uppercase transition-all tracking-wider ${
                          tipoPessoa === 'PJ'
                            ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/10'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Pessoa Jurídica (PJ)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoPessoa('PF')}
                        className={`py-2 rounded text-xs font-mono font-bold uppercase transition-all tracking-wider ${
                          tipoPessoa === 'PF'
                            ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/10'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Pessoa Física (PF)
                      </button>
                    </div>
                  </div>

                  {/* Nome / Razão Social */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                      {tipoPessoa === 'PJ' ? (
                        <>
                          <Building2 className="w-3 h-3 text-[#CCFF00]" />
                          RAZÃO SOCIAL DA EMPRESA *
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-[#CCFF00]" />
                          NOME COMPLETO *
                        </>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      placeholder={tipoPessoa === 'PJ' ? 'Ex: Minha Empresa LTDA' : 'Ex: João da Silva'}
                      className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Email & Telefone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#CCFF00]" />
                        E-MAIL CORPORATIVO *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: contato@empresa.com"
                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#CCFF00]" />
                        TELEFONE / WHATSAPP *
                      </label>
                      <input
                        type="tel"
                        required
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="Ex: (11) 99999-9999"
                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Produto de interesse */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">SOLUÇÃO DE INTERESSE *</label>
                    <select
                      required
                      value={selectedProductSlug}
                      onChange={(e) => setSelectedProductSlug(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:border-[#CCFF00] outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>Selecione uma solução tecnológica...</option>
                      {productsData.map((prod) => (
                        <option key={prod.id} value={prod.slug} className="bg-brand-gray text-white">
                          {prod.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Descrição das Necessidades */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">RESUMO DAS NECESSIDADES DO SEU PROJETO *</label>
                    <textarea
                      required
                      rows={4}
                      value={needs}
                      onChange={(e) => setNeeds(e.target.value)}
                      placeholder="Descreva brevemente o que você precisa (ex: integrações, escopo, volumetria)..."
                      className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 mt-2 bg-[#CCFF00] text-black rounded text-xs font-mono font-bold tracking-wider hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] transition-all duration-300 uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        PROCESSANDO SOLICITAÇÃO...
                      </>
                    ) : (
                      <>
                        ENVIAR SOLICITAÇÃO
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Success Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-6 flex flex-col items-center justify-center"
              >
                <div className="p-4 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-full text-[#CCFF00]">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h4 className="font-space font-extrabold text-xl text-white uppercase tracking-tight">
                    SOLICITAÇÃO ENVIADA COM SUCESSO!
                  </h4>
                  <p className="text-xs text-gray-400 font-sans font-light leading-relaxed">
                    Em breve nossa equipe disponibilizará a proposta técnica personalizada no seu painel.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono tracking-widest text-white uppercase hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  FECHAR JANELA
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
