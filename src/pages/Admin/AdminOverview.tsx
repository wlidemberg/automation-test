import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Package, 
  Wallet, 
  AlertCircle, 
  Calendar, 
  LifeBuoy, 
  FolderKanban, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  Building2, 
  Save, 
  Plus, 
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAllProfiles, updateProfileStatus } from '../../services/profileServices'
import { fetchAllProducts } from '../../services/productServices'
import type { Profile, Product } from '../../types/database'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import AdminHeader from '../../components/Admin/AdminHeader'
import ProposalModal from '../../components/Admin/ProposalModal'
import { fetchClientProposals, acceptProposalAndPayEntry } from '../../services/proposalServices'
import { supabase } from '../../lib/supabase'

interface ClienteInfo {
  id: string
  empresa: string
  produto: string
  progresso: number
  fase: string
  proximaEntrega: string
  statusFinanceiro: 'Em dia' | 'Pendente'
  mrr: number
  vencimento?: string
}

export default function AdminOverview() {
  // Sidebar State
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('dashboard')

  // Supabase Profiles & Products State
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Supabase Proposals State
  const [proposals, setProposals] = useState<any[]>([])
  const [briefings, setBriefings] = useState<any[]>([])
  const [loadingProposals, setLoadingProposals] = useState<boolean>(true)
  const [isProposalModalOpen, setIsProposalModalOpen] = useState<boolean>(false)

  // Legacy/Mock Projects State for operational view
  const [clientes, setClientes] = useState<ClienteInfo[]>([
    {
      id: '1',
      empresa: 'Assescor Corp',
      produto: 'Portal Assescor (Projeto Sob Medida)',
      progresso: 100,
      fase: 'Concluído',
      proximaEntrega: 'Nenhuma - Projeto Entregue',
      statusFinanceiro: 'Em dia',
      mrr: 1500,
      vencimento: '10/08/2026'
    },
    {
      id: '2',
      empresa: 'Vekant Empreendimentos',
      produto: 'Sistema ERP Comercial',
      progresso: 100,
      fase: 'Concluído',
      proximaEntrega: 'Ajuste de Fluxo de Caixa',
      statusFinanceiro: 'Em dia',
      mrr: 1200,
      vencimento: '15/08/2026'
    },
    {
      id: '3',
      empresa: 'Agendamentos Gerais',
      produto: 'Sistema de Agendamentos & IA',
      progresso: 60,
      fase: 'Desenvolvimento',
      proximaEntrega: 'Integração de WhatsApp API',
      statusFinanceiro: 'Pendente',
      mrr: 750,
      vencimento: '05/07/2026'
    }
  ])

  const [selectedClient, setSelectedClient] = useState<ClienteInfo | null>(null)
  
  // Modal form states
  const [progresso, setProgresso] = useState<number>(0)
  const [fase, setFase] = useState<string>('')
  const [proximaEntrega, setProximaEntrega] = useState<string>('')
  const [statusFinanceiro, setStatusFinanceiro] = useState<'Em dia' | 'Pendente'>('Em dia')
  const [valorMensalidade, setValorMensalidade] = useState<string>('')
  const [vencimentoMensalidade, setVencimentoMensalidade] = useState<string>('')
  const [isLancarFaturaOpen, setIsLancarFaturaOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // Carregar perfis e produtos do Supabase
  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [profilesData, productsData] = await Promise.all([
        fetchAllProfiles(),
        fetchAllProducts()
      ])
      setProfiles(profilesData)
      setProducts(productsData)
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err)
      showToast('FALHA AO CONECTAR COM O SUPABASE.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadBriefings = async () => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) {
        setBriefings(data)
      }
    } catch (err) {
      console.error('Erro ao carregar briefings:', err)
    }
  }

  const loadProposals = async () => {
    setLoadingProposals(true)
    try {
      const data = await fetchClientProposals()
      setProposals(data)
    } catch (err) {
      console.error('Erro ao carregar propostas:', err)
      showToast('FALHA AO CARREGAR PROPOSTAS.', 'error')
    } finally {
      setLoadingProposals(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
    loadProposals()
    loadBriefings()
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Handler para aprovação e recusa de perfis com feedback reativo
  const handleStatusChange = async (userId: string, newStatus: 'ativo' | 'recusado') => {
    setUpdatingId(userId)
    try {
      const updated = await updateProfileStatus(userId, newStatus)
      if (updated) {
        await loadDashboardData()
        const nomeOuRazao = updated.razao_social || updated.nome_completo || updated.email
        showToast(`SOLICITAÇÃO DE ${nomeOuRazao.toUpperCase()} FOI ${newStatus === 'ativo' ? 'APROVADA' : 'RECUSADA'} COM SUCESSO!`, 'success')
      } else {
        showToast('ERRO AO ATUALIZAR STATUS NO BANCO DE DADOS.', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('FALHA DE REDE AO PROCESSAR SOLICITAÇÃO.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleAcceptProposal = async (projectId: string) => {
    setUpdatingId(projectId)
    try {
      // Buscar a fatura pendente associada ao projeto
      const { data: invoice, error } = await supabase
        .from('invoices')
        .select('id')
        .eq('project_id', projectId)
        .eq('status', 'pendente')
        .maybeSingle();

      if (error || !invoice) {
        showToast('NENHUMA FATURA PENDENTE ENCONTRADA.', 'error')
        return
      }

      const success = await acceptProposalAndPayEntry(projectId, invoice.id)
      if (success) {
        showToast('PROPOSTA ACEITA E FATURA DE ENTRADA PAGA COM SUCESSO!', 'success')
        await Promise.all([loadDashboardData(), loadProposals(), loadBriefings()])
      } else {
        showToast('ERRO AO PROCESSAR ACEITE DA PROPOSTA.', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('FALHA OPERACIONAL.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleApproveClientAndContract = async (userId: string, briefingId: string, projectId: string | null) => {
    setUpdatingId(userId)
    try {
      // 1. Altera o status do perfil para 'ativo'
      const updatedProfile = await updateProfileStatus(userId, 'ativo')
      if (!updatedProfile) {
        showToast('ERRO AO ATIVAR PERFIL DO CLIENTE.', 'error')
        return
      }

      // 2. Vincula o projeto definitivo (altera fase_atual para 'em_desenvolvimento')
      if (projectId) {
        await supabase
          .from('projects')
          .update({ fase_atual: 'em_desenvolvimento', progresso: 15 })
          .eq('id', projectId)

        // Atualiza status da fatura para pago se houver alguma pendente de entrada
        await supabase
          .from('invoices')
          .update({ status: 'pago' })
          .eq('project_id', projectId)
          .eq('tipo', 'entrada')
      }

      // 3. Atualiza o status do briefing
      await supabase
        .from('briefings')
        .update({ status_briefing: 'proposta_aceita' })
        .eq('id', briefingId)

      // 4. Simula o disparo de e-mail de primeiro acesso
      showToast('CADASTRO ATIVADO E CONTRATO DE LUXO GERADO COM SUCESSO!', 'success')
      
      // Recarregar dados
      await Promise.all([loadDashboardData(), loadProposals(), loadBriefings()])
    } catch (err) {
      console.error(err)
      showToast('FALHA OPERACIONAL AO GERAR CONTRATO.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleEditClick = (cliente: ClienteInfo) => {
    setSelectedClient(cliente)
    setProgresso(cliente.progresso)
    setFase(cliente.fase)
    setProximaEntrega(cliente.proximaEntrega)
    setStatusFinanceiro(cliente.statusFinanceiro)
    setValorMensalidade(cliente.mrr.toString())
    setVencimentoMensalidade(cliente.vencimento || '')
    setIsLancarFaturaOpen(false)
    setSuccessMsg('')
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) return

    setClientes(prev => prev.map(c => {
      if (c.id === selectedClient.id) {
        return {
          ...c,
          progresso,
          fase,
          proximaEntrega,
          statusFinanceiro,
          mrr: parseFloat(valorMensalidade) || c.mrr,
          vencimento: vencimentoMensalidade || c.vencimento
        }
      }
      return c
    }))

    setSuccessMsg('Alterações salvas com sucesso!')
    setTimeout(() => {
      setSelectedClient(null)
      setSuccessMsg('')
    }, 1200)
  }

  const handleLancarFatura = () => {
    setIsLancarFaturaOpen(true)
    setStatusFinanceiro('Pendente')
  }

  // Active section label for Breadcrumbs
  const tabLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    clientes: 'Clientes',
    produtos: 'Produtos',
    recebimentos: 'Recebimentos',
    pendencias: 'Pendências',
    agenda: 'Agenda',
    chamados: 'Chamados',
    projetos: 'Projetos',
  }
  const currentTabLabel = tabLabels[activeTab] || 'Dashboard'

  // Metric values derived from Supabase & KPIs
  const totalClientes = profiles.length
  const totalProdutos = products.length
  const solicitacoesPendentes = profiles.filter(p => p.status === 'pendente').length

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans relative overflow-x-hidden">
      
      {/* Decorative Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-neon/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Collapsible Sidebar Navigation */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        activeItem={activeTab}
        onSelectItem={(id) => setActiveTab(id)}
      />

      {/* Main Top Header */}
      <AdminHeader
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        activeSectionLabel={currentTabLabel}
        onRefresh={loadDashboardData}
        isRefreshing={loading}
      />

      {/* Toast Notification Floating */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-6 z-50 px-5 py-3.5 rounded border text-xs font-mono tracking-wider uppercase backdrop-blur-md shadow-2xl flex items-center gap-3 ${
              toast.type === 'success' 
                ? 'bg-brand-neon/15 border-brand-neon text-brand-neon shadow-brand-neon/10' 
                : 'bg-rose-500/15 border-rose-500 text-rose-400 shadow-rose-500/10'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area (Dynamic Margin according to Sidebar State) */}
      <main
        className={`p-6 sm:p-8 space-y-8 transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Page Header (Space Grotesk Title + Subtitle) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-6 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-space font-extrabold tracking-tight text-white uppercase">
              Dashboard
            </h1>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Visão geral do seu negócio e métricas operacionais em tempo real.
            </p>
          </div>

          <button
            onClick={() => setIsProposalModalOpen(true)}
            className="px-5 py-3 bg-[#CCFF00] text-black rounded text-xs font-mono font-extrabold tracking-wider hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-300 uppercase flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            + NOVA PROPOSTA
          </button>
        </div>

        {/* 8 Metric KPI Cards Grid (2 Rows of 4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Clientes (Supabase dynamic) */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-5 hover:border-brand-neon/50 transition-colors shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">Clientes</span>
              <div className="p-2 rounded bg-brand-neon/10 border border-brand-neon/20">
                <Users className="w-5 h-5 text-brand-neon" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-space font-extrabold text-white">{totalClientes}</div>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block font-semibold">+12% vs. mês anterior</span>
            </div>
          </div>

          {/* Card 2: Produtos (Supabase dynamic) */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-5 hover:border-brand-neon/50 transition-colors shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">Produtos</span>
              <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20">
                <Package className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-space font-extrabold text-white">{totalProdutos}</div>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block font-semibold">+7 ativos no catálogo</span>
            </div>
          </div>

          {/* Card 3: Recebimentos mês */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-5 hover:border-brand-neon/50 transition-colors shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">Recebimentos mês</span>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-space font-extrabold text-white">R$ 48.230</div>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block font-semibold">+8% vs. mês anterior</span>
            </div>
          </div>

          {/* Card 4: Pendências (Supabase dynamic) */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-5 hover:border-brand-neon/50 transition-colors shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">Pendências</span>
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className={`w-5 h-5 ${solicitacoesPendentes > 0 ? 'text-amber-400 animate-pulse' : 'text-amber-400'}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-space font-extrabold text-white">{solicitacoesPendentes}</div>
              <span className="text-[10px] font-mono text-rose-400 mt-1 block font-semibold">-2 vs. mês anterior</span>
            </div>
          </div>

          {/* Card 5: Compromissos hoje */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-5 hover:border-brand-neon/50 transition-colors shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">Compromissos hoje</span>
              <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-space font-extrabold text-white">6</div>
              <span className="text-[10px] font-mono text-gray-400 mt-1 block font-semibold">Agendados para hoje</span>
            </div>
          </div>

          {/* Card 6: Chamados abertos */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-5 hover:border-brand-neon/50 transition-colors shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">Chamados abertos</span>
              <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20">
                <LifeBuoy className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-space font-extrabold text-white">9</div>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block font-semibold">-1 vs. mês anterior</span>
            </div>
          </div>

          {/* Card 7: Projetos ativos */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-5 hover:border-brand-neon/50 transition-colors shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">Projetos ativos</span>
              <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                <FolderKanban className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-space font-extrabold text-white">14</div>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block font-semibold">+2 vs. mês anterior</span>
            </div>
          </div>

          {/* Card 8: Crescimento */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-5 hover:border-brand-neon/50 transition-colors shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-sans font-semibold text-gray-400 uppercase tracking-wider">Crescimento</span>
              <div className="p-2 rounded bg-brand-neon/10 border border-brand-neon/20">
                <TrendingUp className="w-5 h-5 text-brand-neon" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-space font-extrabold text-brand-neon">+18%</div>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block font-semibold">Meta mensal atingida</span>
            </div>
          </div>
        </div>

        {/* Lower Panels (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel 1: Atividade recente */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-6 backdrop-blur-sm space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-space font-bold text-white text-sm uppercase tracking-wider">
                Atividade recente
              </h3>
              <span className="text-[9px] font-mono text-gray-500 uppercase">Audit Feed</span>
            </div>
            
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-center gap-3 font-sans text-gray-300">
                <span className="w-2 h-2 rounded-full bg-brand-neon shrink-0" />
                <span>Novo cliente cadastrado: <strong className="text-white font-semibold">Acme Ltda</strong></span>
              </li>
              <li className="flex items-center gap-3 font-sans text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>Pagamento recebido: <strong className="text-white font-semibold">R$ 2.300</strong></span>
              </li>
              <li className="flex items-center gap-3 font-sans text-gray-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                <span>Chamado <strong className="text-white font-semibold">#142</strong> respondido</span>
              </li>
              <li className="flex items-center gap-3 font-sans text-gray-300">
                <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                <span>Projeto <strong className="text-white font-semibold">'Website'</strong> atualizado</span>
              </li>
            </ul>
          </div>

          {/* Panel 2: Próximos compromissos */}
          <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-6 backdrop-blur-sm space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-space font-bold text-white text-sm uppercase tracking-wider">
                Próximos compromissos
              </h3>
              <span className="text-[9px] font-mono text-brand-neon uppercase">Hoje</span>
            </div>

            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-3 p-2.5 rounded bg-black/30 border border-white/5 font-mono">
                <span className="text-brand-neon font-bold text-xs shrink-0 w-12">10:00</span>
                <span className="text-gray-300 font-sans text-xs">Reunião com cliente João</span>
              </li>
              <li className="flex items-center gap-3 p-2.5 rounded bg-black/30 border border-white/5 font-mono">
                <span className="text-brand-neon font-bold text-xs shrink-0 w-12">14:30</span>
                <span className="text-gray-300 font-sans text-xs">Revisão do projeto Alpha</span>
              </li>
              <li className="flex items-center gap-3 p-2.5 rounded bg-black/30 border border-white/5 font-mono">
                <span className="text-brand-neon font-bold text-xs shrink-0 w-12">16:00</span>
                <span className="text-gray-300 font-sans text-xs">Ligação de suporte</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Supabase Profiles Management Section (Preserved) */}
        <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-2">
            <div>
              <h2 className="font-space font-bold text-white text-base uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-neon" />
                GESTÃO DE SOLICITAÇÕES E PERFIS (PF / PJ)
              </h2>
              <p className="text-[10px] text-gray-400 font-mono mt-1">
                Aprovação atômica de contas conectada diretamente à tabela de profiles do Supabase
              </p>
            </div>
            <span className="text-[9px] font-mono text-brand-neon bg-brand-neon/10 border border-brand-neon/20 px-2.5 py-1 rounded uppercase tracking-wider self-start sm:self-auto">
              Supabase Integrated
            </span>
          </div>

          {/* Estado de Carregamento (Loading State) */}
          {loading ? (
            <div className="py-12 text-center space-y-3 bg-black/20 rounded border border-white/5 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-brand-neon animate-spin mx-auto" />
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                CARREGANDO PERFIS DO SUPABASE...
              </p>
            </div>
          ) : profiles.length === 0 ? (
            /* Estado de Lista Vazia (Empty State) */
            <div className="py-12 text-center space-y-3 bg-black/20 rounded border border-white/5 backdrop-blur-sm">
              <Users className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-sm font-space font-bold text-gray-300 uppercase tracking-wider">
                NENHUM CLIENTE CADASTRADO OU PENDENTE
              </p>
              <p className="text-xs text-gray-500 font-mono max-w-md mx-auto">
                Quando novos clientes se cadastrarem na plataforma, suas solicitações de acesso aparecerão nesta lista para aprovação.
              </p>
            </div>
          ) : (
            /* Tabela de Perfis Tech-Luxo */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[9px] font-mono text-gray-400 uppercase tracking-widest bg-white/[0.02]">
                    <th className="py-3.5 px-4 font-semibold">Cliente / Razão Social</th>
                    <th className="py-3.5 px-4 font-semibold">Documento & Contato</th>
                    <th className="py-3.5 px-4 font-semibold">Data Cadastro</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Etapas do Funil</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Ações de Aprovação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {profiles.map((profile) => {
                    const isPJ = profile.tipo_pessoa === 'PJ'
                    const nomeExibicao = isPJ 
                      ? (profile.razao_social || 'Razão Social não informada')
                      : (profile.nome_completo || 'Nome não informado')
                    const documentoExibicao = isPJ
                      ? (profile.cnpj || 'CNPJ não informado')
                      : (profile.cpf || 'CPF não informado')
                    const isUpdating = updatingId === profile.id
                    const associatedBriefing = briefings.find((b: any) => b.client_id === profile.id)
                    const hasConfirmedPayment = associatedBriefing?.status_briefing === 'proposta_aceita'
                    const stepBriefing = associatedBriefing !== undefined
                    const stepProposta = (associatedBriefing?.proposta_ia !== null && associatedBriefing?.proposta_ia !== undefined) || profile.status === 'ativo'
                    const stepPagou = associatedBriefing?.status_briefing === 'proposta_aceita' || profile.status === 'ativo'
                    const stepAtivado = profile.status === 'ativo'

                    return (
                      <tr key={profile.id} className="text-xs hover:bg-white/[0.02] transition-all duration-200">
                        {/* Nome / Razão Social */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                              {isPJ ? <Building2 className="w-3.5 h-3.5 text-cyan-400" /> : <Users className="w-3.5 h-3.5 text-brand-neon" />}
                              {nomeExibicao}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono lowercase">
                              {profile.email}
                            </span>
                          </div>
                        </td>

                        {/* Documento & Contato */}
                        <td className="py-4 px-4 font-mono">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                                isPJ 
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                              }`}>
                                [{profile.tipo_pessoa || 'PF'}]
                              </span>
                              <span className="text-gray-300 font-bold">{documentoExibicao}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-sans lowercase">
                              {profile.email} {profile.telefone ? `• ${profile.telefone}` : ''}
                            </span>
                          </div>
                        </td>

                        {/* Data de Cadastro */}
                         <td className="py-4 px-4 font-mono text-gray-400 text-[10px]">
                           {profile.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/D'}
                         </td>
 
                         {/* Etapas do Funil */}
                         <td className="py-4 px-4 text-center">
                           <div className="inline-flex items-center justify-center gap-3 font-mono text-[9px]">
                             {/* 1. Enviou Briefing */}
                             <div className="flex items-center gap-1">
                               <span className={`p-1 rounded-full border transition-all ${
                                 stepBriefing
                                   ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00] font-bold shadow-[0_0_8px_rgba(204,255,0,0.3)]'
                                   : 'bg-zinc-900 border-white/5 text-gray-600 opacity-20'
                               }`} title={stepBriefing ? 'Briefing Enviado' : 'Aguardando Briefing'}>
                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                 </svg>
                               </span>
                               <span className={`text-[8px] uppercase tracking-wider ${stepBriefing ? 'text-[#CCFF00] font-semibold' : 'text-gray-600 opacity-40'}`}>Briefing</span>
                             </div>
 
                             <span className="text-zinc-800 text-[8px] select-none">/</span>
 
                             {/* 2. Recebe Proposta */}
                             <div className="flex items-center gap-1">
                               <span className={`p-1 rounded-full border transition-all ${
                                 stepProposta
                                   ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00] font-bold shadow-[0_0_8px_rgba(204,255,0,0.3)]'
                                   : 'bg-zinc-900 border-white/5 text-gray-600 opacity-20'
                               }`} title={stepProposta ? 'Proposta Gerada' : 'Aguardando Proposta'}>
                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                 </svg>
                               </span>
                               <span className={`text-[8px] uppercase tracking-wider ${stepProposta ? 'text-[#CCFF00] font-semibold' : 'text-gray-600 opacity-40'}`}>Proposta</span>
                             </div>
 
                             <span className="text-zinc-800 text-[8px] select-none">/</span>
 
                             {/* 3. Pagou */}
                             <div className="flex items-center gap-1">
                               <span className={`p-1 rounded-full border transition-all ${
                                 stepPagou
                                   ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00] font-bold shadow-[0_0_8px_rgba(204,255,0,0.3)]'
                                   : 'bg-zinc-900 border-white/5 text-gray-600 opacity-20'
                               }`} title={stepPagou ? 'Entrada Paga' : 'Aguardando Pagamento'}>
                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                 </svg>
                               </span>
                               <span className={`text-[8px] uppercase tracking-wider ${stepPagou ? 'text-[#CCFF00] font-semibold' : 'text-gray-600 opacity-40'}`}>Pagou</span>
                             </div>
 
                             <span className="text-zinc-800 text-[8px] select-none">/</span>
 
                             {/* 4. Gerou senha definitiva */}
                             <div className="flex items-center gap-1">
                               <span className={`p-1 rounded-full border transition-all ${
                                 stepAtivado
                                   ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00] font-bold shadow-[0_0_8px_rgba(204,255,0,0.3)]'
                                   : 'bg-zinc-900 border-white/5 text-gray-600 opacity-20'
                               }`} title={stepAtivado ? 'Acesso Ativado (Senha Gerada)' : 'Acesso Pendente'}>
                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                 </svg>
                               </span>
                               <span className={`text-[8px] uppercase tracking-wider ${stepAtivado ? 'text-[#CCFF00] font-semibold' : 'text-gray-600 opacity-40'}`}>Senha</span>
                             </div>
                           </div>
                         </td>

                        {/* Status com Estilo Tech-Luxo */}
                        <td className="py-4 px-4 font-mono">
                          {profile.status === 'pendente' && (
                            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              <Clock className="w-3 h-3 animate-spin" />
                              PENDENTE
                            </span>
                          )}
                          {profile.status === 'ativo' && (
                            <span className="inline-flex items-center gap-1 bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/30 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              <CheckCircle2 className="w-3 h-3" />
                              ATIVO
                            </span>
                          )}
                          {profile.status === 'recusado' && (
                            <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              <XCircle className="w-3 h-3" />
                              RECUSADO
                            </span>
                          )}
                        </td>

                        {/* Botões de Ação em UPPERCASE */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             {hasConfirmedPayment ? (
                               <button
                                 onClick={() => handleApproveClientAndContract(profile.id, associatedBriefing.id, associatedBriefing.project_id)}
                                 disabled={profile.status === 'ativo' || isUpdating}
                                 className={`px-3 py-1.5 text-[9px] font-mono font-bold tracking-wider rounded uppercase transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                                   profile.status === 'ativo'
                                     ? 'bg-zinc-800 text-gray-600 border border-zinc-700 cursor-not-allowed opacity-50'
                                     : 'bg-brand-neon text-black hover:shadow-[0_0_15px_rgba(204,255,0,0.5)] hover:scale-105 shadow-[0_0_10px_rgba(204,255,0,0.2)] border border-brand-neon/30'
                                 }`}
                               >
                                 {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                 APROVAR CADASTRO E GERAR CONTRATO
                               </button>
                             ) : (
                               <button
                                 onClick={() => handleStatusChange(profile.id, 'ativo')}
                                 disabled={profile.status === 'ativo' || isUpdating}
                                 className={`px-3 py-1.5 text-[9px] font-mono font-bold tracking-wider rounded uppercase transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                                   profile.status === 'ativo'
                                     ? 'bg-zinc-800 text-gray-600 border border-zinc-700 cursor-not-allowed opacity-50'
                                     : 'bg-brand-neon text-black hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] hover:scale-105'
                                 }`}
                               >
                                 {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                 APROVAR
                               </button>
                             )}

                            {/* Botão RECUSAR */}
                            <button
                              onClick={() => handleStatusChange(profile.id, 'recusado')}
                              disabled={profile.status === 'recusado' || isUpdating}
                              className={`px-3 py-1.5 text-[9px] font-mono font-bold tracking-wider rounded uppercase transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                                profile.status === 'recusado'
                                  ? 'bg-zinc-800 text-gray-600 border border-zinc-700 cursor-not-allowed opacity-50'
                                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 hover:scale-105'
                              }`}
                            >
                              {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                              RECUSAR
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Operational Section: Projects & Monthly Charges */}
        <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-xl">
          <div className="border-b border-white/5 pb-4">
            <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider">
              PROJETOS EM ANDAMENTO E MENSALIDADES ERP
            </h2>
            <p className="text-[10px] text-gray-400 font-mono mt-1">
              Gerencie a integridade financeira e o progresso do desenvolvimento sob medida
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                  <th className="py-4 px-4 font-semibold">Empresa</th>
                  <th className="py-4 px-4 font-semibold">Produto Ativo</th>
                  <th className="py-4 px-4 font-semibold">Fase Atual</th>
                  <th className="py-4 px-4 font-semibold">Progresso (%)</th>
                  <th className="py-4 px-4 font-semibold">Status Financeiro</th>
                  <th className="py-4 px-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {clientes.map((c) => (
                  <tr key={c.id} className="text-xs hover:bg-white/[0.01] transition-all duration-200">
                    <td className="py-4 px-4 font-bold text-white uppercase">{c.empresa}</td>
                    <td className="py-4 px-4 text-gray-400">{c.produto}</td>
                    <td className="py-4 px-4 font-mono">
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] uppercase text-gray-300">
                        {c.fase}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden shrink-0">
                          <div className="h-full bg-brand-neon" style={{ width: `${c.progresso}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-gray-300 font-bold">{c.progresso}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <span className={`text-[9px] uppercase px-2.5 py-0.5 rounded border font-semibold ${
                        c.statusFinanceiro === 'Em dia'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {c.statusFinanceiro}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleEditClick(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-neon text-black text-[9px] font-mono tracking-wider font-bold rounded hover:shadow-[0_0_10px_rgba(204,255,0,0.3)] transition-all uppercase cursor-pointer"
                      >
                        EDITAR STATUS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supabase Proposals List Section */}
        <div className="bg-brand-gray/90 border border-brand-gray rounded-md p-6 sm:p-8 backdrop-blur-sm space-y-6 shadow-xl">
          <div className="border-b border-white/5 pb-4">
            <h2 className="font-space font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brand-neon" />
              PROPOSTAS E PROJETOS PERSONALIZADOS (SUPABASE)
            </h2>
            <p className="text-[10px] text-gray-400 font-mono mt-1">
              Acompanhe propostas enviadas aos clientes e realize o aceite de faturas de entrada
            </p>
          </div>

          {loadingProposals ? (
            <div className="py-12 text-center space-y-3 bg-black/20 rounded border border-white/5 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-brand-neon animate-spin mx-auto" />
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                CARREGANDO PROPOSTAS...
              </p>
            </div>
          ) : proposals.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-black/20 rounded border border-white/5 backdrop-blur-sm">
              <FolderKanban className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-sm font-space font-bold text-gray-300 uppercase tracking-wider">
                NENHUMA PROPOSTA CADASTRADA
              </p>
              <p className="text-xs text-gray-500 font-mono max-w-md mx-auto">
                Clique em "+ NOVA PROPOSTA" no topo da página para enviar a primeira proposta comercial.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-mono text-gray-400 uppercase tracking-widest bg-white/[0.02]">
                    <th className="py-4 px-4 font-semibold">Cliente</th>
                    <th className="py-4 px-4 font-semibold">Projeto / Escopo</th>
                    <th className="py-4 px-4 font-semibold">Setup</th>
                    <th className="py-4 px-4 font-semibold">Mensalidade</th>
                    <th className="py-4 px-4 font-semibold">Fase Atual</th>
                    <th className="py-4 px-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {proposals.map((prop) => {
                    const clientProfile = profiles.find(p => p.id === prop.client_id)
                    const clientName = clientProfile 
                      ? (clientProfile.razao_social || clientProfile.nome_completo || clientProfile.email) 
                      : 'Carregando...'

                    return (
                      <tr key={prop.id} className="text-xs hover:bg-white/[0.01] transition-all duration-200">
                        <td className="py-4 px-4 font-bold text-white uppercase">{clientName}</td>
                        <td className="py-4 px-4 text-gray-300">
                          <div className="font-semibold text-white uppercase">{prop.nome}</div>
                          <div className="text-[10px] text-gray-500 font-sans max-w-xs truncate">{prop.descricao}</div>
                        </td>
                        <td className="py-4 px-4 font-mono text-white">
                          {prop.valor_setup 
                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.valor_setup) 
                            : 'R$ 0,00'}
                        </td>
                        <td className="py-4 px-4 font-mono text-[#CCFF00]">
                          {prop.valor_mensalidade 
                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.valor_mensalidade) 
                            : 'R$ 0,00'}
                        </td>
                        <td className="py-4 px-4 font-mono">
                          {prop.fase_atual === 'proposta_pendente' && (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              PROPOSTA PENDENTE
                            </span>
                          )}
                          {prop.fase_atual === 'proposta_enviada' && (
                            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              PROPOSTA ENVIADA
                            </span>
                          )}
                          {prop.fase_atual === 'em_desenvolvimento' && (
                            <span className="bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/30 px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                              EM DESENVOLVIMENTO
                            </span>
                          )}
                          {!['proposta_pendente', 'proposta_enviada', 'em_desenvolvimento'].includes(prop.fase_atual) && (
                            <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[10px] uppercase text-gray-300 font-bold tracking-wider">
                              {prop.fase_atual.toUpperCase().replace('_', ' ')}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {['proposta_enviada', 'proposta_pendente'].includes(prop.fase_atual) && (
                            <button
                              onClick={() => handleAcceptProposal(prop.id)}
                              disabled={updatingId !== null}
                              className="px-3 py-1.5 bg-[#CCFF00] text-black text-[9px] font-mono tracking-wider font-bold rounded hover:shadow-[0_0_10px_rgba(204,255,0,0.3)] transition-all uppercase cursor-pointer disabled:opacity-50"
                            >
                              ACEITAR & PAGAR ENTRADA
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Proposal Modal component */}
      <ProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        onSuccess={loadProposals}
      />

      {/* Edit Status Modal (Glassmorphism Overlay) */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-zinc-900/90 border border-white/10 rounded-lg p-6 sm:p-8 relative overflow-hidden backdrop-blur-lg shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon/60 to-transparent" />
              
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6">
                <div>
                  <span className="text-[9px] tracking-widest font-mono text-brand-neon uppercase font-bold block mb-1">
                    Painel Gerencial
                  </span>
                  <h3 className="font-space font-bold text-white text-base uppercase">
                    {selectedClient.empresa}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="space-y-6">
                {successMsg ? (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-brand-neon/15 border border-brand-neon/20 text-brand-neon rounded text-xs tracking-wider uppercase font-mono text-center"
                  >
                    {successMsg}
                  </motion.div>
                ) : null}

                {/* Progress Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] tracking-wider font-mono text-gray-400">
                    <span>PROGRESSO DO PROJETO</span>
                    <span className="text-brand-neon font-bold">{progresso}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progresso}
                    onChange={(e) => setProgresso(parseInt(e.target.value))}
                    className="w-full accent-brand-neon bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phase Select */}
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                      FASE ATUAL
                    </label>
                    <select
                      value={fase}
                      onChange={(e) => setFase(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-3 py-2.5 text-xs text-white uppercase font-sans cursor-pointer"
                    >
                      <option value="Briefing">Briefing</option>
                      <option value="Desenvolvimento">Desenvolvimento</option>
                      <option value="Homologação Visual">Homologação Visual</option>
                      <option value="Licença Ativa">Licença Ativa</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </div>

                  {/* Financial Status Select */}
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                      STATUS FINANCEIRO
                    </label>
                    <select
                      value={statusFinanceiro}
                      onChange={(e) => setStatusFinanceiro(e.target.value as 'Em dia' | 'Pendente')}
                      className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-3 py-2.5 text-xs text-white uppercase font-sans cursor-pointer"
                    >
                      <option value="Em dia">Em dia</option>
                      <option value="Pendente">Pendente</option>
                    </select>
                  </div>
                </div>

                {/* Next Delivery Input */}
                <div className="space-y-2">
                  <label className="block text-[10px] tracking-wider text-gray-400 font-mono uppercase">
                    PRÓXIMA ENTREGA
                  </label>
                  <input
                    type="text"
                    value={proximaEntrega}
                    onChange={(e) => setProximaEntrega(e.target.value)}
                    placeholder="Descrição da próxima entrega"
                    className="w-full bg-black/50 border border-white/10 focus:border-brand-neon outline-none transition-all duration-300 rounded px-4 py-2.5 text-xs text-white font-sans"
                  />
                </div>

                {/* Faturamento / Mensalidade Recorrente */}
                <div className="border-t border-white/5 pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">RECORRÊNCIA MENSAL (MRR)</span>
                    <button
                      type="button"
                      onClick={handleLancarFatura}
                      className="inline-flex items-center gap-1 text-[9px] font-mono text-brand-neon hover:underline uppercase"
                    >
                      <Plus className="w-3 h-3" />
                      LANÇAR NOVA FATURA
                    </button>
                  </div>

                  {isLancarFaturaOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid grid-cols-2 gap-4 bg-black/20 p-4 border border-white/5 rounded-lg"
                    >
                      <div className="space-y-2">
                        <label className="block text-[9px] font-mono text-gray-500 uppercase">VALOR MENSALIDADE (R$)</label>
                        <input
                          type="number"
                          value={valorMensalidade}
                          onChange={(e) => setValorMensalidade(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 focus:border-brand-neon outline-none rounded px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[9px] font-mono text-gray-500 uppercase">DATA DE VENCIMENTO</label>
                        <input
                          type="text"
                          value={vencimentoMensalidade}
                          onChange={(e) => setVencimentoMensalidade(e.target.value)}
                          placeholder="DD/MM/AAAA"
                          className="w-full bg-black/60 border border-white/10 focus:border-brand-neon outline-none rounded px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="border-t border-white/5 pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="px-4 py-2.5 border border-white/10 text-white rounded text-[10px] tracking-wider font-semibold hover:bg-white/5 uppercase transition-all duration-300 font-mono cursor-pointer"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-neon text-black rounded text-[10px] tracking-wider font-bold hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all duration-300 uppercase flex items-center gap-1.5 cursor-pointer font-mono"
                  >
                    <Save className="w-3.5 h-3.5" />
                    SALVAR ALTERAÇÕES
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
