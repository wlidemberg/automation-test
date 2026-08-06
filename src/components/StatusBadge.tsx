import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  CheckCircle2, 
  Send, 
  RefreshCw, 
  Wallet, 
  XCircle,
  HelpCircle
} from 'lucide-react'

export type ProposalStatusType = 
  | 'pendente_aprovacao_admin'
  | 'em_analise_ia'
  | 'enviada_lead'
  | 'aprovada_admin'
  | 'aprovada_lead'
  | 'aceita'
  | 'recusada'
  | string

interface StatusBadgeProps {
  status: ProposalStatusType
  className?: string
  showTooltip?: boolean
}

export function getStatusConfig(status: ProposalStatusType) {
  const normalized = (status || '').toLowerCase()

  switch (normalized) {
    case 'pendente_aprovacao_admin':
      return {
        label: 'PENDENTE ADMIN',
        shortLabel: 'PENDENTE',
        badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        icon: Clock,
        pendencyTitle: 'Aguardando Aprovação do Admin',
        pendencyDescription: 'A proposta comercial foi gerada e aguarda revisão técnica e aprovação do administrador antes do envio ao lead.',
        type: 'warning'
      }
    case 'em_analise_ia':
      return {
        label: 'EM ANÁLISE IA',
        shortLabel: 'REVISANDO IA',
        badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        icon: RefreshCw,
        pendencyTitle: 'Aguardando Processamento da IA',
        pendencyDescription: 'A IA está reprocessando os entregáveis e precificação com base nas orientações enviadas pelo administrador.',
        type: 'warning'
      }
    case 'enviada_lead':
      return {
        label: 'ENVIADA AO LEAD',
        shortLabel: 'AGUARDANDO CLIENTE',
        badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
        icon: Send,
        pendencyTitle: 'Aguardando Aprovação do Cliente',
        pendencyDescription: 'A proposta foi enviada ao lead com Magic Link por e-mail. Pendência atual: Aguardando o aceite do cliente.',
        type: 'info'
      }
    case 'aprovada_admin':
      return {
        label: 'APROVADA PELO ADMIN',
        shortLabel: 'PRONTA P/ ENVIO',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        icon: CheckCircle2,
        pendencyTitle: 'Aprovada pelo Admin - Aguardando Disparo',
        pendencyDescription: 'A proposta foi revisada e aprovada pela engenharia e está pronta para o envio oficial ao cliente.',
        type: 'success'
      }
    case 'contrato_ativo':
    case 'pago':
      return {
        label: 'CONTRATO ATIVO • ENTRADA PAGA',
        shortLabel: 'CONTRATO ATIVO',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold',
        icon: CheckCircle2,
        pendencyTitle: 'Contrato Ativo - Entrada Paga (50%)',
        pendencyDescription: 'O pagamento do sinal de 50% foi confirmado e o contrato do projeto está ativo.',
        type: 'success'
      }
    case 'aceita':
    case 'aprovada_lead':
      return {
        label: 'ACEITA • AGUARDANDO PAGAMENTO',
        shortLabel: 'ACEITA (AGUARDANDO PAGAMENTO)',
        badgeBg: 'bg-brand-neon/10 border-brand-neon/40 text-brand-neon font-bold',
        icon: Wallet,
        pendencyTitle: 'Proposta Aceita - Aguardando Pagamento',
        pendencyDescription: 'O cliente aceitou a proposta comercial. Pendência atual: Aguardando confirmação do pagamento da entrada (50%).',
        type: 'success'
      }
    case 'recusada':
    case 'recusada_lead':
      return {
        label: 'RECUSADA PELO LEAD',
        shortLabel: 'RECUSADA',
        badgeBg: 'bg-red-500/10 border-red-500/30 text-red-400',
        icon: XCircle,
        pendencyTitle: 'Proposta Recusada pelo Cliente',
        pendencyDescription: 'O cliente recusou a proposta comercial enviada.',
        type: 'error'
      }
    default:
      return {
        label: (status || 'PENDENTE').toUpperCase().replace(/_/g, ' '),
        shortLabel: (status || 'PENDENTE').toUpperCase().replace(/_/g, ' '),
        badgeBg: 'bg-zinc-800 border-white/10 text-gray-300',
        icon: HelpCircle,
        pendencyTitle: 'Status da Proposta',
        pendencyDescription: 'A proposta está registrada e aguarda atualização do fluxo comercial.',
        type: 'default'
      }
  }
}

export default function StatusBadge({ status, className = '', showTooltip = true }: StatusBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const config = getStatusConfig(status)
  const IconComponent = config.icon

  return (
    <div 
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border inline-flex items-center gap-1.5 transition-all ${config.badgeBg} ${className}`}>
        <IconComponent className={`w-3 h-3 ${config.label.includes('ANÁLISE') ? 'animate-spin' : ''}`} />
        {config.label}
      </span>

      {/* Caixa de Texto Explicativa (Tooltip) ao passar o mouse */}
      {showTooltip && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3.5 bg-[#09090b]/95 border border-white/20 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md z-50 pointer-events-none text-left font-sans"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <IconComponent className="w-4 h-4 text-brand-neon shrink-0" />
                <span className="text-xs font-space font-bold uppercase text-white tracking-tight">
                  {config.pendencyTitle}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-light leading-relaxed font-sans">
                {config.pendencyDescription}
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-gray-400 uppercase">
                <span>STATUS: {status}</span>
                <span className="text-brand-neon">DETALHES DA PENDÊNCIA</span>
              </div>

              {/* Seta indicativa do Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#09090b]" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
