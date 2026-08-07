import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Sparkles, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  Loader2, 
  Bot, 
  UserCheck, 
  Zap, 
  Code2, 
  Layers, 
  AlertCircle,
  ExternalLink,
  CreditCard
} from 'lucide-react'
import { getProposalWithLead, requestAiRevision, approveAndSendProposal, confirmarPagamentoProposta, processarConfirmacaoPagamentoEPromocao } from '../../services/proposalAdminServices'
import { promoverLeadParaCliente } from '../../services/clientServices'
import type { Proposal } from '../../types/database'
import StatusBadge from '../../components/StatusBadge'

export default function AdminProposalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Form states
  const [orientacaoAdmin, setOrientacaoAdmin] = useState<string>('')
  const [isSubmittingRevision, setIsSubmittingRevision] = useState<boolean>(false)
  const [isSubmittingApproval, setIsSubmittingApproval] = useState<boolean>(false)
  const [promotionModalData, setPromotionModalData] = useState<{
    show: boolean
    clientName: string
    clientEmail: string
    linkDefinirSenha: string
  } | null>(null)

  const [isConfirmingPayment, setIsConfirmingPayment] = useState<boolean>(false)

  const handleConfirmarPagamento = async () => {
    if (!proposal) return
    setIsConfirmingPayment(true)
    setFeedbackMessage(null)
    try {
      const targetLeadId = proposal.lead_id || proposal.lead?.id || proposal.id
      await processarConfirmacaoPagamentoEPromocao(proposal.id, targetLeadId)

      setProposal(prev => prev ? {
        ...prev,
        pagamento_confirmado: true,
        pago_em: new Date().toISOString()
      } : null)

      setFeedbackMessage({ type: 'success', text: 'Pagamento de entrada (50%) registrado, contrato ativado e perfil de cliente criado com sucesso!' })
    } catch (err: any) {
      console.error(err)
      setFeedbackMessage({ type: 'error', text: err.message || 'Falha ao confirmar pagamento da proposta.' })
    } finally {
      setIsConfirmingPayment(false)
    }
  }

  useEffect(() => {
    async function loadData() {
      if (!id) return
      setLoading(true)
      try {
        const data = await getProposalWithLead(id)
        setProposal(data)
        if (data?.orientacoes_admin) {
          setOrientacaoAdmin(data.orientacoes_admin)
        }
      } catch (err) {
        console.error('Erro ao carregar proposta:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !orientacaoAdmin.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Insira uma instrução técnica para a IA refazer a proposta.' })
      return
    }

    setIsSubmittingRevision(true)
    setFeedbackMessage(null)

    try {
      await requestAiRevision(id, orientacaoAdmin)
      setFeedbackMessage({ type: 'success', text: 'Solicitação enviada! A IA está reprocessando a proposta comercial.' })
      
      // Recarrega os dados atualizados
      const updated = await getProposalWithLead(id)
      setProposal(updated)
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Falha ao solicitar revisão para a IA.' })
    } finally {
      setIsSubmittingRevision(false)
    }
  }

  const handleApproveAndSend = async () => {
    if (!id) return
    setIsSubmittingApproval(true)
    setFeedbackMessage(null)

    try {
      const res = await approveAndSendProposal(id)
      setFeedbackMessage({ 
        type: 'success', 
        text: `Proposta aprovada com sucesso! E-mail com o Magic Link de acesso enviado ao lead (${res.magicLink}).` 
      })

      // Recarrega dados atualizados
      const updated = await getProposalWithLead(id)
      setProposal(updated)
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Falha ao aprovar e enviar proposta.' })
    } finally {
      setIsSubmittingApproval(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center space-y-4 font-mono">
        <Loader2 className="w-10 h-10 text-brand-neon animate-spin" />
        <p className="text-xs uppercase tracking-widest text-gray-400">Carregando detalhes da proposta comercial...</p>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="text-2xl font-space font-bold uppercase">Proposta Não Encontrada</h1>
        <p className="text-sm font-sans text-gray-400 max-w-md">
          A proposta com ID especificado não foi localizada no Supabase.
        </p>
        <Link
          to="/admin/propostas"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-neon text-black font-space font-bold text-xs uppercase tracking-wider rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          VOLTAR À LISTA DE PROPOSTAS
        </Link>
      </div>
    )
  }

  const lead = proposal.lead
  const propostaIa = proposal.proposta_ia || {}

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-brand-neon selection:text-black pb-24">
      
      {/* Top Header Bar */}
      <div className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/propostas')}
              className="p-2 rounded bg-brand-gray border border-white/10 text-gray-400 hover:text-white hover:border-brand-neon/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-semibold text-brand-neon block">
                ADMINISTRATION • REVISÃO DE PROPOSTA IA
              </span>
              <h1 className="text-xl font-space font-bold text-white uppercase tracking-tight flex items-center gap-3">
                {lead?.razao_social_nome || 'SOLICITAÇÃO DE PROPOSTA'}
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-brand-neon/10 border border-brand-neon/30 text-brand-neon uppercase font-normal">
                  ID: {proposal.id.slice(0, 8)}...
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-gray-400">Status:</span>
            <StatusBadge status={proposal.status} />
            {proposal.contador_recriacoes > 0 && (
              <span className="px-2.5 py-1 rounded bg-zinc-800 border border-white/10 text-gray-300 font-bold">
                RE-CRIAÇÕES: {proposal.contador_recriacoes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* CONDICIONAL 1: ACEITA AGUARDANDO PAGAMENTO */}
        {(proposal.status_proposta === 'aceita' || proposal.status === 'aceita') && !proposal.pagamento_confirmado && (
          <div className="p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse shrink-0"></span>
              <span className="text-xs text-yellow-400 font-mono font-semibold">
                PROPOSTA ACEITA PELO CLIENTE — AGUARDANDO ENTRADA (50%)
              </span>
            </div>
            <button
              onClick={handleConfirmarPagamento}
              disabled={isConfirmingPayment}
              className="w-full sm:w-auto px-5 py-2.5 bg-brand-neon hover:bg-[#b8e600] text-black font-space font-extrabold text-xs uppercase tracking-wider rounded shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_20px_rgba(204,255,0,0.6)] transition-all duration-300 flex items-center justify-center gap-2 font-mono cursor-pointer"
            >
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
              {isConfirmingPayment ? 'CONFIRMANDO...' : '[SIMULAR: PAGAMENTO CONFIRMADO 💳]'}
            </button>
          </div>
        )}

        {/* CONDICIONAL 2: PAGAMENTO CONFIRMADO & CONTRATO ATIVO */}
        {proposal.pagamento_confirmado && (
          <div className="p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-xl flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0"></span>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                ✅ ENTRADA PAGA (50%) — CONTRATO ATIVADO
              </span>
            </div>
            {proposal.pago_em && (
              <span className="text-xs text-zinc-400 font-mono">
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

        {/* Feedback Alert Banner */}
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between ${
              feedbackMessage.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            {proposal.magic_link && feedbackMessage.type === 'success' && (
              <a
                href={proposal.magic_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-black font-bold uppercase rounded hover:bg-emerald-400 transition-colors"
              >
                VISUALIZAR PROPOSTA
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </motion.div>
        )}

        {/* PAINEL DUPLO: GRID DE 2 COLUNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUNA 1: BRIEFING DO LEAD (Esquerda) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-6">
              
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-9 h-9 rounded-lg bg-brand-neon/10 border border-brand-neon/30 flex items-center justify-center text-brand-neon">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-neon font-bold block">
                    ETAPA DE DIAGNÓSTICO
                  </span>
                  <h2 className="text-lg font-space font-bold uppercase text-white">
                    Briefing do Lead
                  </h2>
                </div>
              </div>

              {/* Informações Cadastrais Principais */}
              <div className="space-y-4 text-xs font-mono">
                
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 uppercase">Razão Social / Nome:</span>
                    <span className="text-white font-bold">{lead?.razao_social_nome || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-gray-500 uppercase">E-mail Corporativo:</span>
                    <span className="text-brand-neon font-semibold">{lead?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-gray-500 uppercase">WhatsApp / Fone:</span>
                    <span className="text-white">{lead?.telefone || 'N/A'}</span>
                  </div>
                  {lead?.cpf_cnpj && (
                    <div className="flex items-center justify-between border-t border-white/5 pt-2">
                      <span className="text-gray-500 uppercase">CPF / CNPJ:</span>
                      <span className="text-gray-300">{lead.cpf_cnpj}</span>
                    </div>
                  )}
                </div>

                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 uppercase">Solução / Slug:</span>
                    <span className="text-brand-neon uppercase font-bold">{lead?.produto_slug || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-gray-500 uppercase">Categoria:</span>
                    <span className="text-white font-semibold uppercase">{lead?.categoria_produto || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-gray-500 uppercase">Faturamento Mensal:</span>
                    <span className="text-gray-300">{lead?.faturamento_mensal || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-gray-500 uppercase">Porte da Empresa:</span>
                    <span className="text-gray-300">{lead?.porte_empresa || 'Não informado'}</span>
                  </div>
                </div>

                {/* Dores Principais / Gargalos */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                    Dores Principais & Objetivos:
                  </label>
                  <div className="p-4 bg-brand-gray/80 border border-white/10 rounded-xl text-gray-300 font-sans leading-relaxed text-xs font-light">
                    "{lead?.dores_principais || 'Sem descrição cadastrada'}"
                  </div>
                </div>

                {/* Especificações da Categoria Formatadas em UI Tech-Luxo */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] uppercase font-bold text-brand-neon block tracking-wider flex items-center justify-between">
                    <span>ESPECIFICAÇÕES DA CATEGORIA:</span>
                    <Layers className="w-3.5 h-3.5 text-brand-neon" />
                  </label>
                  
                  {(!lead?.dados_especificos_categoria || Object.keys(lead.dados_especificos_categoria).length === 0) ? (
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-gray-500 font-mono text-[11px]">
                      Nenhuma especificação técnica adicional registrada.
                    </div>
                  ) : (
                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3 font-mono text-xs">
                      {Object.entries(lead.dados_especificos_categoria).map(([key, val], idx) => {
                        // Mapeia chaves para rótulos amigáveis em Português
                        const keyLabels: Record<string, string> = {
                          objetivo_ia: 'Objetivo da IA',
                          objetivoIA: 'Objetivo da IA',
                          canais_atendimento: 'Canais de Atendimento',
                          canalIA: 'Canais de Atendimento',
                          possui_base_conhecimento: 'Possui Base de Conhecimento',
                          tipoWeb: 'Tipo de Projeto Web',
                          temMarca: 'Marca & Logo',
                          prazoDesejado: 'Prazo de Lançamento',
                          integracaoFinanceira: 'Integração Financeira',
                          volumeEstimado: 'Volume Estimado',
                          modulos: 'Módulos Selecionados',
                          ferramentasConectar: 'Ferramentas a Conectar'
                        }

                        const label = keyLabels[key] || key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/_/g, ' ')
                          .trim()
                          .replace(/\b\w/g, l => l.toUpperCase())

                        let renderedValue: React.ReactNode = null

                        if (typeof val === 'boolean') {
                          renderedValue = (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                              {val ? 'SIM' : 'NÃO'}
                            </span>
                          )
                        } else if (Array.isArray(val)) {
                          renderedValue = (
                            <div className="flex flex-wrap gap-1.5 justify-end">
                              {val.map((item, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-brand-neon/10 border border-brand-neon/30 text-brand-neon text-[10px] font-bold">
                                  {String(item)}
                                </span>
                              ))}
                            </div>
                          )
                        } else {
                          renderedValue = <span className="text-gray-200 font-semibold text-right">{String(val)}</span>
                        }

                        return (
                          <div key={key} className={`flex items-center justify-between gap-4 ${idx > 0 ? 'border-t border-white/5 pt-2.5' : ''}`}>
                            <span className="text-gray-400 uppercase text-[10px] shrink-0 font-medium">{label}:</span>
                            {renderedValue}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* COLUNA 2: PROPOSTA GERADA PELA IA (Direita) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-900/40 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-neon text-black font-bold flex items-center justify-center shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-neon font-bold block">
                      AUTOMAÇÃO & PRECIFICAÇÃO
                    </span>
                    <h2 className="text-lg font-space font-bold uppercase text-white">
                      Proposta Gerada pela IA
                    </h2>
                  </div>
                </div>

                <span className="text-xs font-mono text-gray-400 bg-black/40 px-3 py-1 rounded border border-white/10">
                  Estrutura Dinâmica
                </span>
              </div>

              {/* Resumo Executivo */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block tracking-wider">
                  RESUMO EXECUTIVO DO PROJETO
                </span>
                <p className="font-sans text-gray-200 text-sm font-light leading-relaxed bg-black/40 border border-white/5 p-4 rounded-xl">
                  {propostaIa.resumo_executivo || 'Aguardando geração do resumo executivo pela inteligência artificial.'}
                </p>
              </div>

              {/* Valores / Destaque Financeiro */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                
                <div className="bg-black/60 border border-brand-neon/30 p-4 rounded-xl space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">VALOR DE SETUP</span>
                  <p className="text-xl font-space font-extrabold text-brand-neon">
                    R$ {Number(propostaIa.valor_setup || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[9px] text-gray-500 block">Investimento Inicial</span>
                </div>

                <div className="bg-black/60 border border-white/10 p-4 rounded-xl space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">PARCELA ENTRADA (50%)</span>
                  <p className="text-xl font-space font-bold text-white">
                    R$ {Number(propostaIa.parcela_entrada || (propostaIa.valor_setup ? propostaIa.valor_setup / 2 : 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[9px] text-emerald-400 block">Sinal de Início</span>
                </div>

                <div className="bg-black/60 border border-white/10 p-4 rounded-xl space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block">MENSALIDADE RECORRENTE</span>
                  <p className="text-xl font-space font-bold text-white">
                    R$ {Number(propostaIa.valor_mensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    <span className="text-xs font-normal text-gray-400">/mês</span>
                  </p>
                  <span className="text-[9px] text-gray-500 block">SLA & Manutenção</span>
                </div>

              </div>

              {/* Entregáveis Garantidos */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-brand-neon font-bold block tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  ENTREGÁVEIS TÉCNICOS GARANTIDOS
                </span>
                <div className="space-y-2">
                  {(propostaIa.entregaveis || ['Painel Web Responsivo', 'Automação de Dados', 'Suporte Técnico']).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-brand-neon shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Módulos de Upsell */}
              {propostaIa.modulos_upsell && propostaIa.modulos_upsell.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-bold block tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-brand-neon" />
                    MÓDULOS DE UPSELL SUGERIDOS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {propostaIa.modulos_upsell.map((mod: any, idx: number) => (
                      <div key={idx} className="bg-black/40 border border-white/10 p-3.5 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-space font-bold text-white">{mod.titulo}</h4>
                          {mod.preco && (
                            <span className="text-[10px] font-mono text-brand-neon font-bold">+R$ {mod.preco}</span>
                          )}
                        </div>
                        <p className="text-[11px] font-sans text-gray-400 font-light">{mod.descricao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dicas de Engenharia */}
              {propostaIa.dicas_engenharia && propostaIa.dicas_engenharia.length > 0 && (
                <div className="p-4 bg-brand-neon/5 border border-brand-neon/20 rounded-xl space-y-2 font-mono text-xs">
                  <span className="text-[10px] uppercase text-brand-neon font-bold block tracking-widest flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    NOTAS DE ARQUITETURA & RECOMENDAÇÕES DA ENGENHARIA
                  </span>
                  <ul className="space-y-1.5 text-gray-300 text-[11px]">
                    {propostaIa.dicas_engenharia.map((dica: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-brand-neon">•</span>
                        <span>{dica}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* BARRA FLUTUANTE DE AÇÕES COMERCIAIS (Glassmorphism Sticky Bar) */}
        <section className="bg-zinc-900/90 border border-white/15 p-6 sm:p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-brand-neon block">
                PAINEL DE DECISÃO COMERCIAL DO ADMINISTRADOR
              </span>
              <h3 className="text-xl font-space font-bold uppercase text-white">
                Ações & Ajustes da Proposta
              </h3>
            </div>
            
            {proposal.orientacao_admin && (
              <span className="text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Orientação Anterior Registrada
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* ÁREA 1: REFAZER COM IA */}
            <form onSubmit={handleRequestRevision} className="lg:col-span-7 space-y-3">
              <label className="text-xs font-mono uppercase text-gray-300 font-bold block flex items-center justify-between">
                <span>INSTRUÇÕES DE REAJUSTE PARA A IA</span>
                <Sparkles className="w-3.5 h-3.5 text-brand-neon" />
              </label>
              
              <textarea
                rows={3}
                placeholder="Insira instruções para a IA reajustar esta proposta (Ex: Aumentar o escopo de entregáveis de automação, adicionar desconto de 10% no setup, incluir módulo de suporte 24/7)..."
                value={orientacaoAdmin}
                onChange={(e) => setOrientacaoAdmin(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-mono text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors resize-none"
              />

              <button
                type="submit"
                disabled={isSubmittingRevision || !orientacaoAdmin.trim()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-transparent border-2 border-brand-neon text-brand-neon font-space font-bold text-xs uppercase tracking-wider rounded hover:bg-brand-neon/10 transition-all duration-300 disabled:opacity-40 cursor-pointer"
              >
                {isSubmittingRevision ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ENVIANDO ORIENTAÇÃO À IA...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    REFAZER PROPOSTA COM IA
                  </>
                )}
              </button>
            </form>

            {/* ÁREA 2: AÇÃO PRINCIPAL - APROVAR E ENVIAR POR E-MAIL */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-end">
              <div className="p-4 bg-brand-neon/5 border border-brand-neon/20 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase text-brand-neon font-bold block">
                  APROVAÇÃO FINAL & ENVIO DA PROPOSTA
                </span>
                <p className="font-sans text-xs text-gray-400 font-light leading-relaxed">
                  Ao aprovar, o status mudará para <span className="text-white font-mono">ENVIADA_LEAD</span> e o n8n enviará o e-mail comercial com o Magic Link.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(204, 255, 0, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApproveAndSend}
                disabled={isSubmittingApproval || proposal.status === 'enviada_lead'}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-brand-neon text-black font-space font-extrabold text-xs tracking-[0.15em] uppercase rounded shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingApproval ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    PROCESSANDO DISPARO...
                  </>
                ) : proposal.status === 'enviada_lead' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    PROPOSTA JÁ ENVIADA AO LEAD
                  </>
                ) : (
                  <>
                    APROVAR E ENVIAR E-MAIL AO LEAD
                    <Send className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </motion.button>
            </div>

          </div>

        </section>

      </main>

      {/* Modal de Sucesso Tech-Luxo ao Confirmar Pagamento e Promover Lead */}
      {promotionModalData?.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#09090b] border border-brand-neon/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-[0_0_50px_rgba(204,255,0,0.15)] relative">
            <button
              onClick={() => setPromotionModalData(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer font-mono"
            >
              ✕
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

    </div>
  )
}
