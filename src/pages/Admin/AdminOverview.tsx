import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Terminal, 
  ArrowLeft, 
  X, 
  Save, 
  Plus, 
  Settings,
  ShieldAlert
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
    setStatusFinanceiro('Pendente') // When a new bill is generated it can toggle status
  }

  // Derived metrics
  const totalClientes = clientes.length
  const totalMrr = clientes.reduce((acc, curr) => acc + curr.mrr, 0)
  const solicitacoesPendentes = clientes.filter(c => c.statusFinanceiro === 'Pendente' || c.progresso < 100).length

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans relative overflow-x-hidden">
      
      {/* Decorative background grid and neon lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-neon/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Clean Admin Navigation Header */}
      <header className="h-20 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 sm:px-8 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <Terminal className="text-brand-neon w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-space font-bold tracking-wider text-base text-white">
              AUTOMATION <span className="text-brand-neon">TEST</span>
            </span>
          </Link>
          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-mono hidden sm:inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            <ShieldAlert className="w-3 h-3 text-brand-neon" />
            Modo Master / Engenharia
          </span>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 rounded text-[10px] tracking-wider font-semibold hover:bg-white/5 text-gray-300 hover:text-white uppercase transition-all duration-300 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Área do Cliente
        </Link>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* Page Title Header */}
        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.3em] font-mono text-brand-neon uppercase font-semibold block">
            Painel Central / Administração
          </span>
          <h1 className="text-3xl sm:text-4xl font-space font-extrabold tracking-tight text-white uppercase">
            PAINEL ADMINISTRATIVO
          </h1>
          <p className="text-xs text-gray-500 font-light max-w-2xl leading-relaxed">
            Painel mestre para controle de status, evolução de entrega de cronogramas e faturamento recorrente dos clientes Automation Test.
          </p>
        </div>

        {/* Operational Metrics Cards (Row of 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total de Clientes', value: `${totalClientes} Ativos`, icon: Users },
            { label: 'Faturamento Recorrente (MRR)', value: `R$ ${totalMrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign },
            { label: 'Solicitações Pendentes', value: `${solicitacoesPendentes} Alertas`, icon: AlertTriangle, warning: solicitacoesPendentes > 0 }
          ].map((card, idx) => {
            const Icon = card.icon
            return (
              <div 
                key={idx} 
                className="bg-zinc-900/40 border border-white/10 p-6 rounded-lg backdrop-blur-sm relative overflow-hidden flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-sans font-bold tracking-wider text-gray-400 uppercase">
                    {card.label}
                  </span>
                  <Icon className={`w-5 h-5 ${card.warning ? 'text-yellow-400' : 'text-brand-neon'}`} />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-space font-extrabold tracking-tight text-white">
                    {card.value}
                  </span>
                  <p className="text-[9px] text-gray-500 font-mono mt-1 uppercase">Monitoramento em tempo real</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Client Management Table Card */}
        <div className="bg-zinc-900/40 border border-white/10 rounded-lg p-6 sm:p-8 backdrop-blur-sm space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-space font-bold text-white text-sm uppercase tracking-wider">
              CLIENTES E PROJETOS ATIVOS
            </h3>
            <p className="text-[10px] text-gray-500 font-mono mt-1">
              Gerencie a integridade financeira e o status de desenvolvimento visível para os clientes
            </p>
          </div>

          {/* Minimalist Dark Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-neon text-black text-[9px] tracking-wider font-bold rounded hover:shadow-[0_0_10px_rgba(204,255,0,0.3)] transition-all uppercase cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Editar Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

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
                    <span>Progresso do Projeto</span>
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
                      Fase Atual
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
                      Status Financeiro
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
                    Próxima Entrega
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
                    <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Recorrência Mensal (MRR)</span>
                    <button
                      type="button"
                      onClick={handleLancarFatura}
                      className="inline-flex items-center gap-1 text-[9px] font-mono text-brand-neon hover:underline uppercase"
                    >
                      <Plus className="w-3 h-3" />
                      Lançar Nova Fatura/Mensalidade
                    </button>
                  </div>

                  {isLancarFaturaOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid grid-cols-2 gap-4 bg-black/20 p-4 border border-white/5 rounded-lg"
                    >
                      <div className="space-y-2">
                        <label className="block text-[9px] font-mono text-gray-500 uppercase">Valor Mensalidade (R$)</label>
                        <input
                          type="number"
                          value={valorMensalidade}
                          onChange={(e) => setValorMensalidade(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 focus:border-brand-neon outline-none rounded px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[9px] font-mono text-gray-500 uppercase">Data de Vencimento</label>
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
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-neon text-black rounded text-[10px] tracking-wider font-bold hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all duration-300 uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Salvar Alterações
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
