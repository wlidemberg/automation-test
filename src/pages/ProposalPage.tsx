import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2, ArrowRight, Check, Star, ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import { fetchActiveProducts } from '../services/productServices'
import { submitProposalRequest } from '../services/leadServices'

const AVAILABLE_FEATURES = [
  'Painel de Controle / Dashboard Restrito',
  'Banco de Dados Relacional Seguro',
  'Mecanismo de Busca Inteligente de Dados',
  'Geração de Relatórios e Exportação (PDF/Excel)',
  'Autenticação de Usuários / Controle de Níveis',
  'Notificações por Email e SMS em tempo real',
  'Linha do Tempo / Acompanhamento de Atividades',
  'Assinatura Digital de Contratos e Acordos',
  'Área de Upload e Downloads de Documentos'
]

const AVAILABLE_INTEGRATIONS = [
  'Gateway de Pagamento (Stripe/Asaas/MercadoPago)',
  'CRM Corporativo (HubSpot/Salesforce/Pipedrive)',
  'Sistemas de Envio de Email (Sendgrid/Mailgun)',
  'Integração ERP / Faturamento Local',
  'HubSpot CRM',
  'Google Analytics & Tag Manager',
  'API Oficial do WhatsApp (Cloud API)',
  'OpenAI (ChatGPT/Assistant API)'
]

export default function ProposalPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialProductSlug = searchParams.get('produto') || ''

  // Wizard state
  const [step, setStep] = useState(1)

  // Step 1: Identificação
  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ'>('PJ')
  const [nomeRazao, setNomeRazao] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpfCnpj, setCpfCnpj] = useState('')

  // Step 2: Produto & Identidade
  const [selectedProductSlug, setSelectedProductSlug] = useState('')
  const [nomeProjeto, setNomeProjeto] = useState('')
  const [corPrimaria, setCorPrimaria] = useState('#CCFF00')
  const [corSecundaria, setCorSecundaria] = useState('#050505')
  const [tomDeVoz, setTomDeVoz] = useState('')

  // Step 3: Métricas & Público
  const [faturamentoMensal, setFaturamentoMensal] = useState('')
  const [qtdSocios, setQtdSocios] = useState(1)
  const [qtdFuncionarios, setQtdFuncionarios] = useState(1)
  const [publicoAlvo, setPublicoAlvo] = useState('')

  // Step 4: Necessidades & Detalhes Técnicos
  const [doresPrincipais, setDoresPrincipais] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

  // UI States
  const [products, setProducts] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Load products & pre-select product
  useEffect(() => {
    window.scrollTo(0, 0)
    async function loadProducts() {
      try {
        const data = await fetchActiveProducts()
        setProducts(data)
      } catch (err) {
        console.error(err)
      }
    }
    loadProducts()
  }, [])

  useEffect(() => {
    if (initialProductSlug) {
      setSelectedProductSlug(initialProductSlug)
    }
  }, [initialProductSlug])

  // Countdown timer for automatic redirection
  useEffect(() => {
    let timer: any
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (isSuccess && countdown === 0) {
      navigate('/')
    }
    return () => clearTimeout(timer)
  }, [isSuccess, countdown, navigate])

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

  const isStepValid = (stepNum: number) => {
    if (stepNum === 1) {
      return nomeRazao.trim() !== '' && email.trim() !== '' && telefone.trim() !== '' && cpfCnpj.trim() !== ''
    }
    if (stepNum === 2) {
      return selectedProductSlug !== '' && nomeProjeto.trim() !== ''
    }
    if (stepNum === 3) {
      return faturamentoMensal !== '' && publicoAlvo.trim() !== ''
    }
    if (stepNum === 4) {
      return doresPrincipais.trim() !== ''
    }
    return true
  }

  const handleNextStep = () => {
    if (isStepValid(step)) {
      setStep(prev => prev + 1)
      setErrorMessage(null)
      window.scrollTo(0, 0)
    } else {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios (*).')
    }
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
    setErrorMessage(null)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setErrorMessage(null)

    if (!isStepValid(4)) {
      setErrorMessage('Por favor, descreva as dores principais de sua operação.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitProposalRequest({
        tipoPessoa,
        nomeRazao,
        email,
        telefone,
        cpfCnpj,
        produtoSlug: selectedProductSlug,
        nomeProjeto,
        corPrimaria,
        corSecundaria,
        tomDeVoz,
        faturamentoMensal,
        qtdFuncionarios,
        qtdSocios,
        publicoAlvo,
        doresPrincipais,
        funcionalidadesEsperadas: selectedFeatures,
        integracoesNecessarias: selectedIntegrations
      })

      if (result && result.success) {
        setIsSuccess(true)
      } else {
        throw new Error('Falha ao processar solicitação no banco de dados.')
      }
    } catch (err: any) {
      console.error(err)
      // Fallback local se estiver em desenvolvimento
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      if (isLocal) {
        console.warn('Utilizando fallback local de sucesso para desenvolvimento.')
        setIsSuccess(true)
      } else {
        setErrorMessage(err.message || 'Falha de comunicação com o banco de dados. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] bg-brand-dark flex items-center justify-center py-16 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Background light effects */}
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-brand-neon/[0.02] blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/[0.02] blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Lado Esquerdo / Benefícios */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-brand-neon font-mono">
                DIAGNÓSTICO E BRIEFING INTEGRADO
              </span>
              <h1 className="text-3xl sm:text-5xl font-space font-extrabold tracking-tight text-white leading-tight uppercase">
                Sua Operação <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-neon">
                  Sob Medida
                </span>
              </h1>
              <p className="font-sans text-gray-400 text-sm font-light leading-relaxed">
                Mapeie seu escopo técnico e comercial em uma única esteira automatizada. Nossa IA analisará seus requisitos para estruturar sua precificação dinâmica.
              </p>
            </div>

            {/* Benefícios */}
            <div className="space-y-4 font-sans text-xs">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center mt-0.5 shrink-0 text-brand-neon">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider">Passo a Passo Guiado</h4>
                  <p className="text-gray-400 mt-0.5 leading-relaxed">Etapas simplificadas para detalhar sua identidade de marca e escopo funcional.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center mt-0.5 shrink-0 text-brand-neon">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider">Precificação Dinâmica por IA</h4>
                  <p className="text-gray-400 mt-0.5 leading-relaxed">Proposta de escopo técnico gerada automaticamente e disponibilizada para aceite.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center mt-0.5 shrink-0 text-brand-neon">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider">Segurança e Agilidade</h4>
                  <p className="text-gray-400 mt-0.5 leading-relaxed">Armazenamento seguro com RLS garantindo privacidade e integridade no Supabase.</p>
                </div>
              </div>
            </div>

            {/* Testemunho */}
            <div className="pt-6 border-t border-white/5 space-y-3 hidden sm:block">
              <div className="flex items-center gap-1 text-[#CCFF00]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#CCFF00]" />
                ))}
              </div>
              <blockquote className="text-[11px] font-sans text-gray-400 italic font-light leading-relaxed">
                "O formulário unificado facilitou muito a especificação de nosso ERP corporativo. Recebemos a proposta formatada pela IA em poucos minutos."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-brand-neon">
                  VE
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white uppercase">Vekant Empreendimentos</p>
                  <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Enterprise Client</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito / Wizard Form */}
          <div className="lg:col-span-7 font-sans">
            {!isSuccess ? (
              <div className="bg-brand-gray/90 border border-brand-gray rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent" />

                {/* Progress Bar & Indicators */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 tracking-wider">
                    <span className={step >= 1 ? 'text-brand-neon font-bold' : ''}>01. IDENTIFICAÇÃO</span>
                    <span className={step >= 2 ? 'text-brand-neon font-bold' : ''}>02. MARCA</span>
                    <span className={step >= 3 ? 'text-brand-neon font-bold' : ''}>03. NEGÓCIO</span>
                    <span className={step >= 4 ? 'text-brand-neon font-bold' : ''}>04. ESCOPO</span>
                  </div>
                  <div className="h-[3px] bg-black/40 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-brand-neon h-full transition-all duration-500" 
                      style={{ width: `${(step / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded">
                    {errorMessage.toUpperCase()}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <h3 className="font-space font-extrabold text-lg text-white uppercase">
                            PASSO 1: Identificação do Solicitante
                          </h3>
                          <p className="text-[11px] text-gray-400">Informe seus dados cadastrais e de faturamento corporativo.</p>
                        </div>

                        {/* Toggle PF vs PJ */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Tipo de Pessoa *</label>
                          <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 border border-white/5 rounded-lg">
                            <button
                              type="button"
                              onClick={() => setTipoPessoa('PJ')}
                              className={`py-2 rounded text-[10px] font-mono font-bold uppercase transition-all tracking-wider cursor-pointer ${
                                tipoPessoa === 'PJ' ? 'bg-[#CCFF00] text-black font-extrabold shadow-lg shadow-[#CCFF00]/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              Pessoa Jurídica (PJ)
                            </button>
                            <button
                              type="button"
                              onClick={() => setTipoPessoa('PF')}
                              className={`py-2 rounded text-[10px] font-mono font-bold uppercase transition-all tracking-wider cursor-pointer ${
                                tipoPessoa === 'PF' ? 'bg-[#CCFF00] text-black font-extrabold shadow-lg shadow-[#CCFF00]/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              Pessoa Física (PF)
                            </button>
                          </div>
                        </div>

                        {/* Nome ou Razão Social */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">
                            {tipoPessoa === 'PJ' ? 'Razão Social *' : 'Nome Completo *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={nomeRazao}
                            onChange={(e) => setNomeRazao(e.target.value)}
                            placeholder={tipoPessoa === 'PJ' ? 'Ex: Vekant Empreendimentos LTDA' : 'Ex: Thiago Vernat'}
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-750 focus:border-brand-neon outline-none"
                          />
                        </div>

                        {/* CPF ou CNPJ */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">
                            {tipoPessoa === 'PJ' ? 'CNPJ *' : 'CPF *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={cpfCnpj}
                            onChange={(e) => setCpfCnpj(e.target.value)}
                            placeholder={tipoPessoa === 'PJ' ? '00.000.000/0001-00' : '000.000.000-00'}
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-750 focus:border-brand-neon outline-none"
                          />
                        </div>

                        {/* E-mail & Telefone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">E-mail *</label>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Ex: contato@empresa.com"
                              className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-750 focus:border-brand-neon outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Telefone *</label>
                            <input
                              type="tel"
                              required
                              value={telefone}
                              onChange={(e) => setTelefone(e.target.value)}
                              placeholder="Ex: (11) 98765-4321"
                              className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-750 focus:border-brand-neon outline-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <h3 className="font-space font-extrabold text-lg text-white uppercase">
                            PASSO 2: Produto & Identidade Visual
                          </h3>
                          <p className="text-[11px] text-gray-400">Escolha a solução de base e detalhe a estética de sua marca.</p>
                        </div>

                        {/* Solução Dropdown */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Solução Requerida *</label>
                          <select
                            required
                            value={selectedProductSlug}
                            onChange={(e) => {
                              setSelectedProductSlug(e.target.value)
                              const prod = products.find(p => p.slug === e.target.value)
                              if (prod && !nomeProjeto) {
                                setNomeProjeto(prod.nome)
                              }
                            }}
                            className="w-full bg-black border border-white/10 rounded p-3 text-xs text-white outline-none focus:border-brand-neon cursor-pointer"
                          >
                            <option value="" disabled>Selecione o serviço tecnológico de interesse...</option>
                            {products.map((prod) => (
                              <option key={prod.id} value={prod.slug} className="bg-brand-gray text-white">
                                {prod.nome} {prod.preco_setup ? `(Setup: R$ ${prod.preco_setup})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Nome do Projeto */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Nome da Solução / Projeto *</label>
                          <input
                            type="text"
                            required
                            value={nomeProjeto}
                            onChange={(e) => setNomeProjeto(e.target.value)}
                            placeholder="Ex: ERP de Retaguarda Vekant"
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-750 focus:border-brand-neon outline-none"
                          />
                        </div>

                        {/* Cores Primária e Secundária */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Cor Primária (Hex)</label>
                            <div className="flex gap-2">
                              <input 
                                type="color" 
                                value={corPrimaria} 
                                onChange={(e) => setCorPrimaria(e.target.value)} 
                                className="w-10 h-10 border border-white/10 bg-transparent rounded cursor-pointer shrink-0" 
                              />
                              <input 
                                type="text" 
                                value={corPrimaria} 
                                onChange={(e) => setCorPrimaria(e.target.value)} 
                                className="w-full bg-black/40 border border-white/10 rounded px-3 text-xs text-white uppercase font-mono outline-none focus:border-brand-neon" 
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Cor Secundária (Hex)</label>
                            <div className="flex gap-2">
                              <input 
                                type="color" 
                                value={corSecundaria} 
                                onChange={(e) => setCorSecundaria(e.target.value)} 
                                className="w-10 h-10 border border-white/10 bg-transparent rounded cursor-pointer shrink-0" 
                              />
                              <input 
                                type="text" 
                                value={corSecundaria} 
                                onChange={(e) => setCorSecundaria(e.target.value)} 
                                className="w-full bg-black/40 border border-white/10 rounded px-3 text-xs text-white uppercase font-mono outline-none focus:border-brand-neon" 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Tom de Voz / Slogan */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Tom de Voz ou Slogan Principal</label>
                          <input
                            type="text"
                            value={tomDeVoz}
                            onChange={(e) => setTomDeVoz(e.target.value)}
                            placeholder="Ex: Sofisticado, minimalista e altamente performático."
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-750 focus:border-brand-neon outline-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <h3 className="font-space font-extrabold text-lg text-white uppercase">
                            PASSO 3: Métricas de Negócio & Público
                          </h3>
                          <p className="text-[11px] text-gray-400">Contextualize o porte operacional e o perfil de seus clientes.</p>
                        </div>

                        {/* Faturamento Mensal */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Faturamento Mensal Estimado *</label>
                          <select
                            required
                            value={faturamentoMensal}
                            onChange={(e) => setFaturamentoMensal(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded p-3 text-xs text-white outline-none focus:border-brand-neon cursor-pointer"
                          >
                            <option value="" disabled>Selecione a faixa de faturamento...</option>
                            <option value="Até R$ 50k">Até R$ 50 mil / mês</option>
                            <option value="R$ 50k a R$ 200k">R$ 50 mil a R$ 200 mil / mês</option>
                            <option value="R$ 200k a R$ 1M">R$ 200 mil a R$ 1 milhão / mês</option>
                            <option value="Acima de R$ 1M">Acima de R$ 1 milhão / mês</option>
                          </select>
                        </div>

                        {/* Sócios & Funcionários */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Quantidade de Sócios</label>
                            <input
                              type="number"
                              min={1}
                              value={qtdSocios}
                              onChange={(e) => setQtdSocios(Math.max(1, Number(e.target.value)))}
                              className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white outline-none focus:border-brand-neon"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Quantidade de Funcionários</label>
                            <input
                              type="number"
                              min={1}
                              value={qtdFuncionarios}
                              onChange={(e) => setQtdFuncionarios(Math.max(1, Number(e.target.value)))}
                              className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white outline-none focus:border-brand-neon"
                            />
                          </div>
                        </div>

                        {/* Público Alvo */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Público-Alvo do Sistema/Produto *</label>
                          <textarea
                            required
                            rows={3}
                            value={publicoAlvo}
                            onChange={(e) => setPublicoAlvo(e.target.value)}
                            placeholder="Descreva quem utilizará a ferramenta (ex: Clientes finais de classe A/B, equipe comercial interna, administradores)."
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-750 focus:border-brand-neon outline-none resize-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <h3 className="font-space font-extrabold text-lg text-white uppercase">
                            PASSO 4: Necessidades & Requisitos de Escopo
                          </h3>
                          <p className="text-[11px] text-gray-400">Especifique as principais dores operacionais e funcionalidades requeridas.</p>
                        </div>

                        {/* Dores Principais */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">Dores Principais a Serem Resolvidas *</label>
                          <textarea
                            required
                            rows={4}
                            value={doresPrincipais}
                            onChange={(e) => setDoresPrincipais(e.target.value)}
                            placeholder="Descreva quais gargalos operacionais ou lentidão você quer eliminar com este sistema."
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-750 focus:border-brand-neon outline-none resize-none font-sans"
                          />
                        </div>

                        {/* Funcionalidades */}
                        <div className="space-y-3">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase block">Funcionalidades Desejadas</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {AVAILABLE_FEATURES.map((feat) => {
                              const isSelected = selectedFeatures.includes(feat)
                              return (
                                <button
                                  type="button"
                                  key={feat}
                                  onClick={() => handleFeatureToggle(feat)}
                                  className={`text-left p-2.5 rounded border text-[10px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-brand-neon/10 border-brand-neon text-brand-neon'
                                      : 'bg-black/25 border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                                  }`}
                                >
                                  <span>{feat}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-neon shrink-0 ml-2" />}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Integrações */}
                        <div className="space-y-3">
                          <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase block">Integrações de API / CRM</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {AVAILABLE_INTEGRATIONS.map((integ) => {
                              const isSelected = selectedIntegrations.includes(integ)
                              return (
                                <button
                                  type="button"
                                  key={integ}
                                  onClick={() => handleIntegrationToggle(integ)}
                                  className={`text-left p-2.5 rounded border text-[10px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-brand-neon/10 border-brand-neon text-brand-neon'
                                      : 'bg-black/25 border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                                  }`}
                                >
                                  <span>{integ}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-neon shrink-0 ml-2" />}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions Navigation */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/5 font-mono text-[10px]">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded font-bold tracking-wider hover:bg-white/10 transition-all uppercase flex items-center gap-1.5 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        VOLTAR
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-3 bg-brand-neon text-black rounded font-extrabold tracking-wider hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all uppercase flex items-center gap-1.5 cursor-pointer ml-auto"
                      >
                        AVANÇAR
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 bg-brand-neon text-black rounded font-extrabold tracking-wider hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] transition-all uppercase flex items-center gap-2 cursor-pointer disabled:opacity-50 ml-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                            ENVIANDO BRIEFING...
                          </>
                        ) : (
                          <>
                            FINALIZAR E ENVIAR
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              /* Success Screen */
              <div className="bg-brand-gray/90 border border-brand-gray rounded-2xl p-8 sm:p-12 backdrop-blur-md shadow-2xl text-center space-y-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent" />
                
                <div className="p-4 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-full text-[#CCFF00]">
                  <CheckCircle2 className="w-16 h-16" />
                </div>
                <div className="space-y-3 max-w-xl">
                  <h2 className="font-space font-extrabold text-2xl text-white uppercase tracking-tight">
                    BRIEFING ENVIADO COM SUCESSO!
                  </h2>
                  <p className="text-sm text-brand-neon font-mono uppercase tracking-widest">
                    OBRIGADO PELO SEU ENVIO
                  </p>
                  <p className="text-xs text-gray-400 font-sans font-light leading-relaxed font-sans">
                    Sua solicitação foi registrada no banco de dados. Nosso agente de Inteligência Artificial já foi acionado e está integrando seus dados com a automação no n8n.
                  </p>
                  <div className="bg-black/30 border border-white/5 rounded p-4 text-left text-xs space-y-2 mt-4 font-sans">
                    <span className="block text-[9px] font-mono text-brand-neon uppercase font-bold tracking-wider">PRÓXIMOS PASSOS E FLUXO:</span>
                    <p className="text-gray-300 font-sans font-light leading-relaxed">
                      1. **Análise de IA**: Nosso assistente gera a proposta dinâmica baseada nas dores e integrações fornecidas.
                      <br />
                      2. **Geração de Proposta**: A proposta técnica é gerada e disponibilizada em sua Área do Cliente.
                      <br />
                      3. **Aprovação**: Você revisa o orçamento, seleciona adicionais e realiza o aceite comercial.
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase pt-2">
                    Redirecionando para a tela inicial em {countdown} segundos...
                  </p>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-[#CCFF00] text-black rounded text-xs font-mono font-bold tracking-wider hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all cursor-pointer uppercase"
                  >
                    VOLTAR PARA O SITE
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded text-xs font-mono tracking-widest text-white uppercase hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    FECHAR
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </Layout>
  )
}
