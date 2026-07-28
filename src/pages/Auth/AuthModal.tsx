import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Loader2, CreditCard, Shield, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { signUpUser } from '../../services/authService'
import { fetchProducts } from '../../services/productService'
import type { Product } from '../../types/database'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialProductSlug?: string
}

export default function AuthModal({ isOpen, onClose, initialProductSlug }: AuthModalProps) {
  const navigate = useNavigate()
  
  // Lista de produtos para seleção dinâmica
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Estados do Formulário
  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ'>('PF')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [telefone, setTelefone] = useState('')
  
  // Endereço
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  // Estados de controle
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Carrega produtos para preenchimento
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts()
        setProducts(data)
        
        // Pré-seleciona se um slug foi fornecido
        if (initialProductSlug) {
          const found = data.find(p => p.slug === initialProductSlug)
          if (found) setSelectedProduct(found)
        } else if (data.length > 0) {
          setSelectedProduct(data[0])
        }
      } catch (err) {
        console.error('Erro ao carregar produtos no modal:', err)
      }
    }
    if (isOpen) {
      loadProducts()
    }
  }, [isOpen, initialProductSlug])

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const product = products.find(p => p.id === e.target.value)
    if (product) setSelectedProduct(product)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validações básicas obrigatórias
    if (!email || !password || !telefone || !cep || !logradouro || !numero || !bairro || !cidade || !estado) {
      setError('Por favor, preencha todos os dados de login e endereço.')
      return
    }

    if (tipoPessoa === 'PF') {
      if (!nomeCompleto || !cpf) {
        setError('Por favor, preencha o Nome Completo e CPF para cadastro Pessoa Física.')
        return
      }
    } else {
      if (!razaoSocial || !cnpj || !nomeCompleto) {
        setError('Por favor, preencha Razão Social, CNPJ e Nome do Representante para cadastro Pessoa Jurídica.')
        return
      }
    }

    if (!selectedProduct) {
      setError('Por favor, selecione um produto para contratar.')
      return
    }

    setIsLoading(true)

    try {
      // Monta objeto de metadados
      const userMetadata = {
        tipo_pessoa: tipoPessoa,
        razao_social: tipoPessoa === 'PJ' ? razaoSocial : null,
        cnpj: tipoPessoa === 'PJ' ? cnpj : null,
        nome_completo: nomeCompleto,
        cpf: tipoPessoa === 'PF' ? cpf : null,
        data_nascimento: tipoPessoa === 'PF' ? dataNascimento || null : null,
        telefone,
        endereco: {
          cep,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado
        },
        dados_adicionais: {
          produto_contratado_id: selectedProduct.id,
          produto_contratado_nome: selectedProduct.nome,
          produto_contratado_slug: selectedProduct.slug,
          setup_total: selectedProduct.valor_implementacao,
          entrada_obrigatoria: selectedProduct.valor_implementacao * 0.5,
          mensalidade: selectedProduct.valor_mensalidade,
          data_solicitacao: new Date().toISOString()
        }
      }

      await signUpUser(email, password, userMetadata)
      
      // Fecha o modal e navega para o dashboard (que estará em tela de pagamento bloqueado)
      onClose()
      navigate('/dashboard')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Falha ao realizar o cadastro. Tente outro e-mail.')
    } finally {
      setIsLoading(false)
    }
  }

  // Preços
  const setupTotal = selectedProduct?.valor_implementacao || 0
  const entradaObrigatoria = setupTotal * 0.5
  const mensalidade = selectedProduct?.valor_mensalidade || 0

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden">
        {/* Backdrop glassmorphism */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050505] backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl h-[85vh] max-h-[750px] bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col lg:flex-row overflow-hidden shadow-2xl z-10"
        >
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 p-2 text-zinc-400 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 rounded-full transition-all animate-none"
          >
            <X className="w-5 h-5"/>
          </button>

          {/* Left Column: Resumo Financeiro Tech-Luxo */}
          <div className="w-full lg:w-5/12 bg-zinc-900/50 p-6 border-b lg:border-b-0 lg:border-r border-zinc-800 overflow-y-auto">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-neon/[0.02] blur-xl rounded-full pointer-events-none" />
            
            <div className="space-y-6">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-brand-neon font-mono font-bold block mb-1">Passo de Engenharia</span>
                <h3 className="font-space font-extrabold text-white text-lg uppercase tracking-wider">Checkout Comercial</h3>
                <p className="font-sans text-xs text-gray-400 font-light mt-1">
                  Revise o escopo e o investimento necessário para ativação do seu ecossistema.
                </p>
              </div>

              {/* Seletor de Produto se não for fixado */}
              <div className="space-y-2">
                <label className="block text-[9px] tracking-widest text-gray-500 font-mono uppercase">
                  Produto Selecionado
                </label>
                <select 
                  value={selectedProduct?.id || ''}
                  onChange={handleProductChange}
                  disabled={!!initialProductSlug || isLoading}
                  className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 font-sans tracking-wide outline-none focus:border-brand-neon transition-all"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>

              {/* Bloco de Resumo Financeiro com 50% de entrada */}
              <div className="bg-black/40 border border-white/5 rounded-lg p-5 space-y-4 backdrop-blur-sm relative">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-neon/20 to-transparent" />
                
                <h4 className="font-space font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-brand-neon" />
                  Demonstrativo de Valores
                </h4>

                <div className="space-y-3 font-mono text-xs pt-2">
                  <div className="flex justify-between items-center text-gray-500">
                    <span>SETUP DE IMPLEMENTAÇÃO</span>
                    <span className="text-white">
                      {setupTotal > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(setupTotal) : 'Gratuito'}
                    </span>
                  </div>

                  {/* ENTRADA DE 50% EM DESTAQUE NEON */}
                  <div className="bg-brand-neon/5 border border-brand-neon/20 rounded p-3 flex justify-between items-center relative overflow-hidden group">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-brand-neon font-bold uppercase tracking-wider block">ENTRADA OBRIGATÓRIA (50%)</span>
                      <span className="text-[9px] text-gray-500 font-light block">Devido agora no checkout</span>
                    </div>
                    <span className="text-sm font-extrabold text-brand-neon tracking-tight">
                      {entradaObrigatoria > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entradaObrigatoria) : 'R$ 0,00'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-500 pt-1">
                    <span>MENSALIDADE RECORRENTE</span>
                    <span className="text-white font-bold">
                      {mensalidade > 0 ? `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mensalidade)}/mês` : 'Isento'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-brand-neon/60" />
                <span>Liberação Automática via PIX</span>
              </div>
              <p className="font-sans text-[9px] tracking-wide text-gray-500 leading-relaxed font-light lowercase">
                *após o cadastro, sua conta nascerá em estado pendente de faturamento. O painel completo será ativado após a compensação dos 50% de entrada.
              </p>
            </div>
          </div>

          {/* Lado Direito - Formulário com Scroll Interno Garantido */}
          <div className="w-full lg:w-7/12 p-6 sm:p-8 overflow-y-auto flex-1 h-full scrollbar-thin scrollbar-thumb-zinc-700">
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-space font-extrabold text-white text-base uppercase tracking-wider">Crie Seu Acesso</h3>
              <p className="font-sans text-xs text-gray-400 font-light mt-1">
                Forneça os dados de faturamento e login.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Tipo de Pessoa Toggle (PF/PJ) */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTipoPessoa('PF')}
                className={`py-3 rounded border text-xs tracking-wider uppercase font-mono transition-all cursor-pointer ${
                  tipoPessoa === 'PF' 
                    ? 'bg-brand-neon text-black font-bold border-brand-neon shadow-[0_0_10px_rgba(204,255,0,0.25)]' 
                    : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                Pessoa Física (PF)
              </button>
              <button
                type="button"
                onClick={() => setTipoPessoa('PJ')}
                className={`py-3 rounded border text-xs tracking-wider uppercase font-mono transition-all cursor-pointer ${
                  tipoPessoa === 'PJ' 
                    ? 'bg-brand-neon text-black font-bold border-brand-neon shadow-[0_0_10px_rgba(204,255,0,0.25)]' 
                    : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                Pessoa Jurídica (PJ)
              </button>
            </div>

            {/* Grid de Campos Dinâmicos conforme PF/PJ */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tipoPessoa === 'PF' ? (
                  <>
                    <div className="space-y-1">
                      <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Nome Completo</label>
                      <input
                        type="text"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        placeholder="Nome do titular"
                        className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">CPF</label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Data de Nascimento</label>
                      <input
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Razão Social</label>
                      <input
                        type="text"
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                        placeholder="Razão Social da Empresa"
                        className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">CNPJ</label>
                      <input
                        type="text"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="00.000.000/0000-00"
                        className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Representante Legal</label>
                      <input
                        type="text"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        placeholder="Nome completo do representante"
                        className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Login Credentials & Contato */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">E-mail Corporativo</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@empresa.com"
                    className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Telefone</label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                  />
                </div>
                <div className="space-y-1 sm:col-span-3">
                  <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Senha de Acesso</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Defina uma senha robusta"
                    className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="block text-[9px] tracking-widest text-gray-500 font-mono uppercase mb-2">Endereço de Faturamento</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">CEP</label>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Estado</label>
                    <input
                      type="text"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      placeholder="UF"
                      className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Logradouro</label>
                    <input
                      type="text"
                      value={logradouro}
                      onChange={(e) => setLogradouro(e.target.value)}
                      placeholder="Rua, Av, Travessa..."
                      className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Número</label>
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="Nº"
                      className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Complemento</label>
                    <input
                      type="text"
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                      placeholder="Apto, Bloco..."
                      className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Bairro</label>
                    <input
                      type="text"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="Bairro"
                      className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[9px] tracking-widest text-gray-400 font-mono uppercase">Cidade</label>
                    <input
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Cidade"
                      className="w-full bg-black border border-white/10 text-xs text-white rounded p-3 outline-none focus:border-brand-neon transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-neon text-black font-extrabold rounded text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(204,255,0,0.45)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Cadastrando e Gerando Cobrança...
                </>
              ) : (
                'CONTRATAR AGORA & FINALIZAR'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>,
  document.body
  )
}
