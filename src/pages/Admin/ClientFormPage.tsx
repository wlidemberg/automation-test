import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { UserCheck, Building2, Save, ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProfileById, createAdminClient, updateClientProfile } from '../../services/profileServices'
import type { Profile, TipoPessoa } from '../../types/database'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import AdminHeader from '../../components/Admin/AdminHeader'

export default function ClientFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  // Sidebar collapsible state
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Form states
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>('PF')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [cpf, setCpf] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  // Billing address states (inside endereco JSONB)
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  // UI States
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Load client data if editing
  useEffect(() => {
    async function loadClientData() {
      if (!id) return
      setIsLoading(true)
      try {
        const profile = await getProfileById(id)
        if (profile) {
          setTipoPessoa(profile.tipo_pessoa || 'PF')
          setNomeCompleto(profile.nome_completo || '')
          setCpf(profile.cpf || '')
          setRazaoSocial(profile.razao_social || '')
          setCnpj(profile.cnpj || '')
          setEmail(profile.email || '')
          setTelefone(profile.telefone || '')

          // Parse billing address from JSONB
          const address = profile.endereco as any
          if (address) {
            setCep(address.cep || '')
            setLogradouro(address.logradouro || '')
            setNumero(address.numero || '')
            setComplemento(address.complemento || '')
            setBairro(address.bairro || '')
            setCidade(address.cidade || '')
            setEstado(address.estado || '')
          }
        } else {
          showToast('CLIENTE NÃO ENCONTRADO.', 'error')
          setTimeout(() => navigate('/admin/clientes'), 2000)
        }
      } catch (err) {
        console.error(err)
        showToast('ERRO AO CARREGAR DADOS DO CLIENTE.', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    loadClientData()
  }, [id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || (tipoPessoa === 'PF' && !nomeCompleto) || (tipoPessoa === 'PJ' && !razaoSocial)) {
      showToast('POR FAVOR, PREENCHA OS CAMPOS OBRIGATÓRIOS (*).', 'error')
      return
    }

    setIsSaving(true)

    const addressPayload = {
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    }

    const payload: Partial<Profile> = {
      tipo_pessoa: tipoPessoa,
      email,
      telefone,
      nome_completo: tipoPessoa === 'PF' ? nomeCompleto : null,
      cpf: tipoPessoa === 'PF' ? cpf : null,
      razao_social: tipoPessoa === 'PJ' ? razaoSocial : null,
      cnpj: tipoPessoa === 'PJ' ? cnpj : null,
      endereco: addressPayload,
      updated_at: new Date().toISOString()
    }

    try {
      if (isEditing && id) {
        const updated = await updateClientProfile(id, payload)
        if (updated) {
          showToast('DADOS DO CLIENTE ATUALIZADOS COM SUCESSO!', 'success')
          setTimeout(() => navigate('/admin/clientes'), 1500)
        } else {
          showToast('ERRO AO ATUALIZAR CLIENTE NO BANCO DE DADOS.', 'error')
        }
      } else {
        const created = await createAdminClient(payload)
        if (created) {
          showToast('NOVO CLIENTE CADASTRADO COM SUCESSO!', 'success')
          setTimeout(() => navigate('/admin/clientes'), 1500)
        } else {
          showToast('ERRO AO CRIAR CLIENTE NO BANCO DE DADOS.', 'error')
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
        activeItem="clientes"
      />

      {/* Main Top Header */}
      <AdminHeader
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        activeSectionLabel="Clientes"
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
              <Link to="/admin/clientes" className="hover:text-white">Clientes</Link>
              <span>/</span>
              <span className="text-brand-neon">{isEditing ? 'Editar Cliente' : 'Cadastrar Cliente'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-space font-extrabold tracking-tight text-white uppercase">
              {isEditing ? 'Editar Cliente' : 'Cadastrar Cliente'}
            </h1>
          </div>

          <Link
            to="/admin/clientes"
            className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white rounded text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 hover:bg-white/5 transition-all self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            VOLTAR PARA LISTA
          </Link>
        </div>

        {isLoading ? (
          <div className="py-24 text-center space-y-4 bg-brand-gray/50 border border-white/5 rounded-lg">
            <Loader2 className="w-8 h-8 text-brand-neon animate-spin mx-auto" />
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Carregando dados do cliente...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {/* 1. Dados Principais */}
            <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
              
              <div className="border-b border-white/5 pb-3">
                <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider">
                  1. DADOS PRINCIPAIS DO CLIENTE
                </h2>
              </div>

              {/* Alternador de Tipo de Pessoa */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">TIPO DE CADASTRO</label>
                <div className="grid grid-cols-2 gap-3 max-w-md bg-black/40 p-1 border border-white/5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setTipoPessoa('PF')}
                    className={`py-2 rounded text-xs font-mono font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                      tipoPessoa === 'PF'
                        ? 'bg-brand-neon text-black font-extrabold shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    PESSOA FÍSICA (PF)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoPessoa('PJ')}
                    className={`py-2 rounded text-xs font-mono font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                      tipoPessoa === 'PJ'
                        ? 'bg-[#22D3EE] text-black font-extrabold shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    PESSOA JURÍDICA (PJ)
                  </button>
                </div>
              </div>

              {/* Dynamic name / social fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {tipoPessoa === 'PF' ? (
                  <>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">NOME COMPLETO *</label>
                      <input
                        type="text"
                        required
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        placeholder="Ex: Alexandre de Souza Ramos"
                        className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">CPF</label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">RAZÃO SOCIAL DA EMPRESA *</label>
                      <input
                        type="text"
                        required
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                        placeholder="Ex: Ramos Tecnologia e Automação LTDA"
                        className="w-full bg-black/40 border border-white/10 focus:border-[#22D3EE] outline-none transition-all rounded px-4 py-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">CNPJ</label>
                      <input
                        type="text"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="00.000.000/0001-00"
                        className="w-full bg-black/40 border border-white/10 focus:border-[#22D3EE] outline-none transition-all rounded px-4 py-3 text-xs text-white font-mono"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">E-MAIL DE ACESSO / LOGIN *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cliente@empresa.com"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">TELEFONE / WHATSAPP *</label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Endereço de Faturamento */}
            <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon/40 to-transparent" />
              
              <div className="border-b border-white/5 pb-3">
                <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider">
                  2. ENDEREÇO DE FATURAMENTO / NOTA FISCAL
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                <div className="space-y-2 sm:col-span-3">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">CEP</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-2 sm:col-span-9">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">LOGRADOURO (AVENIDA/RUA)</label>
                  <input
                    type="text"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                    placeholder="Ex: Avenida Paulista"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2 sm:col-span-3">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">NÚMERO</label>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="Ex: 1500"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2 sm:col-span-5">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">COMPLEMENTO</label>
                  <input
                    type="text"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    placeholder="Ex: Bloco A - Sala 302"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2 sm:col-span-4">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">BAIRRO</label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Ex: Bela Vista"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2 sm:col-span-8">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">CIDADE</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Ex: São Paulo"
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2 sm:col-span-4">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">ESTADO (UF)</label>
                  <input
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    placeholder="Ex: SP"
                    maxLength={2}
                    className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white uppercase font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions Form */}
            <div className="border-t border-white/5 pt-6 flex justify-end gap-3 font-mono">
              <Link
                to="/admin/clientes"
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
                    SALVAR CLIENTE
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
