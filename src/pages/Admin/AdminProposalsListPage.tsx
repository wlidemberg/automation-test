import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Search, 
  ArrowLeft, 
  Loader2, 
  ArrowUpRight,
  Plus,
  CreditCard,
  Eye
} from 'lucide-react'
import { listPendingProposals, confirmarPagamentoProposta } from '../../services/proposalAdminServices'
import type { Proposal } from '../../types/database'
import StatusBadge from '../../components/StatusBadge'

export default function AdminProposalsListPage() {
  const navigate = useNavigate()

  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const handleConfirmarPagamento = async (proposalId: string) => {
    setConfirmingId(proposalId)
    try {
      const updated = await confirmarPagamentoProposta(proposalId)
      if (updated) {
        setProposals(prev => prev.map(p => p.id === proposalId ? updated : p))
      }
    } catch (err) {
      console.error(err)
      alert('Falha ao confirmar pagamento da proposta.')
    } finally {
      setConfirmingId(null)
    }
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Carrega todas as propostas para permitir calculos de metricas completos no header
        const data = await listPendingProposals('todos')
        setProposals(data)
      } catch (err) {
        console.error('Erro ao carregar propostas:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filtragem em memoria dinâmica
  const filteredProposals = proposals.filter((p) => {
    if (statusFilter !== 'todos') {
      if (statusFilter === 'pendentes' || statusFilter === 'pendente_aprovacao_admin') {
        if (p.status !== 'pendente_aprovacao_admin' && p.status !== 'em_analise_ia') return false
      } else if (statusFilter === 'enviadas' || statusFilter === 'enviada_lead') {
        if (p.status !== 'enviada_lead' && p.status !== 'aprovada_admin') return false
      } else if (statusFilter === 'aceitas' || statusFilter === 'aceita') {
        if (p.status !== 'aceita' && p.status !== 'aprovada_lead') return false
      } else if (statusFilter === 'recusadas' || statusFilter === 'recusada') {
        if (p.status !== 'recusada') return false
      } else if (p.status !== statusFilter) {
        return false
      }
    }

    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    const leadName = p.lead?.razao_social_nome?.toLowerCase() || ''
    const email = p.lead?.email?.toLowerCase() || ''
    const slug = p.lead?.produto_slug?.toLowerCase() || ''
    return leadName.includes(term) || email.includes(term) || slug.includes(term) || p.id.includes(term)
  })

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-brand-neon selection:text-black">
      
      {/* Topbar de Navegacao */}
      <div className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="p-2 rounded bg-brand-gray border border-white/10 text-gray-400 hover:text-white hover:border-brand-neon/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-semibold text-brand-neon block">
                ADMINISTRATION • ESTEIRA COMERCIAL
              </span>
              <h1 className="text-xl font-space font-extrabold text-white uppercase tracking-tight">
                Gestão de Propostas Técnico-Comerciais
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/solicitar-proposta"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-neon text-black font-space font-bold text-xs uppercase tracking-wider rounded hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all duration-300"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              NOVO BRIEFING
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Metric Cards Summary Header */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
          
          <div className="bg-zinc-900/40 border border-white/10 p-5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-gray-500 block">TOTAL REGISTRADAS</span>
            <p className="text-2xl font-space font-extrabold text-white">{proposals.length}</p>
            <span className="text-[10px] text-gray-400 block">Propostas no sistema</span>
          </div>

          <div className="bg-zinc-900/40 border border-amber-500/30 p-5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-amber-400 block">PENDENTES REVISÃO</span>
            <p className="text-2xl font-space font-extrabold text-amber-400">
              {proposals.filter(p => p.status === 'pendente_aprovacao_admin' || p.status === 'em_analise_ia').length}
            </p>
            <span className="text-[10px] text-gray-400 block">Requer atenção admin/IA</span>
          </div>

          <div className="bg-zinc-900/40 border border-cyan-500/30 p-5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-cyan-400 block">ENVIADAS AO LEAD</span>
            <p className="text-2xl font-space font-extrabold text-cyan-400">
              {proposals.filter(p => p.status === 'enviada_lead' || p.status === 'aprovada_admin').length}
            </p>
            <span className="text-[10px] text-gray-400 block">Aguardando aceite cliente</span>
          </div>

          <div className="bg-zinc-900/40 border border-brand-neon/30 p-5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-brand-neon block">ACEITAS / PAGAMENTO</span>
            <p className="text-2xl font-space font-extrabold text-brand-neon">
              {proposals.filter(p => p.status === 'aceita' || p.status === 'aprovada_lead').length}
            </p>
            <span className="text-[10px] text-gray-400 block">Contrato aceito</span>
          </div>

        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-zinc-900/40 border border-white/10 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 font-mono text-xs">
            {[
              { id: 'todos', label: 'TODAS' },
              { id: 'pendentes', label: 'PENDENTES ADMIN' },
              { id: 'enviadas', label: 'ENVIADAS AO CLIENTE' },
              { id: 'aceitas', label: 'ACEITAS / PAGAMENTO' },
              { id: 'recusadas', label: 'RECUSADAS' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded text-[11px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-brand-neon text-black font-extrabold shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                    : 'bg-black/40 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por lead, e-mail ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono"
            />
          </div>

        </div>

        {/* Proposals List Section */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4 font-mono">
            <Loader2 className="w-8 h-8 text-brand-neon animate-spin" />
            <p className="text-xs uppercase text-gray-500 tracking-widest">Carregando lista de propostas...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="bg-zinc-900/30 border border-white/10 rounded-2xl p-12 text-center space-y-4 backdrop-blur-sm">
            <FileText className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-lg font-space font-bold uppercase text-white">Nenhuma proposta encontrada</h3>
            <p className="font-sans text-xs text-gray-400 max-w-sm mx-auto">
              Não há solicitações cadastradas correspondentes ao filtro selecionado ou termo pesquisado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProposals.map((proposal) => {
              const lead = proposal.lead
              const propostaIa = proposal.proposta_ia || {}

              return (
                <motion.div
                  key={proposal.id}
                  whileHover={{ y: -4 }}
                  className="bg-zinc-900/40 border border-white/10 hover:border-brand-neon/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-md group"
                >
                  <div className="space-y-4">
                    
                    {/* Card Header */}
                    <div className="flex items-start justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-brand-neon font-bold tracking-widest block">
                          {lead?.categoria_produto || 'SOLUÇÃO TÉCNICA'}
                        </span>
                        <h3 className="text-base font-space font-bold uppercase text-white truncate max-w-[200px] group-hover:text-brand-neon transition-colors">
                          {lead?.razao_social_nome || 'Lead Sem Nome'}
                        </h3>
                      </div>

                      {/* Badge Status com Tooltip Interativo de Pendencia */}
                      <StatusBadge status={proposal.status} />
                    </div>

                    {/* Dores & Detalhes Principais */}
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-gray-400">
                        <span>E-mail:</span>
                        <span className="text-white truncate max-w-[170px]">{lead?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Produto:</span>
                        <span className="text-brand-neon font-semibold uppercase">{lead?.produto_slug || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Valor Setup:</span>
                        <span className="text-white font-bold">
                          R$ {Number(propostaIa.valor_setup || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Badge Re-criações */}
                    {proposal.contador_recriacoes > 0 && (
                      <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-mono text-amber-400 flex items-center justify-between">
                        <span>Ciclos de Revisão IA:</span>
                        <span className="font-bold">Contador: {proposal.contador_recriacoes}</span>
                      </div>
                    )}

                    {/* ALERTA DE PROPOSTA ACEITA AGUARDANDO ENTRADA */}
                    {(proposal.status_proposta === 'aceita' || proposal.status === 'aceita') && !proposal.pagamento_confirmado && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between font-mono text-[11px] text-yellow-400">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                          <span className="font-semibold uppercase">PROPOSTA ACEITA PELO CLIENTE — AGUARDANDO ENTRADA (50%)</span>
                        </div>
                      </div>
                    )}

                    {/* ALERTA DE CONTRATO ATIVO / PAGAMENTO CONFIRMADO */}
                    {proposal.pagamento_confirmado && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between font-mono text-xs text-emerald-400">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span className="font-bold">✅ ENTRADA PAGA (50%) — CONTRATO ATIVADO</span>
                        </div>
                        {proposal.pago_em && (
                          <span className="text-[10px] text-zinc-400">
                            {new Date(proposal.pago_em).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500">
                      {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString('pt-BR') : 'Recente'}
                    </span>

                    {(proposal.status_proposta === 'aceita' || proposal.status === 'aceita') && !proposal.pagamento_confirmado ? (
                      /* QUANDO ACEITA: BOTÃO SIMULAR PAGAMENTO SUBSTITUI REVISAR PROPOSTA */
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/propostas/${proposal.id}`)}
                          title="Ver detalhes da proposta"
                          className="p-2.5 bg-black/40 text-gray-400 hover:text-white border border-white/10 rounded transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleConfirmarPagamento(proposal.id)}
                          disabled={confirmingId === proposal.id}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-neon hover:bg-[#b8e600] text-black font-space font-extrabold text-xs uppercase tracking-wider rounded shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_20px_rgba(204,255,0,0.6)] transition-all duration-300 cursor-pointer font-mono"
                        >
                          <CreditCard className="w-3.5 h-3.5 stroke-[2.5]" />
                          {confirmingId === proposal.id ? 'CONFIRMANDO...' : 'SIMULAR PAGAMENTO'}
                        </button>
                      </div>
                    ) : proposal.pagamento_confirmado ? (
                      /* QUANDO PAGAMENTO CONFIRMADO: BOTÃO VER CONTRATO */
                      <button
                        onClick={() => navigate(`/admin/propostas/${proposal.id}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-space font-bold text-xs uppercase tracking-wider rounded hover:bg-emerald-500 hover:text-black transition-all duration-300 cursor-pointer"
                      >
                        VER CONTRATO
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    ) : (
                      /* DEMAIS STATUS: BOTÃO REVISAR PROPOSTA */
                      <button
                        onClick={() => navigate(`/admin/propostas/${proposal.id}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-neon text-black font-space font-bold text-xs uppercase tracking-wider rounded group-hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all duration-300 cursor-pointer"
                      >
                        REVISAR PROPOSTA
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    )}
                  </div>

                </motion.div>
              )
            })}
          </div>
        )}

      </main>

    </div>
  )
}
