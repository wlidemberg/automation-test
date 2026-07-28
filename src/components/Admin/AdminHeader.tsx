import { 
  PanelLeft, 
  PanelLeftClose, 
  ArrowLeft, 
  RefreshCw, 
  ShieldAlert 
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface AdminHeaderProps {
  isCollapsed: boolean
  onToggleSidebar: () => void
  activeSectionLabel?: string
  onRefresh?: () => void
  isRefreshing?: boolean
}

export default function AdminHeader({
  isCollapsed,
  onToggleSidebar,
  activeSectionLabel = 'Dashboard',
  onRefresh,
  isRefreshing = false
}: AdminHeaderProps) {
  return (
    <header
      className={`h-20 border-b border-white/10 bg-brand-dark/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 sm:px-8 transition-all duration-300 ${
        isCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}
    >
      {/* Left Section: Sidebar Toggle Button + Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Toggle Button for Mobile and Desktop */}
        <button
          onClick={onToggleSidebar}
          className="p-2 border border-white/10 rounded text-gray-300 hover:text-brand-neon hover:border-brand-neon/40 hover:bg-white/5 transition-all duration-200 cursor-pointer flex items-center justify-center"
          title={isCollapsed ? 'Expandir Sidebar' : 'Recolher Sidebar'}
        >
          {isCollapsed ? (
            <PanelLeft className="w-5 h-5 text-brand-neon" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-gray-400 font-semibold tracking-wider">Painel Administrativo</span>
          <span className="text-gray-600">/</span>
          <span className="text-brand-neon font-bold uppercase tracking-widest bg-brand-neon/10 border border-brand-neon/20 px-2 py-0.5 rounded">
            {activeSectionLabel}
          </span>
        </div>
      </div>

      {/* Right Section: Master Mode Badge + Reload + Return to Client Area */}
      <div className="flex items-center gap-3">
        <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-mono hidden lg:inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
          <ShieldAlert className="w-3.5 h-3.5 text-brand-neon" />
          Modo Master / Engenharia
        </span>

        {/* Reload Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 border border-white/10 rounded text-gray-400 hover:text-brand-neon hover:border-brand-neon/30 hover:bg-white/5 transition-all duration-300 cursor-pointer disabled:opacity-50"
            title="Recarregar dados do Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-neon' : ''}`} />
          </button>
        )}

        {/* Return to Client Area */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 rounded text-[10px] tracking-wider font-semibold hover:bg-white/5 text-gray-300 hover:text-white uppercase transition-all duration-300 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Área do Cliente</span>
        </Link>
      </div>
    </header>
  )
}
