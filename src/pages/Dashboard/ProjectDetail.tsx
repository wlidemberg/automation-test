import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchProjectDetails } from '../../services/projectService'
import type { Project, ProjectRoadmap } from '../../types/database'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [roadmap, setRoadmap] = useState<ProjectRoadmap[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  const [solicitacao, setSolicitacao] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    async function loadProjectData() {
      try {
        setLoading(true)
        setError(null)
        if (!id) return
        
        const data = await fetchProjectDetails(id)
        if (data) {
          setProject(data.project)
          setRoadmap(data.roadmap)
        } else {
          setError('Projeto não encontrado no banco de dados.')
        }
      } catch (err) {
        console.error(err)
        setError('Não foi possível carregar os detalhes do projeto.')
      } finally {
        setLoading(false)
      }
    }
    loadProjectData()
  }, [id])

  const handleSendSolicitacao = (e: React.FormEvent) => {
    e.preventDefault()
    if (!solicitacao.trim()) return

    setIsSending(true)
    setFeedback('')

    // Simulação do envio ao backend
    setTimeout(() => {
      setIsSending(false)
      setFeedback('Sua solicitação de alteração foi recebida pelo Tech Lead do projeto e está sob análise.')
      setSolicitacao('')
    }, 1500)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-neon animate-spin animate-duration-1000" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
          Carregando dados do roadmap...
        </span>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center max-w-md mx-auto px-6">
        <AlertCircle className="w-12 h-12 text-red-500 animate-pulse" />
        <h2 className="font-space font-bold text-white text-lg uppercase tracking-wider">Falha ao Buscar Projeto</h2>
        <p className="font-sans text-xs text-gray-400 font-light leading-relaxed">
          {error || 'Não foi possível localizar os registros deste projeto.'}
        </p>
        <Link 
          to="/dashboard"
          className="px-6 py-3 bg-brand-neon text-black font-semibold rounded text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all duration-300"
        >
          VOLTAR PARA O PAINEL
        </Link>
      </div>
    )
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
          VOLTAR PARA O PAINEL
        </Link>
        
        <div>
          <span className="text-[10px] tracking-[0.3em] font-mono text-brand-neon uppercase font-semibold block mb-1">
            Backstage / Gestão de Projeto
          </span>
          <h1 className="text-3xl sm:text-4xl font-space font-extrabold tracking-tight text-white uppercase">
            {project.nome}
          </h1>
          <p className="font-sans text-xs text-gray-400 font-light mt-1 max-w-2xl leading-relaxed">
            {project.descricao}
          </p>
        </div>
      </div>

      {/* Project Meta Information Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Data de Início', value: project.data_inicio || 'Não iniciada' },
          { label: 'Entrega Final', value: project.previsao_entrega || 'Em definição' },
          { label: 'Status Geral', value: project.status_geral || 'Planejado', highlight: true },
          { label: 'ID do Projeto', value: `#AT-${project.id.toUpperCase().substring(0, 8)}` }
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
            {roadmap.length === 0 ? (
              <p className="text-xs text-gray-500 font-mono">Nenhuma etapa cadastrada no roadmap deste projeto.</p>
            ) : (
              roadmap.map((fase, idx) => {
                const isDone = fase.status === 'done'
                const isCurrent = fase.status === 'current'

                return (
                  <div key={fase.id || idx} className="relative">
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
                        {fase.nome_fase}
                      </h4>
                      <p className="font-sans text-[11px] text-gray-400 font-light leading-relaxed">
                        {fase.descricao_fase}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
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
                {isSending ? 'ENVIANDO...' : 'ENVIAR SOLICITAÇÃO DE ALTERAÇÃO'}
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
