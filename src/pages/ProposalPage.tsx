import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Building2, User, Mail, Phone, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Check, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { productsData } from '../data/productsData'
import { submitProposalRequest } from '../services/leadServices'

export default function ProposalPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialProductSlug = searchParams.get('produto') || ''

  // Form states
  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ'>('PJ')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [selectedProductSlug, setSelectedProductSlug] = useState('')
  const [needs, setNeeds] = useState('')

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Pre-select product when page loads or parameter changes
  useEffect(() => {
    window.scrollTo(0, 0)
    if (initialProductSlug) {
      setSelectedProductSlug(initialProductSlug)
    } else {
      setSelectedProductSlug('')
    }
  }, [initialProductSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeCompleto || !email || !telefone || !selectedProductSlug || !needs) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setIsSubmitting(true)

    const result = await submitProposalRequest({
      tipoPessoa: tipoPessoa,
      nomeRazao: nomeCompleto,
      email,
      telefone,
      produtoSlug: selectedProductSlug,
      resumoNecessidade: needs
    })

    setIsSubmitting(false)
    if (result.success) {
      setIsSuccess(true)
    } else {
      alert('Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.')
    }
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] bg-brand-dark flex items-center justify-center py-16 px-6 relative overflow-hidden">
        
        {/* Background light effects */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-neon/[0.02] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-brand-neon/[0.01] blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Lado Esquerdo / Hero da Página */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-brand-neon font-mono">
                DIAGNÓSTICO E BRIEFING
              </span>
              <h1 className="text-4xl sm:text-5xl font-space font-extrabold tracking-tight text-white leading-tight uppercase">
                Sua Operação <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-neon">
                  Sob Medida
                </span>
              </h1>
              <p className="font-sans text-gray-400 text-sm font-light leading-relaxed">
                Esqueça soluções engessadas. Na Automation Test, nós projetamos e desenvolvemos ecossistemas tecnológicos específicos para a volumetria, segurança e fluxos comerciais da sua empresa.
              </p>
            </div>

            {/* Benefícios */}
            <div className="space-y-4 font-sans">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center mt-0.5 shrink-0 text-brand-neon">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Desenho Técnico Personalizado</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Mapeamento dos fluxos ideais para eliminar redundâncias em sua operação.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center mt-0.5 shrink-0 text-brand-neon">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Entrada Facilitada de 50%</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Faturamento flexível com parcela de entrada e ativação imediata após a compensação.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center mt-0.5 shrink-0 text-brand-neon">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Acordo de Nível de Serviço (SLA)</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Segurança contratual de prazos, entregas dinâmicas e suporte prioritário pós-go-live.</p>
                </div>
              </div>
            </div>

            {/* Testemunho / Selos de Qualidade */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-1 text-[#CCFF00]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#CCFF00]" />
                ))}
              </div>
              <blockquote className="text-xs font-sans text-gray-400 italic font-light leading-relaxed">
                "O processo de briefing com a equipe técnica da Automation Test foi excepcional. A proposta foi gerada em menos de 24h e o sistema de ERP White-Label revolucionou nossa escala de faturamento."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-brand-neon">
                  VC
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white uppercase">Vekant Empreendimentos</p>
                  <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Parceiro Enterprise</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito / Formulário */}
          <div className="lg:col-span-7">
            {!isSuccess ? (
              <div className="bg-brand-gray/90 border border-brand-gray rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden">
                {/* Top highlight bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent" />

                <div className="space-y-2">
                  <h2 className="font-space font-extrabold text-2xl tracking-tight text-white uppercase">
                    SOLICITAR PROPOSTA TÉCNICA
                  </h2>
                  <p className="text-xs text-gray-400 font-sans font-light">
                    Preencha o formulário abaixo para iniciarmos a análise do seu escopo de desenvolvimento.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Toggle PF vs PJ */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">TIPO DE SOLICITANTE</label>
                    <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 border border-white/5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setTipoPessoa('PJ')}
                        className={`py-2 rounded text-xs font-mono font-bold uppercase transition-all tracking-wider ${
                          tipoPessoa === 'PJ'
                            ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/10'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Pessoa Jurídica (PJ)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoPessoa('PF')}
                        className={`py-2 rounded text-xs font-mono font-bold uppercase transition-all tracking-wider ${
                          tipoPessoa === 'PF'
                            ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/10'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Pessoa Física (PF)
                      </button>
                    </div>
                  </div>

                  {/* Nome / Razão Social */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                      {tipoPessoa === 'PJ' ? (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                          RAZÃO SOCIAL DA EMPRESA *
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5 text-[#CCFF00]" />
                          NOME COMPLETO *
                        </>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      placeholder={tipoPessoa === 'PJ' ? 'Ex: Vekant Empreendimentos SA' : 'Ex: Carlos Eduardo Silveira'}
                      className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Email & Telefone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#CCFF00]" />
                        E-MAIL CORPORATIVO *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: diretor@suaempresa.com"
                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#CCFF00]" />
                        TELEFONE / WHATSAPP *
                      </label>
                      <input
                        type="tel"
                        required
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="Ex: (11) 98765-4321"
                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Solução de Interesse */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">SOLUÇÃO DE INTERESSE *</label>
                    <select
                      required
                      value={selectedProductSlug}
                      onChange={(e) => setSelectedProductSlug(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:border-[#CCFF00] outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>Selecione a solução tecnológica principal...</option>
                      {productsData.map((prod) => (
                        <option key={prod.id} value={prod.slug} className="bg-brand-gray text-white">
                          {prod.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Resumo da Necessidade */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">RESUMO DAS NECESSIDADES DO SEU PROJETO *</label>
                    <textarea
                      required
                      rows={5}
                      value={needs}
                      onChange={(e) => setNeeds(e.target.value)}
                      placeholder="Quais são as principais dores, funcionalidades indispensáveis e sistemas que precisam ser integrados?"
                      className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs text-white placeholder-gray-600 focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 mt-2 bg-[#CCFF00] text-black rounded text-xs font-mono font-bold tracking-wider hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] transition-all duration-300 uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        PROCESSANDO BRIEFING...
                      </>
                    ) : (
                      <>
                        ENVIAR BRIEFING DE PROPOSTA
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Success Screen */
              <div className="bg-brand-gray/90 border border-brand-gray rounded-2xl p-8 sm:p-12 backdrop-blur-md shadow-2xl text-center space-y-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent" />
                
                <div className="p-4 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-full text-[#CCFF00]">
                  <CheckCircle2 className="w-16 h-16" />
                </div>
                <div className="space-y-3 max-w-md">
                  <h2 className="font-space font-extrabold text-2xl text-white uppercase tracking-tight">
                    SOLICITAÇÃO ENVIADA COM SUCESSO!
                  </h2>
                  <p className="text-xs text-gray-400 font-sans font-light leading-relaxed">
                    Nossa equipe técnica já foi notificada. Em breve nossa equipe disponibilizará a proposta comercial personalizada e detalhada diretamente na sua Área do Cliente.
                  </p>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3 bg-[#CCFF00] text-black rounded text-xs font-mono font-bold tracking-wider hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all cursor-pointer uppercase"
                  >
                    IR PARA O DASHBOARD
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded text-xs font-mono tracking-widest text-white uppercase hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    VOLTAR AO INÍCIO
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
