import React, { useState, useEffect } from 'react'
import { X, UserCheck, Building2, Save, UserPlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Profile, TipoPessoa } from '../../types/database'

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Profile>) => Promise<void>
  initialData?: Profile | null
  isSaving?: boolean
}

export default function ClientModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false
}: ClientModalProps) {
  const isEditing = Boolean(initialData?.id)

  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>('PF')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [cpf, setCpf] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  useEffect(() => {
    if (initialData) {
      setTipoPessoa(initialData.tipo_pessoa || 'PF')
      setNomeCompleto(initialData.nome_completo || '')
      setCpf(initialData.cpf || '')
      setRazaoSocial(initialData.razao_social || '')
      setCnpj(initialData.cnpj || '')
      setEmail(initialData.email || '')
      setTelefone(initialData.telefone || '')
    } else {
      setTipoPessoa('PF')
      setNomeCompleto('')
      setCpf('')
      setRazaoSocial('')
      setCnpj('')
      setEmail('')
      setTelefone('')
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: Partial<Profile> = {
      ...(initialData || {}),
      tipo_pessoa: tipoPessoa,
      email,
      telefone,
      nome_completo: tipoPessoa === 'PF' ? nomeCompleto : null,
      cpf: tipoPessoa === 'PF' ? cpf : null,
      razao_social: tipoPessoa === 'PJ' ? razaoSocial : null,
      cnpj: tipoPessoa === 'PJ' ? cnpj : null,
      // Se for um novo cadastro feito pelo Admin, atribui automaticamente o status 'ativo'
      ...(!isEditing && { status: 'ativo', role: 'client' })
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

        {/* Modal Container Tech-Luxo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl bg-brand-gray/95 border border-white/10 rounded-lg p-6 sm:p-8 relative z-10 backdrop-blur-lg shadow-[0_25px_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Neon Gradient Accent Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon/70 to-transparent" />

          {/* Modal Header */}
          <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-6">
            <div>
              <span className="text-[9px] tracking-widest font-mono text-brand-neon uppercase font-bold block mb-1">
                {isEditing ? 'Edição de Perfil' : 'Novo Cliente Administrador'}
              </span>
              <h3 className="font-space font-extrabold text-white text-lg uppercase flex items-center gap-2">
                {isEditing ? <UserCheck className="w-5 h-5 text-brand-neon" /> : <UserPlus className="w-5 h-5 text-brand-neon" />}
                {isEditing ? 'EDITAR DADOS DO CLIENTE' : 'CADASTRAR NOVO CLIENTE'}
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
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Alternador de Tipo de Pessoa (PF vs PJ) */}
            <div className="space-y-2">
              <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                TIPO DE PESSOA
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-black/40 border border-white/10 rounded-md">
                <button
                  type="button"
                  onClick={() => setTipoPessoa('PF')}
                  className={`py-2.5 px-3 rounded text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                    tipoPessoa === 'PF'
                      ? 'bg-brand-neon text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  PESSOA FÍSICA (PF)
                </button>

                <button
                  type="button"
                  onClick={() => setTipoPessoa('PJ')}
                  className={`py-2.5 px-3 rounded text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                    tipoPessoa === 'PJ'
                      ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  PESSOA JURÍDICA (PJ)
                </button>
              </div>
            </div>

            {/* Dynamic Fields according to TipoPessoa */}
            {tipoPessoa === 'PF' ? (
              /* Campos para Pessoa Física */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                    NOME COMPLETO *
                  </label>
                  <input
                    type="text"
                    required
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                    TELEFONE / WHATSAPP
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            ) : (
              /* Campos para Pessoa Jurídica */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                    RAZÃO SOCIAL / EMPRESA *
                  </label>
                  <input
                    type="text"
                    required
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                    placeholder="Ex: Acme Tecnologia Ltda"
                    className="w-full bg-black/50 border border-white/10 focus:border-cyan-400 outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-black/50 border border-white/10 focus:border-cyan-400 outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                    TELEFONE / CONTATO
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-black/50 border border-white/10 focus:border-cyan-400 outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Email Field (Common to PF and PJ) */}
            <div className="space-y-2">
              <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                E-MAIL DE ACESSO *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@empresa.com"
                className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-sans"
              />
            </div>

            {/* Modal Actions */}
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
                {isSaving 
                  ? 'SALVANDO...' 
                  : isEditing 
                    ? 'SALVAR CLIENTE' 
                    : 'CADASTRAR CLIENTE'
                }
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
