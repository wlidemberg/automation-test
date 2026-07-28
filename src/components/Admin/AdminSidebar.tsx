import React from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wallet, 
  AlertCircle, 
  Calendar, 
  LifeBuoy, 
  FolderKanban, 
  Terminal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

export interface SidebarItem {
  id: string
  label: string
  icon: React.ElementType
  badge?: string | number
  href?: string
}

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  activeItem?: string
  onSelectItem?: (id: string) => void
}

const sidebarMenuItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'clientes', label: 'Clientes', icon: Users, href: '/admin/clientes' },
  { id: 'produtos', label: 'Produtos', icon: Package, href: '/admin/produtos' },
  { id: 'recebimentos', label: 'Recebimentos', icon: Wallet },
  { id: 'pendencias', label: 'Pendências', icon: AlertCircle },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'chamados', label: 'Chamados', icon: LifeBuoy },
  { id: 'projetos', label: 'Projetos', icon: FolderKanban },
]

export default function AdminSidebar({
  isCollapsed,
  onToggle,
  activeItem = 'dashboard',
  onSelectItem
}: AdminSidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-brand-dark/95 border-r border-white/10 backdrop-blur-md z-40 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header Section with Logo and Collapse Toggle */}
      <div>
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded bg-brand-neon/10 border border-brand-neon/30 flex items-center justify-center shrink-0">
              <Terminal className="text-brand-neon w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-space font-extrabold text-sm tracking-wider text-white">
                  AUTOMATION <span className="text-brand-neon">TEST</span>
                </span>
                <span className="text-[9px] font-mono text-brand-neon uppercase tracking-widest font-semibold">
                  ADMIN PANEL
                </span>
              </div>
            )}
          </Link>

          {/* Toggle Button in Sidebar Header */}
          <button
            onClick={onToggle}
            className="p-1.5 rounded border border-white/10 text-gray-400 hover:text-brand-neon hover:border-brand-neon/40 hover:bg-white/5 transition-all duration-300 cursor-pointer hidden md:flex items-center justify-center shrink-0"
            title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Menu Links */}
        <div className="p-3 space-y-6">
          {/* Section Header Label */}
          {!isCollapsed ? (
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.25em] px-3 font-semibold block">
              MENU
            </span>
          ) : (
            <div className="h-4" />
          )}

          <nav className="space-y-1.5">
            {sidebarMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id

              const content = (
                <>
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-brand-neon' : 'text-gray-400 group-hover:text-brand-neon'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="font-sans tracking-wide truncate">{item.label}</span>
                  )}

                  {/* Indicator Pip for Active State in Collapsed Mode */}
                  {isCollapsed && isActive && (
                    <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-neon" />
                  )}

                  {/* Tooltip for Collapsed Mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-zinc-900 border border-white/10 text-white font-mono text-[10px] uppercase tracking-wider rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl z-50">
                      {item.label}
                    </div>
                  )}
                </>
              )

              const className = `w-full flex items-center gap-3 px-3 py-3 rounded text-xs font-medium transition-all duration-200 cursor-pointer group relative ${
                isActive
                  ? 'bg-brand-neon/15 border border-brand-neon/40 text-brand-neon shadow-[0_0_15px_rgba(204,255,0,0.15)] font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              } ${isCollapsed ? 'justify-center' : ''}`

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => onSelectItem?.(item.id)}
                    className={className}
                  >
                    {content}
                  </Link>
                )
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectItem?.(item.id)}
                  className={className}
                >
                  {content}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer / System Badge */}
      <div className="p-4 border-t border-white/10 bg-black/40">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
            <span>SISTEMA ATIVO v1.0</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" title="Sistema Ativo" />
          </div>
        )}
      </div>
    </aside>
  )
}
