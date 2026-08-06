import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Search, 
  ArrowLeft, 
  Loader2, 
  ArrowUpRight,
  Plus
} from 'lucide-react'
import { listPendingProposals } from '../../services/proposalAdminServices'
import type { Proposal } from '../../types/database'

export default function AdminProposalsListPage() {
  const navigate = useNavigate()

  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const data = await listPendingProposals(statusFilter)
        setProposals(data)
      } catch (err) {
        console.error('Erro ao carregar propostas:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [statusFilter])

  const filteredProposals = proposals.filter((p) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    const leadName = p.lead?.razao_social_nome?.toLowerCase() || ''
    const email = p.lead?.email?.toLowerCase() || ''
    const slug = p.lead?.produto_slug?.toLowerCase() || ''
    return leadName.includes(term) || email.includes(term) || slug.includes(term) || p.id.includes(term)
  })

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-brand-neon selection:text-black">
      
      {/* Navigation Topbar */}
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

          <div className="bg-zinc-900/40 border border-brand-neon/30 p-5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-brand-neon block">PENDENTES APROVAÇÃO</span>
            <p className="text-2xl font-space font-extrabold text-brand-neon">
              {proposals.filter(p => p.status === 'pendente_aprovacao_admin').length}
            </p>
            <span className="text-[10px] text-gray-400 block">Requer revisão humana</span>
          </div>

          <div className="bg-zinc-900/40 border border-amber-500/30 p-5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-amber-400 block">EM ANÁLISE IA</span>
            <p className="text-2xl font-space font-extrabold text-amber-400">
              {proposals.filter(p => p.status === 'em_analise_ia').length}
            </p>
            <span className="text-[10px] text-gray-400 block">Em ciclo de re-criação</span>
          </div>

          <div className="bg-zinc-900/40 border border-emerald-500/30 p-5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase text-emerald-400 block">ENVIADAS AO LEAD</span>
            <p className="text-2xl font-space font-extrabold text-emerald-400">
              {proposals.filter(p => p.status === 'enviada_lead').length}
            </p>
            <span className="text-[10px] text-gray-400 block">Disparadas por e-mail</span>
          </div>

        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-zinc-900/40 border border-white/10 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 font-mono text-xs">
            {[
              { id: 'todos', label: 'TODAS' },
              { id: 'pendente_aprovacao_admin', label: 'PENDENTES' },
              { id: 'em_analise_ia', label: 'EM ANÁLISE IA' },
              { id: 'enviada_lead', label: 'ENVIADAS' }
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
              Não há solicitações cadastradas correspondentes ao filtro ou termo pesquisado.
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

                      {/* Badge Status */}
                      <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase border shrink-0 ${
                        proposal.status === 'enviada_lead'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : proposal.status === 'em_analise_ia'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-brand-neon/10 border-brand-neon/30 text-brand-neon'
                      }`}>
                        {proposal.status === 'enviada_lead' ? 'ENVIADA' : proposal.status === 'em_analise_ia' ? 'REVISÃO IA' : 'PENDENTE'}
                      </span>
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
                        <span>Valor Setup IA:</span>
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

                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500">
                      {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString('pt-BR') : 'Recente'}
                    </span>

                    <button
                      onClick={() => navigate(`/admin/propostas/${proposal.id}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-neon text-black font-space font-bold text-xs uppercase tracking-wider rounded group-hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all duration-300 cursor-pointer"
                    >
                      REVISAR PROPOSTA
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
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
