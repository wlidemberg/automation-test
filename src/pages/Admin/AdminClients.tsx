import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Search, 
  Plus, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserX, 
  Loader2, 
  Edit3, 
  Power,
  RefreshCw 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  fetchAllProfiles, 
  updateProfileStatus 
} from '../../services/profileServices'
import type { Profile, UserStatus } from '../../types/database'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import AdminHeader from '../../components/Admin/AdminHeader'
import ProposalModal from '../../components/Admin/ProposalModal'

export default function AdminClients() {
  // Sidebar State
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  // Profiles and Filter States
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const navigate = useNavigate()

  // Modal State
  const [isProposalModalOpen, setIsProposalModalOpen] = useState<boolean>(false)

  // Load profiles from Supabase
  const loadProfiles = async () => {
    setLoading(true)
    try {
      const data = await fetchAllProfiles()
      setProfiles(data)
    } catch (err) {
      console.error('Erro ao carregar clientes:', err)
      showToast('FALHA AO CONECTAR COM O SUPABASE.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Filter profiles based on search query
  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return profiles

    const query = searchQuery.toLowerCase().trim()
    return profiles.filter((p) => {
      const nome = (p.nome_completo || '').toLowerCase()
      const razao = (p.razao_social || '').toLowerCase()
      const email = (p.email || '').toLowerCase()
      const cpf = (p.cpf || '').toLowerCase()
      const cnpj = (p.cnpj || '').toLowerCase()

      return (
        nome.includes(query) ||
        razao.includes(query) ||
        email.includes(query) ||
        cpf.includes(query) ||
        cnpj.includes(query)
      )
    })
  }, [profiles, searchQuery])

  // Handle status update (Aprovar, Recusar, Inativar, Ativar)
  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    setUpdatingId(userId)
    try {
      const updated = await updateProfileStatus(userId, newStatus)
      if (updated) {
        await loadProfiles()
        const statusLabel = 
          newStatus === 'ativo' ? 'ATIVADO' :
          newStatus === 'inativo' ? 'INATIVADO' :
          newStatus === 'recusado' ? 'RECUSADO' : 'PENDENTE'
        
        showToast(`STATUS DO CLIENTE ALTERADO PARA ${statusLabel} COM SUCESSO!`, 'success')
      } else {
        showToast('ERRO AO ATUALIZAR STATUS NO BANCO DE DADOS.', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('FALHA DE REDE AO PROCESSAR SOLICITAÇÃO.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  // Redirect to Dedicated Pages
  const handleOpenCreatePage = () => {
    navigate('/admin/clientes/novo')
  }

  const handleOpenEditPage = (client: Profile) => {
    navigate(`/admin/clientes/editar/${client.id}`)
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
        onRefresh={loadProfiles}
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
              Clientes
            </h1>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Gerencie sua base de clientes, edite cadastros e altere status em tempo real.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsProposalModalOpen(true)}
              className="px-5 py-3 border border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00]/10 rounded text-xs font-mono font-extrabold tracking-wider transition-all duration-300 uppercase flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              + NOVA PROPOSTA
            </button>
            <button
              onClick={handleOpenCreatePage}
              className="px-5 py-3 bg-brand-neon text-black rounded text-xs font-mono font-extrabold tracking-wider hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300 uppercase flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              + NOVO CLIENTE
            </button>
          </div>
        </div>

        {/* Search Bar Input (Glassmorphism) */}
        <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-4 backdrop-blur-sm shadow-xl flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-neon shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por Nome, Razão Social, CPF, CNPJ ou E-mail..."
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

        {/* Client Table Container */}
        <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-2xl">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-neon" />
              TOTAL DE CLIENTES ENCONTRADOS: <strong className="text-white font-bold">{filteredProfiles.length}</strong>
            </span>

            <button
              onClick={loadProfiles}
              className="p-1.5 rounded border border-white/10 text-gray-400 hover:text-brand-neon hover:border-brand-neon/30 transition-all text-[10px] font-mono uppercase flex items-center gap-1.5"
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
                CARREGANDO BASE DE CLIENTES DO SUPABASE...
              </p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            /* Table Empty State */
            <div className="py-16 text-center space-y-3 bg-black/20 rounded border border-white/5 backdrop-blur-sm">
              <Users className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-sm font-space font-bold text-gray-300 uppercase tracking-wider">
                NENHUM CLIENTE ENCONTRADO
              </p>
              <p className="text-xs text-gray-500 font-mono max-w-md mx-auto">
                {searchQuery 
                  ? 'Nenhum resultado corresponde aos termos da sua busca.' 
                  : 'Sua base de clientes está vazia. Clique em "+ NOVO CLIENTE" para cadastrar.'}
              </p>
            </div>
          ) : (
            /* Client Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[9px] font-mono text-gray-400 uppercase tracking-widest bg-white/[0.02]">
                    <th className="py-4 px-4 font-semibold">Cliente / Razão Social</th>
                    <th className="py-4 px-4 font-semibold">E-mail</th>
                    <th className="py-4 px-4 font-semibold">Telefone & Documento</th>
                    <th className="py-4 px-4 font-semibold">Tipo</th>
                    <th className="py-4 px-4 font-semibold">Status</th>
                    <th className="py-4 px-4 font-semibold text-right">Ações Gerenciais</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredProfiles.map((profile) => {
                    const isPJ = profile.tipo_pessoa === 'PJ'
                    const nomeExibicao = isPJ 
                      ? (profile.razao_social || 'Razão Social não informada')
                      : (profile.nome_completo || 'Nome não informado')
                    const documentoExibicao = isPJ
                      ? (profile.cnpj || 'CNPJ não informado')
                      : (profile.cpf || 'CPF não informado')
                    const isUpdating = updatingId === profile.id

                    return (
                      <tr key={profile.id} className="text-xs hover:bg-white/[0.02] transition-all duration-200">
                        {/* Nome / Razão Social */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {isPJ ? (
                              <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            ) : (
                              <Users className="w-4 h-4 text-brand-neon shrink-0" />
                            )}
                            <span className="font-bold text-white uppercase tracking-wide">
                              {nomeExibicao}
                            </span>
                          </div>
                        </td>

                        {/* E-mail */}
                        <td className="py-4 px-4 font-mono text-gray-300 lowercase">
                          {profile.email}
                        </td>

                        {/* Telefone & Documento */}
                        <td className="py-4 px-4 font-mono">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-gray-200 font-bold">{documentoExibicao}</span>
                            <span className="text-[10px] text-gray-500 font-sans">
                              {profile.telefone || 'Sem telefone'}
                            </span>
                          </div>
                        </td>

                        {/* Tipo (PF/PJ) */}
                        <td className="py-4 px-4 font-mono">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                            isPJ 
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                          }`}>
                            [{profile.tipo_pessoa || 'PF'}]
                          </span>
                        </td>

                        {/* Status Badges */}
                        <td className="py-4 px-4 font-mono">
                          {profile.status === 'ativo' && (
                            <span className="inline-flex items-center gap-1 bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/30 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              <CheckCircle2 className="w-3 h-3" />
                              ATIVO
                            </span>
                          )}

                          {profile.status === 'pendente' && (
                            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              <Clock className="w-3 h-3 animate-spin" />
                              PENDENTE
                            </span>
                          )}

                          {profile.status === 'inativo' && (
                            <span className="inline-flex items-center gap-1 bg-zinc-800 text-gray-400 border border-zinc-700 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              <UserX className="w-3 h-3" />
                              INATIVO
                            </span>
                          )}

                          {profile.status === 'recusado' && (
                            <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              <XCircle className="w-3 h-3" />
                              RECUSADO
                            </span>
                          )}
                        </td>

                        {/* Ações (Editar, Inativar/Ativar, Aprovar/Recusar) */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Botão EDITAR */}
                            <button
                              onClick={() => handleOpenEditPage(profile)}
                              disabled={isUpdating}
                              className="px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-wider rounded uppercase bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1"
                              title="Editar dados cadastrais"
                            >
                              <Edit3 className="w-3 h-3" />
                              EDITAR
                            </button>

                            {/* Botões APROVAR e RECUSAR (Apenas para cadastros PENDENTES) */}
                            {profile.status === 'pendente' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(profile.id, 'ativo')}
                                  disabled={isUpdating}
                                  className="px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-wider rounded uppercase bg-brand-neon text-black hover:shadow-[0_0_12px_rgba(204,255,0,0.4)] transition-all cursor-pointer flex items-center gap-1"
                                >
                                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                  APROVAR
                                </button>

                                <button
                                  onClick={() => handleStatusChange(profile.id, 'recusado')}
                                  disabled={isUpdating}
                                  className="px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-wider rounded uppercase bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                  RECUSAR
                                </button>
                              </>
                            )}

                            {/* Botão INATIVAR / ATIVAR (Alternância de status para não-pendentes) */}
                            {profile.status !== 'pendente' && (
                              <button
                                onClick={() => handleStatusChange(profile.id, profile.status === 'ativo' ? 'inativo' : 'ativo')}
                                disabled={isUpdating}
                                className={`px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-wider rounded uppercase transition-all cursor-pointer flex items-center gap-1 ${
                                  profile.status === 'ativo'
                                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                              >
                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Power className="w-3 h-3" />}
                                {profile.status === 'ativo' ? 'INATIVAR' : 'ATIVAR'}
                              </button>
                            )}

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



      {/* Proposal Modal component */}
      <ProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
      />
    </div>
  )
}
