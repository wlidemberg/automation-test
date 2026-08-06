import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2, DollarSign, ArrowRight, Zap, Info, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { fetchBriefingById, updateBriefing } from '../services/briefingServices'
import { getProposalByToken, acceptProposalAndCreateContract } from '../services/contractServices'
import type { Proposal, Briefing } from '../types/database'
import Layout from '../components/Layout'

const MOCK_AI_PROPOSAL = {
  resumo_escopo: 'Desenvolvimento de ecossistema tecnológico completo com alta velocidade de carregamento, design corporativo responsivo de altíssima fidelidade estética e integração automatizada de fluxos operacionais.',
  entregaveis: [
    'Design de Interface UI/UX personalizado (Figma)',
    'Desenvolvimento Frontend otimizado (React / Tailwind)',
    'Banco de dados relacional Supabase com RLS configurado',
    'Conectores e fluxos de automações de vendas no n8n',
    'Agente de Inteligência Artificial nativo para atendimento de leads'
  ],
  preco_projeto: 15800,
  valor_entrada: 7900,
  upsells: [
    { id: 'up-1', nome: 'Monitoramento & Infraestrutura Isolada VPS', preco: 1800 },
    { id: 'up-2', nome: 'Mapeamento Avançado de Funil de Vendas (SEO/Analytics)', preco: 1200 },
    { id: 'up-3', nome: 'Suporte VIP Emergencial com SLA de 4 horas', preco: 2500 }
  ]
}

export default function ProposalViewPage() {
  const { briefingId: paramId } = useParams<{ briefingId: string }>()
  const navigate = useNavigate()

  // UI States
  const [loading, setLoading] = useState(true)
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [briefing, setBriefing] = useState<Briefing | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPaying, setIsPaying] = useState(false)
  const [paySuccess, setPaySuccess] = useState(false)

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false)

  // Selected upsells
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([])

  async function loadProposalData() {
    if (!paramId) return
    setLoading(true)
    setErrorMessage(null)

    try {
      // 1. Tenta buscar proposta por token de acesso ou ID na tabela `proposals`
      const propData = await getProposalByToken(paramId)
      if (propData) {
        setProposal(propData)
        setLoading(false)
        return
      }

      // 2. Fallback: busca registro diretamente na tabela `briefings`
      const briefingData = await fetchBriefingById(paramId)
      if (briefingData) {
        setBriefing(briefingData)
      } else {
        setErrorMessage('PROPOSTA NÃO ENCONTRADA.')
      }
    } catch (err) {
      console.error('Erro ao carregar proposta:', err)
      setErrorMessage('ERRO AO CARREGAR DETALHES DA PROPOSTA.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProposalData()
  }, [paramId])

  // Normalização de dados
  const nomeCliente = proposal?.lead?.razao_social_nome || briefing?.nome_projeto || 'Solicitação Comercial'
  const resumoEscopo = proposal?.proposta_ia?.resumo_executivo 
    || briefing?.proposta_ia?.resumo_escopo 
    || briefing?.proposta_ia?.resumo_executivo 
    || 'Escopo técnico personalizado desenvolvido para alta performance.'

  const basePrice = Number(
    proposal?.proposta_ia?.valor_setup 
    || briefing?.proposta_ia?.preco_projeto 
    || briefing?.proposta_ia?.valor_setup 
    || 4500
  )
  const valorMensalRecorrente = Number(proposal?.proposta_ia?.valor_mensal || briefing?.proposta_ia?.valor_mensal || 0)

  const rawEntregaveis = proposal?.proposta_ia?.entregaveis || briefing?.proposta_ia?.entregaveis || []
  const entregaveisList: string[] = Array.isArray(rawEntregaveis) ? rawEntregaveis : []

  const rawUpsells = proposal?.proposta_ia?.modulos_upsell || briefing?.proposta_ia?.upsells || briefing?.proposta_ia?.modulos_upsell || []
  const upsellsList: Array<{ id: string; nome: string; preco: number }> = Array.isArray(rawUpsells)
    ? rawUpsells.map((u: any, idx: number) => ({
        id: u.id || `up-${idx}`,
        nome: u.titulo || u.nome || 'Módulo Adicional',
        preco: Number(u.preco || u.valor_adicional || 0)
      }))
    : []

  // Simula retorno de IA para briefings locais
  const handleSimulateAIPortalg = async () => {
    if (!paramId || !briefing) return
    setIsSimulating(true)
    try {
      const updated = await updateBriefing(paramId, {
        status_briefing: 'proposta_enviada',
        proposta_ia: MOCK_AI_PROPOSAL
      })
      if (updated) {
        setBriefing(updated)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleToggleUpsell = (id: string) => {
    if (selectedUpsells.includes(id)) {
      setSelectedUpsells(selectedUpsells.filter(uid => uid !== id))
    } else {
      setSelectedUpsells([...selectedUpsells, id])
    }
  }

  // Cálculos financeiros
  const upsellsTotal = upsellsList
    .filter((u) => selectedUpsells.includes(u.id))
    .reduce((acc: number, cur) => acc + cur.preco, 0)
  
  const totalPrice = basePrice + upsellsTotal
  const downPayment = totalPrice * 0.5

  const handlePayEntry = async () => {
    if (!paramId) return
    if (isPaying) return
    setIsPaying(true)

    try {
      if (proposal) {
        // Fluxo Oficial: Aceite do contrato e gravação em `public.contracts` e `public.proposals`
        const selectedUpsellsPayload = upsellsList
          .filter(u => selectedUpsells.includes(u.id))
          .map(u => ({ nome_modulo: u.nome, valor_adicional: u.preco }))

        await acceptProposalAndCreateContract({
          proposalId: proposal.id,
          leadId: proposal.lead_id || (proposal.lead ? proposal.lead.id : proposal.id),
          valorSetupBase: basePrice,
          modulosUpsellSelecionados: selectedUpsellsPayload,
          valorTotalContrato: totalPrice,
          valorEntrada50: downPayment,
          mensalidadeRecorrente: Number(proposal.proposta_ia?.valor_mensal || 590)
        })
      } else if (briefing) {
        // Fallback antigo para briefings
        let projectId = briefing.project_id
        if (!projectId) {
          const newProjId = crypto.randomUUID()
          const { data: newProj } = await supabase
            .from('projects')
            .insert({
              id: newProjId,
              client_id: briefing.client_id,
              nome: briefing.nome_projeto,
              fase_atual: 'aguardando_pagamento',
              progresso: 10
            })
            .select()
            .single()
          
          if (newProj) {
            projectId = newProj.id
            await updateBriefing(paramId, { project_id: newProj.id })
          }
        } else {
          await supabase
            .from('projects')
            .update({ fase_atual: 'aguardando_pagamento' })
            .eq('id', projectId)
        }

        if (projectId) {
          const invoiceId = crypto.randomUUID()
          const dataVencimento = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          
          await supabase
            .from('invoices')
            .insert({
              id: invoiceId,
              project_id: projectId,
              client_id: briefing.client_id,
              valor: downPayment,
              vencimento: dataVencimento,
              tipo: 'entrada',
              status: 'pendente'
            })
        }

        await updateBriefing(paramId, { status_briefing: 'pago' })
      }

      setPaySuccess(true)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Falha ao processar o aceite da proposta.')
    } finally {
      setIsPaying(false)
    }
  }

  const hasProposalData = proposal || (briefing && briefing.proposta_ia)

  return (
    <Layout>
      <div className="min-h-screen bg-brand-dark text-white py-16 px-4 sm:px-6 relative overflow-hidden font-sans">
        
        {/* Efeitos visuais de fundo */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-neon/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto space-y-8">

          {loading ? (
            <div className="py-24 text-center space-y-4 bg-brand-gray/50 border border-white/5 rounded-lg">
              <Loader2 className="w-8 h-8 text-brand-neon animate-spin mx-auto" />
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Carregando detalhes da proposta comercial...</p>
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center bg-brand-gray/60 border border-rose-500/20 text-rose-400 rounded-lg space-y-4">
              <Info className="w-8 h-8 mx-auto" />
              <p className="text-sm font-mono uppercase tracking-widest">{errorMessage}</p>
              <button 
                onClick={() => navigate('/')} 
                className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded text-xs font-mono text-white cursor-pointer"
              >
                VOLTAR AO INÍCIO
              </button>
            </div>
          ) : !hasProposalData ? (
            /* AGUARDANDO PROPOSTA GERADA */
            <div className="bg-brand-gray/80 border border-brand-gray rounded-lg p-8 sm:p-12 text-center space-y-8 shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon to-transparent" />
              
              <div className="max-w-md mx-auto space-y-4">
                <Loader2 className="w-12 h-12 text-brand-neon animate-spin mx-auto" />
                <h3 className="font-space font-extrabold text-white text-lg sm:text-xl uppercase tracking-wider">
                  PROPOSTA COMERCIAL EM ANÁLISE
                </h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  A nossa engenharia e os agentes de IA estão revisando a proposta comercial. Você receberá um e-mail com a notificação em breve.
                </p>
                <p className="text-[10px] font-mono text-brand-neon uppercase tracking-widest bg-brand-neon/5 border border-brand-neon/20 py-2 rounded">
                  Status: EM PROCESSAMENTO
                </p>
              </div>

              {briefing && (
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Atalho de Desenvolvimento</p>
                  <button
                    type="button"
                    onClick={handleSimulateAIPortalg}
                    disabled={isSimulating}
                    className="px-6 py-3 bg-brand-neon text-black rounded text-[10px] tracking-widest font-extrabold uppercase hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all cursor-pointer font-mono"
                  >
                    {isSimulating ? 'SIMULANDO...' : 'SIMULAR RETORNO DA IA (PROPOSTA)'}
                  </button>
                </div>
              )}
            </div>
          ) : paySuccess ? (
            /* SUCESSO NO ACEITE / PAGAMENTO */
            <div className="bg-brand-gray/80 border border-brand-gray rounded-lg p-8 sm:p-12 text-center space-y-8 shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon to-transparent" />
              
              <div className="max-w-md mx-auto space-y-4">
                <CheckCircle2 className="w-16 h-16 text-brand-neon mx-auto" />
                <h3 className="font-space font-extrabold text-white text-xl sm:text-2xl uppercase tracking-wider">
                  PROPOSTA ACEITA COM SUCESSO!
                </h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  O aceite da proposta e o registro da fatura de entrada (50%) foram concluídos com sucesso. Em breve, a equipe entrará em contato para liberar seu acesso ao painel do projeto.
                </p>
                
                <div className="pt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/')}
                    className="py-3 bg-white/5 hover:bg-white/10 rounded text-[10px] font-mono tracking-widest font-bold uppercase transition-all cursor-pointer"
                  >
                    VOLTAR AO SITE
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="py-3 bg-brand-neon text-black rounded text-[10px] font-mono tracking-widest font-extrabold uppercase hover:shadow-[0_0_12px_rgba(204,255,0,0.3)] transition-all cursor-pointer"
                  >
                    IR PARA LOGIN
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* DETALHES DA PROPOSTA COMERCIAL DA IA */
            <div className="space-y-6">
              
              {/* Card Principal da Proposta */}
              <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/60 to-transparent" />
                
                {/* Cabeçalho */}
                <div className="border-b border-white/5 pb-4 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] tracking-widest font-mono text-brand-neon uppercase font-bold block mb-1">
                      PROPOSTA COMERCIAL OFICIAL
                    </span>
                    <h2 className="font-space font-extrabold text-white text-lg sm:text-xl uppercase">
                      {nomeCliente}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-brand-neon uppercase tracking-widest bg-brand-neon/10 border border-brand-neon/20 px-3 py-1 rounded">
                      PROPOSTA ENVIADA
                    </span>
                  </div>
                </div>

                {/* Resumo do Escopo */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Resumo do Escopo Técnico</h4>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    {resumoEscopo}
                  </p>
                </div>

                {/* Entregáveis */}
                {entregaveisList.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Entregáveis Garantidos do Projeto</h4>
                    <ul className="space-y-2 text-xs text-gray-300">
                      {entregaveisList.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Zap className="w-3.5 h-3.5 text-brand-neon shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Módulos Opcionais / Upsells */}
              {upsellsList.length > 0 && (
                <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
                  
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="font-space font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                      <Plus className="w-4 h-4 text-brand-neon" />
                      ADICIONAIS E MÓDULOS OPCIONAIS (UPSELLS)
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {upsellsList.map((up) => {
                      const isSelected = selectedUpsells.includes(up.id)
                      return (
                        <button
                          type="button"
                          key={up.id}
                          onClick={() => handleToggleUpsell(up.id)}
                          className={`w-full text-left p-4 rounded border text-xs font-medium transition-all duration-300 flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-brand-neon/10 border-brand-neon text-brand-neon shadow-lg shadow-brand-neon/5'
                              : 'bg-black/20 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="block font-bold">{up.nome}</span>
                            <span className="block text-[10px] text-gray-500 font-mono">Módulo adicional opcional</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-white font-extrabold">
                              + R$ {up.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-brand-neon border-brand-neon text-black' : 'border-white/20'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Resumo Financeiro e Aceite */}
              <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
                
                <div className="border-b border-white/5 pb-3">
                  <h3 className="font-space font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-brand-neon" />
                    RESUMO DOS VALORES COMERCIAIS
                  </h3>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Valor Base do Setup:</span>
                    <span>R$ {basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {upsellsTotal > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Adicionais Selecionados:</span>
                      <span>+ R$ {upsellsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  {valorMensalRecorrente > 0 && (
                    <div className="flex justify-between text-gray-400 border-t border-white/5 pt-2">
                      <span>Mensalidade Recorrente Suporte/VPS:</span>
                      <span>R$ {valorMensalRecorrente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-bold text-white border-t border-white/5 pt-3">
                    <span>Preço Total do Setup:</span>
                    <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  {/* Caixa de Sinal de Entrada (50%) */}
                  <div className="bg-brand-neon/5 border border-brand-neon/20 rounded p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="block text-[10px] text-brand-neon uppercase font-bold tracking-wider">Valor da Entrada Exigido (50%)</span>
                      <p className="text-[11px] text-gray-400 font-sans font-light">Os outros 50% são faturados apenas após a homologação final.</p>
                    </div>
                    <div className="text-2xl font-space font-extrabold text-brand-neon">
                      R$ {downPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Botão de Aceite */}
                <div className="pt-2 font-mono">
                  <button
                    onClick={handlePayEntry}
                    disabled={isPaying}
                    className="w-full py-4 bg-brand-neon text-black rounded text-xs tracking-wider font-extrabold hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        PROCESSANDO ACEITE E PAGAMENTO...
                      </>
                    ) : (
                      <>
                        ACEITAR PROPOSTA E EFETUAR PAGAMENTO DA ENTRADA (50%)
                        <ArrowRight className="w-4 h-4 text-black" />
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}
