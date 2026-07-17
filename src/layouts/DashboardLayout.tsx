import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Terminal, 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Receipt, 
  PlusSquare, 
  LogOut, 
  Menu, 
  X,
  Bell,
  User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Visão Geral', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Documentos', icon: FileText, path: '/dashboard/documentos' },
    { name: 'Tickets/Suporte', icon: MessageSquare, path: '/dashboard/suporte' },
    { name: 'Faturas', icon: Receipt, path: '/dashboard/faturas' },
    { name: 'Novos Serviços', icon: PlusSquare, path: '/dashboard/servicos' }
  ]

  const handleLogout = () => {
    // Clear auth if any, then redirect to login
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header/Topbar */}
      <header className="md:hidden w-full h-16 bg-brand-dark/90 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Terminal className="text-brand-neon w-5 h-5" />
          <span className="font-space font-bold tracking-wider text-sm text-white">
            AUTOMATION <span className="text-brand-neon">TEST</span>
          </span>
        </Link>
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-400 hover:text-white focus:outline-none p-1"
          aria-label={isMobileMenuOpen ? "Fechar Menu" : "Abrir Menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-brand-dark/80 border-r border-white/10 flex-col fixed inset-y-0 left-0 z-30 pt-8 pb-6 backdrop-blur-md">
        {/* Brand/Logo */}
        <div className="px-6 mb-10">
          <Link to="/" className="flex items-center gap-2 group">
            <Terminal className="text-brand-neon w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-space font-bold tracking-wider text-base text-white">
              AUTOMATION <span className="text-brand-neon">TEST</span>
            </span>
          </Link>
          <span className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-mono block mt-1">
            Portal do Cliente
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex-grow px-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded text-xs tracking-wider font-medium transition-all duration-300 uppercase ${
                  isActive 
                    ? 'bg-brand-neon text-black font-bold shadow-[0_0_15px_rgba(204,255,0,0.2)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Panel (User and Logout) */}
        <div className="px-4 mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-gray border border-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-brand-neon" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-white uppercase">Cliente Corp</p>
              <p className="text-[9px] text-gray-500 truncate font-mono">admin@cliente.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-xs tracking-wider font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 uppercase cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-brand-dark border-r border-white/10 flex flex-col z-40 pt-20 pb-6 md:hidden"
            >
              <nav className="flex-grow px-4 space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded text-xs tracking-wider font-medium transition-all duration-300 uppercase ${
                        isActive 
                          ? 'bg-brand-neon text-black font-bold shadow-[0_0_15px_rgba(204,255,0,0.2)]' 
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="px-4 mt-auto pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-brand-gray border border-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-neon" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase">Cliente Corp</p>
                    <p className="text-[9px] text-gray-500 font-mono">admin@cliente.com</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded text-xs tracking-wider font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 uppercase cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sair do Painel
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-grow md:pl-64 lg:pl-72 flex flex-col min-h-screen">
        {/* Top bar with quick settings / user profile */}
        <header className="hidden md:flex h-20 border-b border-white/5 items-center justify-between px-8 bg-brand-dark/20 backdrop-blur-sm shrink-0">
          <div>
            {/* Status indicator */}
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 px-2.5 py-1 rounded font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistemas Online
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white rounded border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-neon rounded-full" />
            </button>
            
            <div className="h-6 w-[1px] bg-white/5" />
            
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-gray-300">
              <span className="text-[10px] text-gray-500">Token ID:</span>
              <span className="text-brand-neon">AT-4091</span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-grow p-6 md:p-8 lg:p-10 bg-[#0a0a0a] relative overflow-y-auto">
          {/* Subtle ambient light inside dashboard */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-neon/[0.015] blur-[100px] rounded-full pointer-events-none -z-10" />
          <Outlet />
        </main>
      </div>

    </div>
  )
}
