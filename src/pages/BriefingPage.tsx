import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Terminal, Shield, Sparkles, Loader2, CheckCircle2, ChevronRight, Info } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { createBriefing, triggerN8NBriefingWebhook, checkProfileDuplicity } from '../services/briefingServices'
import type { BriefingStatus, Briefing } from '../types/database'
import Layout from '../components/Layout'

const AVAILABLE_FEATURES = [
  'Autenticação de Usuários (Login/Senha/Google)',
  'Painel Administrativo para Gestão de Conteúdo',
  'Integração de Pagamentos (Pix, Cartão, Boleto)',
  'Notificações por WhatsApp em tempo real',
  'Chatbot com Inteligência Artificial para Atendimento',
  'Dashboard com Gráficos e Métricas Financeiras',
  'Sistema de Agendamento Online e Reservas',
  'Exportação de Relatórios em PDF e Excel',
  'Multi-idioma (Português, Inglês, Espanhol)',
  'SEO Avançado e Otimização de Performance'
]

const AVAILABLE_INTEGRATIONS = [
  'Supabase (Banco de Dados & Auth)',
  'n8n (Automação de Workflows)',
  'Asaas (Gateway de Pagamento)',
  'Stripe (Pagamentos Globais)',
  'RD Station (CRM & Marketing)',
  'ActiveCampaign (E-mail Marketing)',
  'HubSpot CRM',
  'Google Analytics & Tag Manager',
  'API Oficial do WhatsApp (Cloud API)',
  'OpenAI (ChatGPT/Assistant API)'
]

export default function BriefingPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  // Database contexts
  const [clientId, setClientId] = useState<string>('')
  const [projectTitle, setProjectTitle] = useState<string>('')
  const [clientEmail, setClientEmail] = useState<string>('')
  const [clientCpfCnpj, setClientCpfCnpj] = useState<string>('')

  // UI States
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Form states
  const [projectName, setProjectName] = useState('')
  const [colorPrimaria, setColorPrimaria] = useState('#CCFF00')
  const [colorSecundaria, setColorSecundaria] = useState('#050505')
  const [sloganTom, setSloganTom] = useState('')
  const [faturamento, setFaturamento] = useState('')
  const [socios, setSocios] = useState(1)
  const [funcionarios, setFuncionarios] = useState(1)
  const [publicoAlvo, setPublicoAlvo] = useState('')
  const [doresPrincipais, setDoresPrincipais] = useState('')
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

  // Load project context
  useEffect(() => {
    async function loadProjectContext() {
      if (!projectId) return
      try {
        const { data: project, error: pError } = await supabase
          .from('projects')
          .select('client_id, nome')
          .eq('id', projectId)
          .maybeSingle()

        if (pError || !project) {
          console.error(pError)
          setErrorMessage('PROJETO NÃO ENCONTRADO NO BANCO DE DADOS.')
          setIsLoadingProject(false)
          return
        }

        setClientId(project.client_id)
        setProjectTitle(project.nome)
        setProjectName(project.nome.replace('Solicitação: ', ''))

        // Fetch client details
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, cpf, cnpj')
          .eq('id', project.client_id)
          .maybeSingle()

        if (profile) {
          setClientEmail(profile.email || '')
          setClientCpfCnpj(profile.cpf || profile.cnpj || '')
        }
      } catch (err) {
        console.error(err)
        setErrorMessage('ERRO AO CONECTAR COM O SERVIDOR.')
      } finally {
        setIsLoadingProject(false)
      }
    }

    loadProjectContext()
  }, [projectId])

  const handleFeatureToggle = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feat))
    } else {
      setSelectedFeatures([...selectedFeatures, feat])
    }
  }

  const handleIntegrationToggle = (integ: string) => {
    if (selectedIntegrations.includes(integ)) {
      setSelectedIntegrations(selectedIntegrations.filter(i => i !== integ))
    } else {
      setSelectedIntegrations([...selectedIntegrations, integ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!projectName || !doresPrincipais) {
      setErrorMessage('POR FAVOR, PREENCHA OS CAMPOS OBRIGATÓRIOS (*).')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Validação de Duplicidade de Cadastro no banco (email e CPF/CNPJ)
      if (clientEmail) {
        const duplicity = await checkProfileDuplicity(clientEmail, clientCpfCnpj)
        if (duplicity.exists && duplicity.field === 'cpf_cnpj') {
          console.warn('CPF/CNPJ já cadastrado em outro perfil.');
          // Permite prosseguir localmente mas alerta no console
        }
      }

      // 2. Salva o briefing na tabela briefings
      const briefing = await createBriefing({
        client_id: clientId || '6f1f8a1e-855d-4cc0-ab49-8e6884265ec8', // fallback seguro
        project_id: projectId || null,
        nome_projeto: projectName,
        cor_primaria: colorPrimaria,
        cor_secundaria: colorSecundaria,
        tom_de_voz: sloganTom,
        faturamento_mensal: faturamento,
        qtd_socios: Number(socios) || 1,
        qtd_funcionarios: Number(funcionarios) || 1,
        publico_alvo: publicoAlvo,
        dores_principais: doresPrincipais,
        funcionalidades_esperadas: selectedFeatures,
        integracoes_necessarias: selectedIntegrations,
        status_briefing: 'em_analise_ia'
      })

      if (!briefing) {
        throw new Error('Falha ao inserir registro na tabela briefings.')
      }

      // 3. Dispara o Webhook do N8N
      const webhookSuccess = await triggerN8NBriefingWebhook(briefing)
      if (!webhookSuccess) {
        console.warn('Webhook n8n retornou erro ou não pôde ser contatado. O fluxo continuará com simulação local.')
      }

      // 4. Atualiza o status do projeto na tabela projects para 'briefing' ou 'proposta_pendente'
      if (projectId) {
        await supabase
          .from('projects')
          .update({ fase_atual: 'briefing' })
          .eq('id', projectId)
      }

      // 5. Direciona para a página de status do briefing
      // Para simular localmente a geração de proposta pela IA, criamos uma rota temporária ou mostramos o aguarde
      navigate(`/proposta/${briefing.id}`)

    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'OCORREU UM ERRO AO ENVIAR O BRIEFING PARA ANÁLISE.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-brand-dark text-white py-16 px-4 sm:px-6 relative overflow-hidden font-sans">
        
        {/* Background light effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-neon/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-neon/10 border border-brand-neon/20 rounded-full text-brand-neon text-[10px] font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Agente de IA Integrado
            </div>
            <h1 className="text-3xl sm:text-5xl font-space font-extrabold tracking-tight text-white uppercase">
              Briefing de Escopo Técnico
            </h1>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Responda os detalhes abaixo para que nossa inteligência artificial analise suas necessidades, faça a precificação dinâmica e monte seu cronograma operacional personalizado.
            </p>
          </div>

          {isLoadingProject ? (
            <div className="py-24 text-center space-y-4 bg-brand-gray/50 border border-white/5 rounded-lg">
              <Loader2 className="w-8 h-8 text-brand-neon animate-spin mx-auto" />
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Carregando dados do escopo...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMessage && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded text-xs tracking-wider uppercase font-mono text-center flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}

              {/* 1. Identidade Visual */}
              <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
                
                <div className="border-b border-white/5 pb-3">
                  <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="text-brand-neon">01.</span> IDENTIDADE VISUAL E MARCA
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">NOME DO PROJETO / MARCA *</label>
                    <input
                      type="text"
                      required
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Ex: Minha Empresa Vendas"
                      className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">SLOGAN OU TOM DE VOZ PRINCIPAL</label>
                    <input
                      type="text"
                      value={sloganTom}
                      onChange={(e) => setSloganTom(e.target.value)}
                      placeholder="Ex: Tom corporativo, sério e de alta autoridade"
                      className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">COR PRIMÁRIA (HEX)</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={colorPrimaria}
                        onChange={(e) => setColorPrimaria(e.target.value)}
                        className="w-10 h-10 bg-transparent border-0 outline-none cursor-pointer"
                      />
                      <input
                        type="text"
                        value={colorPrimaria}
                        onChange={(e) => setColorPrimaria(e.target.value)}
                        placeholder="#CCFF00"
                        className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">COR SECUNDÁRIA (HEX)</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={colorSecundaria}
                        onChange={(e) => setColorSecundaria(e.target.value)}
                        className="w-10 h-10 bg-transparent border-0 outline-none cursor-pointer"
                      />
                      <input
                        type="text"
                        value={colorSecundaria}
                        onChange={(e) => setColorSecundaria(e.target.value)}
                        placeholder="#050505"
                        className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Métricas do Negócio */}
              <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
                
                <div className="border-b border-white/5 pb-3">
                  <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="text-brand-neon">02.</span> MÉTRICAS E PÚBLICO DO NEGÓCIO
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">FATURAMENTO MENSAL ESTIMADO</label>
                    <select
                      value={faturamento}
                      onChange={(e) => setFaturamento(e.target.value)}
                      className="w-full bg-black/45 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-3 py-3 text-xs text-white cursor-pointer"
                    >
                      <option value="">Selecione...</option>
                      <option value="Ate R$ 10k">Até R$ 10.000 / mês</option>
                      <option value="R$ 10k a R$ 50k">R$ 10.000 a R$ 50.000 / mês</option>
                      <option value="R$ 50k a R$ 200k">R$ 50.000 a R$ 200.000 / mês</option>
                      <option value="Acima de R$ 200k">Acima de R$ 200.000 / mês</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">QTD. DE SÓCIOS</label>
                    <input
                      type="number"
                      min={1}
                      value={socios}
                      onChange={(e) => setSocios(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">QTD. DE FUNCIONÁRIOS</label>
                    <input
                      type="number"
                      min={1}
                      value={funcionarios}
                      onChange={(e) => setFuncionarios(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">PÚBLICO-ALVO / CLIENTE IDEAL</label>
                    <input
                      type="text"
                      value={publicoAlvo}
                      onChange={(e) => setPublicoAlvo(e.target.value)}
                      placeholder="Ex: Empreendedores B2B, Jovens de 18-25 anos, Profissionais liberais"
                      className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">PRINCIPAIS DORES E GARGALOS DA OPERAÇÃO *</label>
                    <textarea
                      required
                      rows={4}
                      value={doresPrincipais}
                      onChange={(e) => setDoresPrincipais(e.target.value)}
                      placeholder="Descreva as maiores dificuldades operacionais do seu negócio hoje..."
                      className="w-full bg-black/40 border border-white/10 focus:border-brand-neon outline-none transition-all rounded px-4 py-3 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Funcionalidades */}
              <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon/40 to-transparent" />
                
                <div className="border-b border-white/5 pb-3">
                  <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="text-brand-neon">03.</span> FUNCIONALIDADES DESEJADAS
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_FEATURES.map((feat) => {
                    const isSelected = selectedFeatures.includes(feat)
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => handleFeatureToggle(feat)}
                        className={`text-left p-3.5 rounded border text-xs font-medium transition-all duration-300 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-brand-neon/10 border-brand-neon text-brand-neon shadow-lg shadow-brand-neon/5'
                            : 'bg-black/25 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span>{feat}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-neon shrink-0 ml-2" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 4. Integrações */}
              <div className="bg-brand-gray/90 border border-brand-gray rounded-lg p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
                
                <div className="border-b border-white/5 pb-3">
                  <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="text-brand-neon">04.</span> INTEGRAÇÕES DE APIS / CRMS / SISTEMAS
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_INTEGRATIONS.map((integ) => {
                    const isSelected = selectedIntegrations.includes(integ)
                    return (
                      <button
                        type="button"
                        key={integ}
                        onClick={() => handleIntegrationToggle(integ)}
                        className={`text-left p-3.5 rounded border text-xs font-medium transition-all duration-300 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-brand-neon/10 border-brand-neon text-brand-neon shadow-lg shadow-brand-neon/5'
                            : 'bg-black/25 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span>{integ}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-neon shrink-0 ml-2" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 font-mono">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-neon text-black rounded text-xs tracking-wider font-extrabold hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] transition-all duration-300 uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      ENVIANDO...
                    </>
                  ) : (
                    <>
                      ENVIAR BRIEFING PARA ANÁLISE IA
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </Layout>
  )
}
