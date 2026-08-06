import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Check, 
  Star,
  Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import { productsData, getLocalProductBySlug } from '../data/productsData'
import { createLead, type LeadPayload } from '../services/leadServices'

type Categoria = 'design_web' | 'desenvolvimento' | 'erp_saas' | 'automacao' | 'ia'

export default function ProposalPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialProductSlug = searchParams.get('produto') || ''

  // Controle de Step (1: Contato & Identificação, 2: Dados Adaptativos)
  const [step, setStep] = useState<number>(1)

  // Step 1: Dados Gerais
  const [produtoSlug, setProdutoSlug] = useState<string>('')
  const [categoriaProduto, setCategoriaProduto] = useState<Categoria>('design_web')
  const [razaoSocialNome, setRazaoSocialNome] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [telefone, setTelefone] = useState<string>('')
  const [cpfCnpj, setCpfCnpj] = useState<string>('')
  const [faturamentoMensal, setFaturamentoMensal] = useState<string>('')
  const [porteEmpresa, setPorteEmpresa] = useState<string>('')
  const [doresPrincipais, setDoresPrincipais] = useState<string>('')

  // Step 2: Dados Adaptativos por Categoria
  const [dadosCategoria, setDadosCategoria] = useState<Record<string, any>>({})

  // UI States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(60)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Mapeia strings legíveis de categoria para o enum estrito
  const mapearCategoria = (catStr: string): Categoria => {
    const lower = catStr ? catStr.toLowerCase() : ''
    if (lower.includes('design')) return 'design_web'
    if (lower.includes('desenvolvimento')) return 'desenvolvimento'
    if (lower.includes('erp') || lower.includes('sistemas')) return 'erp_saas'
    if (lower.includes('automa')) return 'automacao'
    if (lower.includes('ia') || lower.includes('inteligência')) return 'ia'
    return 'design_web'
  }

  // Pré-selecionar produto via query param ou utilizar o primeiro da lista
  useEffect(() => {
    window.scrollTo(0, 0)
    if (initialProductSlug) {
      const prod = getLocalProductBySlug(initialProductSlug)
      if (prod) {
        setProdutoSlug(prod.slug)
        setCategoriaProduto(mapearCategoria(prod.categoria))
      } else {
        setProdutoSlug(initialProductSlug)
      }
    } else if (productsData.length > 0) {
      setProdutoSlug(productsData[0].slug)
      setCategoriaProduto(mapearCategoria(productsData[0].categoria))
    }
  }, [initialProductSlug])

  // Redirecionamento em sucesso
  useEffect(() => {
    let timer: any
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    } else if (isSuccess && countdown === 0) {
      navigate('/')
    }
    return () => clearTimeout(timer)
  }, [isSuccess, countdown, navigate])

  const handleProductChange = (slug: string) => {
    setProdutoSlug(slug)
    const prod = getLocalProductBySlug(slug)
    if (prod) {
      setCategoriaProduto(mapearCategoria(prod.categoria))
    }
  }

  // Validação do Step 1
  const validateStep1 = (): boolean => {
    if (!razaoSocialNome.trim()) {
      setErrorMessage('Por favor, informe seu nome ou razão social.')
      return false
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.')
      return false
    }
    if (!telefone.trim() || telefone.length < 8) {
      setErrorMessage('Por favor, informe seu número de WhatsApp com DDD.')
      return false
    }
    if (!doresPrincipais.trim()) {
      setErrorMessage('Por favor, descreva o gargalo ou objetivo principal.')
      return false
    }
    setErrorMessage(null)
    return true
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep1()) {
      setStep(2)
      window.scrollTo(0, 0)
    }
  }

  const handleCategoryDataChange = (key: string, value: any) => {
    setDadosCategoria(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const payload: LeadPayload = {
        produtoSlug,
        categoriaProduto,
        razaoSocialNome,
        cpfCnpj,
        email,
        telefone,
        faturamentoMensal,
        porteEmpresa,
        doresPrincipais,
        dadosEspecificosCategoria: dadosCategoria
      }

      await createLead(payload)
      setIsSuccess(true)
    } catch (err: any) {
      console.error('Erro ao salvar lead:', err)
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      if (isLocal) {
        console.warn('Utilizando fallback local de sucesso.')
        setIsSuccess(true)
      } else {
        setErrorMessage(err.message || 'Ocorreu um erro ao enviar seu cadastro. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] bg-brand-dark flex items-center justify-center py-16 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-brand-neon/[0.03] blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/[0.03] blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Lado Esquerdo: Apresentação & Benefícios */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-brand-neon font-mono block">
                DIAGNÓSTICO E SOLICITAÇÃO TÉCNICA
              </span>
              <h1 className="text-3xl sm:text-5xl font-space font-extrabold tracking-tight text-white leading-tight uppercase">
                Sua Operação <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-neon">
                  Sob Medida
                </span>
              </h1>
              <p className="font-sans text-gray-400 text-sm font-light leading-relaxed">
                Preencha o diagnóstico adaptativo em 2 etapas. Nossos engenheiros de IA e software analisarão suas especificações para formatar uma proposta técnica personalizada.
              </p>
            </div>

            {/* Benefícios */}
            <div className="space-y-4 font-sans text-xs">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center mt-0.5 shrink-0 text-brand-neon">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider">Formulário Adaptativo em 2 Etapas</h4>
                  <p className="text-gray-400 mt-0.5 leading-relaxed">Campos específicos alinhados com a categoria da solução escolhida.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center mt-0.5 shrink-0 text-brand-neon">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider">Armazenamento Direto na Tabela Leads</h4>
                  <p className="text-gray-400 mt-0.5 leading-relaxed">Integração nativa com o banco Supabase e políticas de segurança RLS.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center mt-0.5 shrink-0 text-brand-neon">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider">Análise Técnica Especializada</h4>
                  <p className="text-gray-400 mt-0.5 leading-relaxed">Retorno rápido com orçamento e escopo detalhado de implementação.</p>
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
                "O formulário direto por categoria facilitou muito o detalhamento da nossa demanda de automação n8n."
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

          {/* Lado Direito: Formulário Adaptativo em 2 Steps */}
          <div className="lg:col-span-7 font-sans">
            {!isSuccess ? (
              <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent" />

                {/* Progress Bar & Indicators */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 tracking-wider">
                    <span className={step >= 1 ? 'text-brand-neon font-bold' : ''}>
                      01. CONTATO & IDENTIFICAÇÃO
                    </span>
                    <span className={step >= 2 ? 'text-brand-neon font-bold' : ''}>
                      02. ESPECIFICAÇÕES DA SOLUÇÃO
                    </span>
                  </div>
                  <div className="h-1 bg-brand-gray/60 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-brand-neon h-full transition-all duration-500" 
                      style={{ width: `${(step / 2) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* STEP 1: DADOS GERAIS */}
                {step === 1 && (
                  <form onSubmit={handleNextStep} className="space-y-5">
                    
                    {/* Seleção do Produto */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                        SOLUÇÃO DESEJADA *
                      </label>
                      <select
                        value={produtoSlug}
                        onChange={(e) => handleProductChange(e.target.value)}
                        className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white focus:border-brand-neon focus:outline-none transition-colors"
                      >
                        {productsData.map((prod) => (
                          <option key={prod.slug} value={prod.slug} className="bg-brand-dark text-white">
                            {prod.nome} ({prod.categoria})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nome / Razão Social */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                          RAZÃO SOCIAL OU NOME *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: ACME Corporativo / João Silva"
                          value={razaoSocialNome}
                          onChange={(e) => setRazaoSocialNome(e.target.value)}
                          className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono"
                          required
                        />
                      </div>

                      {/* CPF / CNPJ */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                          CPF OU CNPJ (OPCIONAL)
                        </label>
                        <input
                          type="text"
                          placeholder="00.000.000/0001-00"
                          value={cpfCnpj}
                          onChange={(e) => setCpfCnpj(e.target.value)}
                          className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* E-mail */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                          E-MAIL CORPORATIVO *
                        </label>
                        <input
                          type="email"
                          placeholder="contato@suaempresa.com.br"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono"
                          required
                        />
                      </div>

                      {/* WhatsApp / Telefone */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                          WHATSAPP / TELEFONE *
                        </label>
                        <input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Faturamento Mensal */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                          FATURAMENTO MENSAL APROXIMADO
                        </label>
                        <select
                          value={faturamentoMensal}
                          onChange={(e) => setFaturamentoMensal(e.target.value)}
                          className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white focus:border-brand-neon focus:outline-none transition-colors"
                        >
                          <option value="">Selecione uma faixa...</option>
                          <option value="Até R$ 20.000">Até R$ 20.000 / mês</option>
                          <option value="R$ 20.000 a R$ 50.000">R$ 20.000 a R$ 50.000 / mês</option>
                          <option value="R$ 50.000 a R$ 200.000">R$ 50.000 a R$ 200.000 / mês</option>
                          <option value="Acima de R$ 200.000">Acima de R$ 200.000 / mês</option>
                        </select>
                      </div>

                      {/* Porte da Empresa */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                          PORTE DA EMPRESA
                        </label>
                        <select
                          value={porteEmpresa}
                          onChange={(e) => setPorteEmpresa(e.target.value)}
                          className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white focus:border-brand-neon focus:outline-none transition-colors"
                        >
                          <option value="">Selecione o porte...</option>
                          <option value="Autônomo / MEI">Autônomo / MEI</option>
                          <option value="Pequena Empresa (1-10 func.)">Pequena Empresa (1-10 colab.)</option>
                          <option value="Média Empresa (11-50 func.)">Média Empresa (11-50 colab.)</option>
                          <option value="Corporativo (50+ func.)">Corporativo (50+ colab.)</option>
                        </select>
                      </div>
                    </div>

                    {/* Dores Principais */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                        PRINCIPAL GARGALO OU OBJETIVO QUE DESEJA RESOLVER *
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Ex: Precisamos automatizar o atendimento via WhatsApp e sincronizar os dados com nosso CRM."
                        value={doresPrincipais}
                        onChange={(e) => setDoresPrincipais(e.target.value)}
                        className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono resize-none"
                        required
                      />
                    </div>

                    {/* Botão Avançar */}
                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-neon text-black font-space font-bold text-xs uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300 cursor-pointer"
                      >
                        AVANÇAR PARA ETAPA 2
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </form>
                )}

                {/* STEP 2: CAMPOS ADAPTATIVOS DA CATEGORIA */}
                {step === 2 && (
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Badge da Categoria */}
                    <div className="p-4 bg-brand-gray/60 border border-white/10 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-brand-neon font-bold block">
                          CATEGORIA DETECTADA
                        </span>
                        <span className="text-sm font-space font-bold uppercase text-white">
                          {categoriaProduto.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-gray-400 bg-black/40 px-3 py-1 rounded border border-white/5">
                        Campos Adaptativos
                      </span>
                    </div>

                    {/* DESIGN / WEB DESIGN */}
                    {categoriaProduto === 'design_web' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                            TIPO DE PROJETO WEB
                          </label>
                          <select
                            value={dadosCategoria.tipoWeb || 'Site Institucional'}
                            onChange={(e) => handleCategoryDataChange('tipoWeb', e.target.value)}
                            className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white focus:border-brand-neon focus:outline-none"
                          >
                            <option value="Site Institucional">Site Institucional Corporativo</option>
                            <option value="Landing Page de Vendas">Landing Page de Alta Conversão</option>
                            <option value="Portal Corporativo">Portal Corporativo Complexo</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                              MARCA & LOGO
                            </label>
                            <select
                              value={dadosCategoria.temMarca || 'Sim'}
                              onChange={(e) => handleCategoryDataChange('temMarca', e.target.value)}
                              className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white focus:border-brand-neon focus:outline-none"
                            >
                              <option value="Sim">Sim, temos manual de marca completo</option>
                              <option value="Apenas Logo">Apenas o arquivo do logo</option>
                              <option value="Não">Não, precisamos criar do zero</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                              PRAZO DESEJADO
                            </label>
                            <select
                              value={dadosCategoria.prazoDesejado || '15 dias'}
                              onChange={(e) => handleCategoryDataChange('prazoDesejado', e.target.value)}
                              className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white focus:border-brand-neon focus:outline-none"
                            >
                              <option value="Urgente (até 7 dias)">Urgente (até 7 dias)</option>
                              <option value="15 dias">Normal (15 a 20 dias)</option>
                              <option value="30 dias">Planejado (30+ dias)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DESENVOLVIMENTO */}
                    {categoriaProduto === 'desenvolvimento' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                              INTEGRAÇÃO FINANCEIRA
                            </label>
                            <select
                              value={dadosCategoria.integracaoFinanceira || 'PIX e Cartão'}
                              onChange={(e) => handleCategoryDataChange('integracaoFinanceira', e.target.value)}
                              className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white focus:border-brand-neon focus:outline-none"
                            >
                              <option value="PIX e Cartão">PIX + Cartão de Crédito</option>
                              <option value="Apenas PIX">Apenas PIX Instantâneo</option>
                              <option value="Boleto e PIX">Boleto + PIX</option>
                              <option value="Não necessário">Sem pagamentos online</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                              VOLUME ESTIMADO
                            </label>
                            <select
                              value={dadosCategoria.volumeEstimado || '1 a 20'}
                              onChange={(e) => handleCategoryDataChange('volumeEstimado', e.target.value)}
                              className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white focus:border-brand-neon focus:outline-none"
                            >
                              <option value="1 a 20">Até 20 itens / atendentes</option>
                              <option value="20 a 100">20 a 100 itens / atendentes</option>
                              <option value="100+">Mais de 100 itens / atendentes</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ERP SAAS */}
                    {categoriaProduto === 'erp_saas' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                            MÓDULOS DE INTERESSE
                          </label>
                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            {['Financeiro & DRE', 'Controle de Faturas', 'Gestão de Clientes', 'Relatórios'].map((mod) => (
                              <label key={mod} className="flex items-center gap-2 bg-brand-gray/80 p-2.5 rounded border border-white/5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  onChange={(e) => {
                                    const current = dadosCategoria.modulos || []
                                    if (e.target.checked) {
                                      handleCategoryDataChange('modulos', [...current, mod])
                                    } else {
                                      handleCategoryDataChange('modulos', current.filter((m: string) => m !== mod))
                                    }
                                  }}
                                  className="accent-[#CCFF00]"
                                />
                                <span className="text-gray-300">{mod}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AUTOMAÇÃO */}
                    {categoriaProduto === 'automacao' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                            FERRAMENTAS A CONECTAR VIA AUTOMAÇÃO
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: WhatsApp, CRM HubSpot, Google Sheets e E-mail"
                            value={dadosCategoria.ferramentasConectar || ''}
                            onChange={(e) => handleCategoryDataChange('ferramentasConectar', e.target.value)}
                            className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs text-white font-mono placeholder-gray-600 focus:border-brand-neon focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* IA */}
                    {categoriaProduto === 'ia' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                              CANAL DE ATENDIMENTO DA IA
                            </label>
                            <select
                              value={dadosCategoria.canalIA || 'WhatsApp'}
                              onChange={(e) => handleCategoryDataChange('canalIA', e.target.value)}
                              className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white focus:border-brand-neon focus:outline-none"
                            >
                              <option value="WhatsApp">WhatsApp Oficial</option>
                              <option value="Web Chat">Chat no Site</option>
                              <option value="Ambos">Ambos os Canais</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
                              OBJETIVO PRINCIPAL DA IA
                            </label>
                            <select
                              value={dadosCategoria.objetivoIA || 'Qualificar Leads'}
                              onChange={(e) => handleCategoryDataChange('objetivoIA', e.target.value)}
                              className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white focus:border-brand-neon focus:outline-none"
                            >
                              <option value="Qualificar Leads">Qualificar Leads e Agendar</option>
                              <option value="Suporte Técnico">Tirar Dúvidas Técnicas</option>
                              <option value="Vendas Diretas">Vender Produtos e Serviços</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="pt-4 flex items-center justify-between border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-2 px-4 py-3 bg-brand-gray text-gray-400 hover:text-white font-mono text-xs uppercase rounded transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        VOLTAR ETAPA 1
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-brand-neon text-black font-space font-bold text-xs uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            ENVIANDO...
                          </>
                        ) : (
                          <>
                            SOLICITAR PROPOSTA TÉCNICA
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}

              </div>
            ) : (
              /* Tela de Sucesso */
              <div className="bg-[#050505] border border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-6 backdrop-blur-md shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-brand-neon/10 border border-brand-neon/30 flex items-center justify-center mx-auto text-brand-neon">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-semibold text-brand-neon">
                    SOLICITAÇÃO REGISTRADA COM SUCESSO
                  </span>
                  <h3 className="text-2xl font-space font-bold uppercase text-white">
                    OBRIGADO! SUA SOLICITAÇÃO FOI SALVA.
                  </h3>
                  <p className="font-sans text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                    Registramos suas especificações na tabela de leads. Nosso time de especialistas em IA e software entrará em contato em breve.
                  </p>
                </div>
                
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3.5 bg-brand-neon text-black font-space font-bold text-xs uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300"
                  >
                    VOLTAR À PÁGINA INICIAL
                  </button>
                  <p className="text-[10px] font-mono text-gray-500 uppercase">
                    Redirecionando automaticamente em {countdown}s...
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  )
}
