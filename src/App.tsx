import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Login from './pages/Login'
import DashboardLayout from './layouts/DashboardLayout'
import Overview from './pages/Dashboard/Overview'
import ProjectDetail from './pages/Dashboard/ProjectDetail'

// Premium placeholder component for dashboard sections in development
function DashboardPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] tracking-[0.3em] font-mono text-brand-neon uppercase font-semibold block mb-1">
          Backstage / {title}
        </span>
        <h1 className="text-3xl sm:text-4xl font-space font-extrabold tracking-tight text-white uppercase">
          {title}
        </h1>
      </div>
      <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-8 text-center space-y-4 backdrop-blur-sm max-w-xl">
        <div className="w-12 h-12 rounded-full bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-brand-neon animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="font-space font-bold text-white text-sm uppercase">Módulo em Desenvolvimento</h3>
        <p className="font-sans text-xs text-gray-400 font-light leading-relaxed">
          Esta seção está sendo integrada à nossa API de alta performance e estará disponível no seu painel em breve. Agradecemos o seu contato.
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/produtos/:slug" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Logged Customer Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="projeto/:id" element={<ProjectDetail />} />
          <Route path="documentos" element={<DashboardPlaceholder title="Documentos" />} />
          <Route path="suporte" element={<DashboardPlaceholder title="Tickets & Suporte" />} />
          <Route path="faturas" element={<DashboardPlaceholder title="Faturas & Cobranças" />} />
          <Route path="servicos" element={<DashboardPlaceholder title="Novos Serviços" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
