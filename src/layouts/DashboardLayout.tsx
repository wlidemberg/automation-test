import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
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
  User,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { signOutUser } from '../services/authService'
import { supabase } from '../lib/supabase'

function PendingPaymentScreen({ user, profile, refreshProfile }: { user: any, profile: any, refreshProfile: () => Promise<void> }) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleConfirmPayment = async () => {
    setIsConfirming(true)
    setError('')
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ status: 'ativo' })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Sincroniza o perfil local
      await refreshProfile()
    } catch (err: any) {
      console.error(err)
      setError('Erro ao confirmar pagamento. Tente novamente em instantes.')
    } finally {
      setIsConfirming(false)
    }
  }

  const handleLogout = async () => {
    await signOutUser()
    navigate('/login')
  }

  const metadata = profile?.dados_adicionais || {}
  const produtoNome = metadata.produto_contratado_nome || 'Solução Digital'
  const setupTotal = metadata.setup_total || 0
  const entradaObrigatoria = metadata.entrada_obrigatoria || (setupTotal * 0.5)
  const mensalidade = metadata.mensalidade || 0

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-neon/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-xl bg-zinc-900/40 border border-white/10 rounded-lg p-8 sm:p-10 backdrop-blur-md relative space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon/50 to-transparent" />

        <div className="text-center space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-brand-neon font-mono font-bold">Faturamento Pendente</span>
          <h2 className="font-space font-extrabold text-white text-2xl uppercase tracking-wider">Aguardando Pagamento da Entrada</h2>
          <p className="font-sans text-xs text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            Seu cadastro foi realizado com sucesso! Para liberar o acesso total ao backstage e iniciar o desenvolvimento do seu projeto, realize o pagamento da entrada obrigatória de 50% do setup.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-xs font-mono uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        {/* Resumo financeiro */}
        <div className="bg-black/50 border border-white/5 rounded-lg p-5 space-y-4">
          <h4 className="font-space font-bold text-white text-xs uppercase tracking-wider border-b border-white/5 pb-2">
            Resumo de Contratação - {produtoNome.toUpperCase()}
          </h4>
          
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-gray-500">
              <span>VALOR TOTAL DO SETUP</span>
              <span className="text-white">
                {setupTotal > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(setupTotal) : 'R$ 0,00'}
              </span>
            </div>

            <div className="bg-brand-neon/5 border border-brand-neon/20 rounded p-3 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-brand-neon font-bold uppercase tracking-wider block">ENTRADA OBRIGATÓRIA (50%)</span>
                <span className="text-[9px] text-gray-500 block">Pagar agora via PIX</span>
              </div>
              <span className="text-sm font-extrabold text-brand-neon">
                {entradaObrigatoria > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entradaObrigatoria) : 'R$ 0,00'}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-500">
              <span>MENSALIDADE RECORRENTE</span>
              <span className="text-white font-bold">
                {mensalidade > 0 ? `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mensalidade)}/mês` : 'Isento'}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code e Chave PIX */}
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center bg-black/30 border border-white/5 rounded-lg p-5">
          <div className="w-32 h-32 bg-white p-2 rounded shrink-0 border border-brand-neon/30 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-black">
              <rect x="10" y="10" width="25" height="25" fill="currentColor" />
              <rect x="15" y="15" width="15" height="15" fill="white" />
              <rect x="18" y="18" width="9" height="9" fill="currentColor" />
              <rect x="65" y="10" width="25" height="25" fill="currentColor" />
              <rect x="70" y="15" width="15" height="15" fill="white" />
              <rect x="73" y="18" width="9" height="9" fill="currentColor" />
              <rect x="10" y="65" width="25" height="25" fill="currentColor" />
              <rect x="15" y="70" width="15" height="15" fill="white" />
              <rect x="18" y="73" width="9" height="9" fill="currentColor" />
              <rect x="42" y="15" width="8" height="8" fill="currentColor" />
              <rect x="52" y="22" width="6" height="6" fill="currentColor" />
              <rect x="42" y="42" width="10" height="10" fill="currentColor" />
              <rect x="65" y="45" width="8" height="8" fill="currentColor" />
              <rect x="75" y="55" width="12" height="6" fill="currentColor" />
              <rect x="45" y="65" width="8" height="12" fill="currentColor" />
              <rect x="55" y="75" width="10" height="10" fill="currentColor" />
              <rect x="75" y="75" width="8" height="8" fill="currentColor" />
            </svg>
          </div>
          <div className="space-y-3 w-full text-center sm:text-left">
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono block">Chave PIX Copia e Cola</span>
            <input
              type="text"
              readOnly
              value="00020126580014br.gov.bcb.pix0136cliente-corp-id-key5303986540510.00"
              className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-[10px] font-mono text-gray-400 select-all cursor-text outline-none text-center sm:text-left"
            />
            <p className="font-sans text-[10px] text-gray-500 font-light leading-relaxed">
              Escaneie o QR Code ou copie a chave PIX acima para efetuar o pagamento nos canais do seu banco.
            </p>
          </div>
        </div>

        {/* Botoes de Acao */}
        <div className="space-y-3 pt-2 font-mono">
          <button
            onClick={handleConfirmPayment}
            disabled={isConfirming}
            className="w-full py-4 bg-brand-neon text-black font-extrabold rounded text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(204,255,0,0.45)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                CONCILIANDO PAGAMENTO...
              </>
            ) : (
              'CONFIRMAR PAGAMENTO'
            )}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-transparent border border-white/10 text-gray-400 hover:text-white font-semibold rounded text-xs tracking-wider uppercase hover:bg-white/5 transition-all duration-300 cursor-pointer"
          >
            SAIR E VOLTAR
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, profile, loading, refreshProfile } = useAuth()

  const menuItems = [
    { name: 'Visão Geral', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Documentos', icon: FileText, path: '/dashboard/documentos' },
    { name: 'Tickets/Suporte', icon: MessageSquare, path: '/dashboard/suporte' },
    { name: 'Faturas', icon: Receipt, path: '/dashboard/faturas' },
    { name: 'Novos Serviços', icon: PlusSquare, path: '/dashboard/servicos' }
  ]

  const handleLogout = async () => {
    await signOutUser()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-neon animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (profile?.status === 'pendente') {
    return <PendingPaymentScreen user={user} profile={profile} refreshProfile={refreshProfile} />
  }

  const clientName = profile?.nome_completo || profile?.razao_social || 'Cliente Corp'
  const clientEmail = profile?.email || user.email || ''
  const tokenId = profile?.id ? `#AT-${profile.id.toUpperCase().substring(0, 4)}` : '#AT-4091'

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
              <p className="text-xs font-bold truncate text-white uppercase">{clientName}</p>
              <p className="text-[9px] text-gray-500 truncate font-mono">{clientEmail}</p>
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
                    <p className="text-xs font-bold text-white uppercase">{clientName}</p>
                    <p className="text-[9px] text-gray-500 font-mono">{clientEmail}</p>
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
              <span className="text-brand-neon">{tokenId}</span>
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
