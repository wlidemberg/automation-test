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
  Eye,
  CheckCircle2,
  X,
  Zap
} from 'lucide-react'
import { listPendingProposals, confirmarPagamentoProposta, processarConfirmacaoPagamentoEPromocao } from '../../services/proposalAdminServices'
import { promoverLeadParaCliente, processAllAcceptedProposals, type BatchProvisionResult } from '../../services/clientServices'
import type { Proposal } from '../../types/database'
import StatusBadge from '../../components/StatusBadge'

export default function AdminProposalsListPage() {
  const navigate = useNavigate()

  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false)
  const [batchModalResult, setBatchModalResult] = useState<BatchProvisionResult | null>(null)
  const [promotionModalData, setPromotionModalData] = useState<{
    show: boolean
    clientName: string
    clientEmail: string
    linkDefinirSenha: string
  } | null>(null)

  const handleProcessBatch = async () => {
    setIsProcessingBatch(true)
    try {
      const result = await processAllAcceptedProposals()
      setBatchModalResult(result)
      const freshData = await listPendingProposals('todos')
      setProposals(freshData)
    } catch (err: any) {
      console.error(err)
      alert('Falha ao processar lote de propostas: ' + (err.message || ''))
    } finally {
      setIsProcessingBatch(false)
    }
  }

  const handleConfirmarPagamento = async (proposalId: string, leadId?: string | null) => {
    setConfirmingId(proposalId)
    try {
      const targetLeadId = leadId || proposals.find(p => p.id === proposalId)?.lead_id || proposalId
      await processarConfirmacaoPagamentoEPromocao(proposalId, targetLeadId)

      // Atualiza o estado local reativamente sem recarregar a página
      setProposals(prev => prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            pagamento_confirmado: true,
            pago_em: new Date().toISOString(),
            status: 'pago'
          }
        }
        return p
      }))
    } catch (err: any) {
      console.error(err)
      alert('Falha ao confirmar pagamento e promover perfil: ' + (err.message || ''))
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
            <button
              onClick={handleProcessBatch}
              disabled={isProcessingBatch}
              title="Processa em lote todas as propostas aceitas, preenche a tabela public.profiles e envia os e-mails de acesso"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 font-space font-bold text-xs uppercase tracking-wider rounded hover:bg-amber-500 hover:text-black transition-all duration-300 cursor-pointer font-mono disabled:opacity-50"
            >
              {isProcessingBatch ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  PROCESSANDO LOTE...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 stroke-[2.5]" />
                  PROCESSAR CLIENTES ACEITOS
                </>
              )}
            </button>

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
                    <div className="border-b border-white/10 pb-4 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-brand-neon font-bold tracking-widest block">
                        {lead?.categoria_produto || 'SOLUÇÃO TÉCNICA'}
                      </span>
                      <h3 className="text-base font-space font-bold uppercase text-white group-hover:text-brand-neon transition-colors leading-tight">
                        {lead?.razao_social_nome || 'Lead Sem Nome'}
                      </h3>
                      {/* Badge Status posicionado ABAIXO do nome do cliente */}
                      <div className="pt-1">
                        <StatusBadge status={proposal.pagamento_confirmado ? 'contrato_ativo' : proposal.status} />
                      </div>
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

                    {/* DETALHE DO PAGAMENTO QUANDO CONTRATO ESTIVER ATIVO */}
                    {proposal.pagamento_confirmado && proposal.pago_em && (
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                        <span>Entrada Paga em:</span>
                        <span className="font-bold">
                          {new Date(proposal.pago_em).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
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
                          onClick={() => handleConfirmarPagamento(proposal.id, proposal.lead_id)}
                          disabled={confirmingId === proposal.id}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-neon hover:bg-[#b8e600] text-black font-space font-extrabold text-xs uppercase tracking-wider rounded shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_20px_rgba(204,255,0,0.6)] transition-all duration-300 cursor-pointer font-mono"
                        >
                          {confirmingId === proposal.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              CONFIRMANDO...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3.5 h-3.5 stroke-[2.5]" />
                              [SIMULAR: PAGAMENTO CONFIRMADO 💳]
                            </>
                          )}
                        </button>
                      </div>
                    ) : proposal.pagamento_confirmado ? (
                      /* QUANDO PAGAMENTO CONFIRMADO: BADGE VERDE ✅ ENTRADA PAGA (50%) — CONTRATO ATIVADO */
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-space font-bold text-xs uppercase tracking-wider rounded">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ✅ ENTRADA PAGA (50%) — CONTRATO ATIVADO
                      </div>
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

      {/* Modal de Sucesso Tech-Luxo ao Confirmar Pagamento e Promover Lead */}
      {promotionModalData?.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#09090b] border border-brand-neon/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-[0_0_50px_rgba(204,255,0,0.15)] relative">
            <button
              onClick={() => setPromotionModalData(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-neon/10 border border-brand-neon/30 flex items-center justify-center text-brand-neon shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-brand-neon uppercase font-bold tracking-widest block">
                  ESTEIRA CONCLUÍDA COM SUCESSO
                </span>
                <h3 className="font-space font-extrabold text-white text-lg uppercase">
                  PAGAMENTO REGISTRADO & CLIENTE ATIVADO
                </h3>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs text-gray-300">
              <div className="p-3.5 bg-zinc-900/80 border border-white/10 rounded-xl space-y-1">
                <span className="text-gray-500 block text-[10px]">CLIENTE PROMOVIDO NO SISTEMA:</span>
                <span className="font-bold text-white text-sm block">{promotionModalData.clientName}</span>
                <span className="text-brand-neon block">{promotionModalData.clientEmail}</span>
              </div>

              <div className="p-3.5 bg-brand-neon/5 border border-brand-neon/20 rounded-xl space-y-1 text-emerald-400">
                <span className="font-bold block">✓ Pagamento de Entrada de 50% Confirmado</span>
                <span className="font-bold block">✓ Contrato alterado para o status 'ATIVO'</span>
                <span className="font-bold block">✓ Perfil de Cliente gerado na tabela public.profiles</span>
              </div>

              <div className="pt-2 space-y-1">
                <span className="text-[10px] text-gray-400 block">LINK DE DEFINIÇÃO DE SENHA GERADO:</span>
                <div className="p-3 bg-black/80 border border-white/10 rounded-lg text-[11px] font-mono text-brand-neon truncate selection:bg-brand-neon selection:text-black">
                  {promotionModalData.linkDefinirSenha}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPromotionModalData(null)}
                className="px-6 py-3 bg-brand-neon text-black font-space font-extrabold text-xs uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all cursor-pointer font-mono"
              >
                CONCLUIR E FECHAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Relatório de Processamento em Lote */}
      {batchModalResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#09090b] border border-amber-500/40 rounded-2xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setBatchModalResult(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer font-mono"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest block">
                  PROCESSAMENTO EM LOTE CONCLUÍDO
                </span>
                <h3 className="font-space font-extrabold text-white text-lg uppercase">
                  PROVISIONAMENTO DE CLIENTES ACEITOS
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="p-3 bg-zinc-900 border border-white/10 rounded-lg">
                <span className="text-[10px] text-gray-400 block">TOTAL ENCONTRADO</span>
                <span className="font-bold text-white text-lg">{batchModalResult.totalProcessed}</span>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                <span className="text-[10px] block">SUCESSO</span>
                <span className="font-bold text-lg">{batchModalResult.successCount}</span>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <span className="text-[10px] block">FALHAS</span>
                <span className="font-bold text-lg">{batchModalResult.failedCount}</span>
              </div>
            </div>

            {batchModalResult.details.length > 0 ? (
              <div className="space-y-2 font-mono text-xs max-h-60 overflow-y-auto pr-1">
                <span className="text-[10px] text-gray-400 block uppercase">DETALHES DA EXECUÇÃO:</span>
                {batchModalResult.details.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-[11px] ${
                      item.status === 'success' 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                        : 'bg-red-500/5 border-red-500/20 text-red-300'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-bold block text-white truncate">{item.leadEmail}</span>
                      <span className="text-[10px] opacity-80">{item.message}</span>
                    </div>
                    <span className="font-bold text-[10px] uppercase shrink-0">
                      {item.status === 'success' ? '✓ OK' : '✕ ERRO'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-zinc-900 border border-white/10 rounded-lg text-center font-mono text-xs text-gray-400">
                Nenhuma proposta aceita pendente de processamento foi encontrada.
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setBatchModalResult(null)}
                className="px-6 py-3 bg-brand-neon text-black font-space font-extrabold text-xs uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all cursor-pointer font-mono"
              >
                ENTENDIDO E CONCLUIR
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
