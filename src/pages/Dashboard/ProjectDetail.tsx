import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  FileText
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [solicitacao, setSolicitacao] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState('')

  // Map IDs to clean project titles and info
  const projectDetails = {
    'portal-assescor': {
      name: 'PORTAL ASSESCOR',
      description: 'Plataforma corporativa para automação de fluxos e captação de leads.',
      inicio: '12 Out 2025',
      entrega: '25 Fev 2026',
      status: 'Concluído & Entregue',
      fases: [
        { name: 'Definição de Escopo', status: 'done', desc: 'Briefing e arquitetura de dados' },
        { name: 'Design Visual', status: 'done', desc: 'Protótipos de alta fidelidade aprovados' },
        { name: 'Desenvolvimento Core', status: 'done', desc: 'Construção das APIs e frontend em React' },
        { name: 'Homologação Final', status: 'done', desc: 'Testes de carga e integridade' },
        { name: 'Lançamento', status: 'done', desc: 'Deploy final e transferência de DNS' }
      ]
    },
    'erp-comercial': {
      name: 'SISTEMA ERP COMERCIAL',
      description: 'Módulos ativos: Frente de Caixa, Gestão de Retaguarda e Emissão de Notas (NF-e / NFC-e).',
      inicio: '01 Mar 2026',
      entrega: 'Recorrência Mensal',
      status: 'Licença Ativa',
      fases: [
        { name: 'Ativação da Infraestrutura', status: 'done', desc: 'Provisionamento de servidores e banco de dados isolado' },
        { name: 'Configuração Fiscal & Notas', status: 'done', desc: 'Parametrização de alíquotas de impostos e certificados fiscais (NF-e / NFC-e)' },
        { name: 'Importação de Cadastros', status: 'done', desc: 'Migração de clientes, fornecedores e produtos para a nova base' },
        { name: 'Treinamento da Equipe', status: 'done', desc: 'Capacitação prática para operadores de caixa e faturamento' },
        { name: 'Operação em Produção', status: 'done', desc: 'Sistemas ativos 24/7 com suporte dedicado de retaguarda' }
      ]
    }
  }

  // Fallback details if project ID is not pre-mapped
  const currentProject = projectDetails[id as keyof typeof projectDetails] || {
    name: id ? id.replace(/-/g, ' ').toUpperCase() : 'PROJETO CONTRATADO',
    description: 'Projeto de engenharia digital contratado junto à nossa equipe.',
    inicio: 'Sob consulta',
    entrega: 'Em definição',
    status: 'Em Desenvolvimento',
    fases: [
      { name: 'Análise de Requisitos', status: 'done', desc: 'Reunião de alinhamento técnico' },
      { name: 'Design Inicial', status: 'current', desc: 'Criação de protótipos de telas' },
      { name: 'Desenvolvimento', status: 'pending', desc: 'Codificação da arquitetura modular' },
      { name: 'Lançamento', status: 'pending', desc: 'Deploy oficial em ambiente produtivo' }
    ]
  }

  const handleSendSolicitacao = (e: React.FormEvent) => {
    e.preventDefault()
    if (!solicitacao.trim()) return

    setIsSending(true)
    setFeedback('')

    // Simulate sending to backend
    setTimeout(() => {
      setIsSending(false)
      setFeedback('Sua solicitação de alteração foi recebida pelo Tech Lead do projeto e está sob análise.')
      setSolicitacao('')
    }, 1500)
  }

  return (
    <div className="space-y-10">
      
      {/* Header and Back Link Navigation */}
      <div className="space-y-4">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para o Painel
        </Link>
        
        <div>
          <span className="text-[10px] tracking-[0.3em] font-mono text-brand-neon uppercase font-semibold block mb-1">
            Backstage / Gestão de Projeto
          </span>
          <h1 className="text-3xl sm:text-4xl font-space font-extrabold tracking-tight text-white uppercase">
            {currentProject.name}
          </h1>
          <p className="font-sans text-xs text-gray-400 font-light mt-1 max-w-2xl leading-relaxed">
            {currentProject.description}
          </p>
        </div>
      </div>

      {/* Project Meta Information Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Data de Início', value: currentProject.inicio },
          { label: 'Entrega Final', value: currentProject.entrega },
          { label: 'Status Geral', value: currentProject.status, highlight: true },
          { label: 'ID do Projeto', value: `#AT-${id?.toUpperCase().substring(0, 8)}` }
        ].map((meta, idx) => (
          <div key={idx} className="bg-zinc-900/40 border border-white/10 p-5 rounded-lg backdrop-blur-sm">
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono block mb-1">
              {meta.label}
            </span>
            <span className={`text-xs font-mono font-bold uppercase ${meta.highlight ? 'text-brand-neon' : 'text-gray-200'}`}>
              {meta.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Project Timeline Progress (8 cols) */}
        <div className="lg:col-span-8 bg-zinc-900/40 border border-white/10 rounded-lg p-6 sm:p-8 backdrop-blur-sm space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-space font-bold text-white text-sm uppercase tracking-wider">
              CRONOGRAMA E ETAPAS DO PROJETO
            </h3>
            <p className="text-[10px] text-gray-500 font-mono mt-1">
              Histórico de desenvolvimento e entregas auditadas
            </p>
          </div>

          <div className="relative pl-6 border-l border-white/10 space-y-8 py-2">
            {currentProject.fases.map((fase, idx) => {
              const isDone = fase.status === 'done'
              const isCurrent = fase.status === 'current'

              return (
                <div key={idx} className="relative">
                  {/* Timeline point */}
                  <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full flex items-center justify-center border ${
                    isDone 
                      ? 'bg-brand-neon border-brand-neon' 
                      : isCurrent 
                        ? 'bg-black border-brand-neon animate-pulse' 
                        : 'bg-zinc-900 border-white/10'
                  }`}>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />}
                    {isCurrent && <Clock className="w-3 h-3 text-brand-neon shrink-0" />}
                  </div>

                  <div className="space-y-1">
                    <h4 className={`text-xs font-space font-bold uppercase tracking-wider ${
                      isDone ? 'text-white' : isCurrent ? 'text-brand-neon' : 'text-gray-600'
                    }`}>
                      {fase.name}
                    </h4>
                    <p className="font-sans text-[11px] text-gray-400 font-light leading-relaxed">
                      {fase.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Central de Solicitações (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-900/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-brand-neon/10 border border-brand-neon/20 text-[9px] text-brand-neon px-2.5 py-1 rounded font-mono tracking-widest uppercase font-semibold">
                <FileText className="w-3 h-3 text-brand-neon" />
                Central de Solicitações
              </span>
              <h3 className="font-space font-bold text-white text-sm uppercase tracking-wider">
                ALTERAÇÃO DE REQUISITOS
              </h3>
              <p className="font-sans text-xs text-gray-400 font-light leading-relaxed">
                Quer adicionar novas regras de negócio, solicitar ajustes visuais ou propor integrações? Detalhe abaixo.
              </p>
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-brand-neon/10 border border-brand-neon/20 text-brand-neon rounded text-[10px] tracking-wider uppercase font-mono text-center leading-relaxed"
              >
                {feedback}
              </motion.div>
            )}

            <form onSubmit={handleSendSolicitacao} className="space-y-4">
              <textarea
                value={solicitacao}
                onChange={(e) => setSolicitacao(e.target.value)}
                placeholder="Descreva detalhadamente a alteração ou nova feature desejada..."
                rows={6}
                disabled={isSending}
                className="w-full bg-black/50 border border-white/10 focus:border-brand-neon focus:ring-1 focus:ring-brand-neon/30 outline-none transition-all duration-300 rounded p-3.5 text-xs text-white placeholder-gray-600 font-sans tracking-wide resize-none"
              />

              <button
                type="submit"
                disabled={isSending || !solicitacao.trim()}
                className="w-full py-3.5 bg-brand-neon text-black font-bold rounded text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSending ? 'Enviando...' : 'Enviar Solicitação de Alteração'}
                {!isSending && <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center gap-2 text-gray-500 text-[10px] font-mono tracking-widest uppercase">
            <HelpCircle className="w-4 h-4 text-brand-neon/60" />
            Tempo médio de resposta: 24h
          </div>
        </div>

      </div>

    </div>
  )
}
