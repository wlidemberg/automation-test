import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  Send
} from 'lucide-react'
import { createLead, type LeadPayload } from '../services/leadServices'
import { productsData, getLocalProductBySlug } from '../data/productsData'

export interface LeadFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialProductSlug?: string
}

type Categoria = 'design_web' | 'desenvolvimento' | 'erp_saas' | 'automacao' | 'ia'

export default function LeadFormModal({ isOpen, onClose, initialProductSlug = '' }: LeadFormModalProps) {
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pré-selecionar produto se enviado via prop
  useEffect(() => {
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
  }, [initialProductSlug, isOpen])

  // Mapeia strings legíveis de categoria para o enum estrito
  const mapearCategoria = (catStr: string): Categoria => {
    const lower = catStr.toLowerCase()
    if (lower.includes('design')) return 'design_web'
    if (lower.includes('desenvolvimento')) return 'desenvolvimento'
    if (lower.includes('erp') || lower.includes('sistemas')) return 'erp_saas'
    if (lower.includes('automa')) return 'automacao'
    if (lower.includes('ia') || lower.includes('inteligência')) return 'ia'
    return 'design_web'
  }

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
      setErrorMessage('Por favor, descreva brevemente a dor principal ou objetivo do projeto.')
      return false
    }
    setErrorMessage(null)
    return true
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep1()) {
      setStep(2)
    }
  }

  // Atualização dos inputs adaptativos do Step 2
  const handleCategoryDataChange = (key: string, value: any) => {
    setDadosCategoria(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Envio final do formulário
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
      console.error('Erro ao enviar formulário de lead:', err)
      setErrorMessage(err.message || 'Ocorreu um erro ao enviar seu cadastro. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetAndClose = () => {
    setStep(1)
    setIsSuccess(false)
    setErrorMessage(null)
    setRazaoSocialNome('')
    setEmail('')
    setTelefone('')
    setCpfCnpj('')
    setDoresPrincipais('')
    setDadosCategoria({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#050505] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          {/* Top Ambient Light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[150px] bg-brand-neon/[0.04] blur-3xl pointer-events-none" />

          {/* Header do Modal */}
          <div className="p-6 sm:p-8 border-b border-white/10 flex items-center justify-between relative z-10">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] font-semibold text-brand-neon block mb-1">
                SOLICITAÇÃO TÉCNICA • ETAPA {step} DE 2
              </span>
              <h2 className="text-xl sm:text-2xl font-space font-bold uppercase text-white tracking-tight">
                {step === 1 ? 'Contato & Identificação' : 'Especificações da Solução'}
              </h2>
            </div>
            <button
              onClick={handleResetAndClose}
              className="w-9 h-9 rounded-full bg-brand-gray border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-neon/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="w-full bg-brand-gray/50 h-1 relative">
            <div 
              className="bg-brand-neon h-full transition-all duration-500"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>

          {/* Mensagem de Erro Alerta */}
          {errorMessage && (
            <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-mono">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Tela de Sucesso */}
          {isSuccess ? (
            <div className="p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-brand-neon/10 border border-brand-neon/30 flex items-center justify-center mx-auto text-brand-neon">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-space font-bold uppercase text-white">
                  SOLICITAÇÃO REGISTRADA COM SUCESSO!
                </h3>
                <p className="font-sans text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                  Recebemos os detalhes do seu negócio. Nosso time técnico analisará suas necessidades e enviará uma proposta recomendada sob medida.
                </p>
              </div>
              <button
                onClick={handleResetAndClose}
                className="px-8 py-4 bg-brand-neon text-black font-space font-bold text-xs uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300"
              >
                CONCLUIR E FECHAR
              </button>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              
              {/* STEP 1: DADOS GERAIS */}
              {step === 1 && (
                <form onSubmit={handleNextStep} className="space-y-6">
                  
                  {/* Seleção do Produto Intencionado */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                      SOLUÇÃO DESEJADA *
                    </label>
                    <select
                      value={produtoSlug}
                      onChange={(e) => handleProductChange(e.target.value)}
                      className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3.5 text-xs font-mono text-white focus:border-brand-neon focus:outline-none transition-colors"
                    >
                      {productsData.map((prod) => (
                        <option key={prod.slug} value={prod.slug} className="bg-brand-dark text-white">
                          {prod.nome} ({prod.categoria})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nome ou Razão Social */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                        RAZÃO SOCIAL OU NOME *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: ACME Corporativo / João Silva"
                        value={razaoSocialNome}
                        onChange={(e) => setRazaoSocialNome(e.target.value)}
                        className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono"
                        required
                      />
                    </div>

                    {/* CPF ou CNPJ */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                        CPF OU CNPJ (OPCIONAL)
                      </label>
                      <input
                        type="text"
                        placeholder="00.000.000/0001-00"
                        value={cpfCnpj}
                        onChange={(e) => setCpfCnpj(e.target.value)}
                        className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* E-mail */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                        E-MAIL CORPORATIVO *
                      </label>
                      <input
                        type="email"
                        placeholder="contato@suaempresa.com.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono"
                        required
                      />
                    </div>

                    {/* WhatsApp / Telefone */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                        WHATSAPP / TELEFONE *
                      </label>
                      <input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Faturamento Mensal */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                        FATURAMENTO MENSAL APROXIMADO
                      </label>
                      <select
                        value={faturamentoMensal}
                        onChange={(e) => setFaturamentoMensal(e.target.value)}
                        className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3.5 text-xs font-mono text-white focus:border-brand-neon focus:outline-none transition-colors"
                      >
                        <option value="">Selecione uma faixa...</option>
                        <option value="Até R$ 20.000">Até R$ 20.000 / mês</option>
                        <option value="R$ 20.000 a R$ 50.000">R$ 20.000 a R$ 50.000 / mês</option>
                        <option value="R$ 50.000 a R$ 200.000">R$ 50.000 a R$ 200.000 / mês</option>
                        <option value="Acima de R$ 200.000">Acima de R$ 200.000 / mês</option>
                      </select>
                    </div>

                    {/* Porte da Empresa */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                        PORTE DA EMPRESA
                      </label>
                      <select
                        value={porteEmpresa}
                        onChange={(e) => setPorteEmpresa(e.target.value)}
                        className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3.5 text-xs font-mono text-white focus:border-brand-neon focus:outline-none transition-colors"
                      >
                        <option value="">Selecione o porte...</option>
                        <option value="Autônomo / MEI">Autônomo / MEI</option>
                        <option value="Pequena Empresa (1-10 func.)">Pequena Empresa (1-10 colab.)</option>
                        <option value="Média Empresa (11-50 func.)">Média Empresa (11-50 colab.)</option>
                        <option value="Corporativo (50+ func.)">Corporativo (50+ colab.)</option>
                      </select>
                    </div>
                  </div>

                  {/* Dores Principais / Objetivo */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                      QUAL O PRINCIPAL GARGALO OU OBJETIVO QUE DESEJA RESOLVER? *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Precisamos parar de perder leads por falta de resposta rápida e criar um fluxo automatizado."
                      value={doresPrincipais}
                      onChange={(e) => setDoresPrincipais(e.target.value)}
                      className="w-full bg-brand-gray/90 border border-white/10 rounded px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors font-mono resize-none"
                      required
                    />
                  </div>

                  {/* Botão Avançar para Etapa 2 */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-brand-neon text-black font-space font-bold text-xs uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300 cursor-pointer"
                    >
                      AVANÇAR PARA ETAPA 2
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </form>
              )}

              {/* STEP 2: INPUTS ADAPTATIVOS POR CATEGORIA */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Header indicativo da categoria */}
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
                      Campos Personalizados
                    </span>
                  </div>

                  {/* Categoria: DESIGN / WEB DESIGN */}
                  {categoriaProduto === 'design_web' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
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
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                            POSSUI LOGO E MARCA PRONTA?
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

                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                            PRAZO DE LANÇAMENTO DESEJADO
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

                  {/* Categoria: DESENVOLVIMENTO (E-Commerce / Agendamentos) */}
                  {categoriaProduto === 'desenvolvimento' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                            PREVISA DE INTEGRAÇÃO FINANCEIRA
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

                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
                            VOLUME ESTIMADO DE PRODUTOS / ATENDENTES
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

                  {/* Categoria: ERP SAAS */}
                  {categoriaProduto === 'erp_saas' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
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

                  {/* Categoria: AUTOMAÇÃO */}
                  {categoriaProduto === 'automacao' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
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

                  {/* Categoria: IA */}
                  {categoriaProduto === 'ia' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
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

                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase text-gray-400 font-semibold block">
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

                  {/* Ações e Navegação */}
                  <div className="pt-6 flex items-center justify-between border-t border-white/10">
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
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  )
}
