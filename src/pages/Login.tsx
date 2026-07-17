import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Terminal, Shield, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    setIsLoading(true)
    
    // Simulate API loading
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
      navigate('/dashboard')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center relative px-6 overflow-hidden">
      
      {/* Decorative Neon Ambient Light (Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-neon/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />

      {/* Main Login Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-zinc-900/40 border border-white/10 rounded-lg p-8 sm:p-10 relative overflow-hidden backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-white/15 transition-colors duration-300"
      >
        {/* Subtle top neon stripe line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon/50 to-transparent" />

        <div className="flex flex-col items-center mb-8">
          {/* Logo block */}
          <Link to="/" className="flex items-center gap-2 group mb-6">
            <Terminal className="text-brand-neon w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-space font-bold tracking-widest text-base text-white">
              AUTOMATION <span className="text-brand-neon">TEST</span>
            </span>
          </Link>
          
          {/* Micro-Mono Subtitle */}
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400 font-mono text-center">
            Área do Cliente
          </span>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-xs tracking-wider uppercase font-mono text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input field */}
          <div className="space-y-2">
            <label className="block text-[10px] tracking-widest text-gray-400 font-mono">
              E-mail Corporativo
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                disabled={isLoading}
                className="w-full bg-zinc-900 text-white border border-zinc-800 focus:border-brand-neon focus:bg-black focus:ring-1 focus:ring-brand-neon/30 outline-none transition-all duration-300 rounded px-4 py-3 text-sm placeholder-gray-600 font-sans tracking-wide"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] tracking-widest text-gray-400 font-mono">
                Senha de Acesso
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white border border-zinc-800 focus:border-brand-neon focus:bg-black focus:ring-1 focus:ring-brand-neon/30 outline-none transition-all duration-300 rounded px-4 py-3 text-sm placeholder-gray-600 font-sans tracking-wide"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={!isLoading ? { 
              scale: 1.02,
              boxShadow: "0 0 20px rgba(204, 255, 0, 0.45)"
            } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-brand-neon text-black font-bold rounded text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Conectando...
              </span>
            ) : (
              <>
                Entrar no Painel
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Security badge & back link */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-[9px] font-mono tracking-widest uppercase">
            <Shield className="w-3 h-3 text-brand-neon/60" />
            Conexão Criptografada SSL
          </div>
          
          <Link
            to="/"
            className="text-[10px] text-gray-500 hover:text-white transition-colors duration-200 block text-center uppercase tracking-widest font-mono py-1"
          >
            ← Voltar para o site
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
