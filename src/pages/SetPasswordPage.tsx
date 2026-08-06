import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

export default function SetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || password.length < 6) {
      setErrorMsg('A senha deve conter no mínimo 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.')
      return
    }

    setLoading(true)
    setErrorMsg(null)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        throw error
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Falha ao definir nova senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-[85vh] bg-[#050505] text-white flex items-center justify-center py-16 px-4 font-sans relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-neon/5 blur-[160px] rounded-full pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-900/60 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6 relative"
        >
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neon to-transparent" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-brand-neon/10 border border-brand-neon/30 flex items-center justify-center text-brand-neon mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-brand-neon uppercase font-bold tracking-[0.25em] block">
              PORTAL DO CLIENTE • BACKSTAGE
            </span>
            <h2 className="text-2xl font-space font-extrabold text-white uppercase tracking-tight">
              Definir Senha de Acesso
            </h2>
            <p className="text-xs text-gray-400 font-light font-sans">
              Crie sua senha de segurança para acessar seu painel exclusivo de projetos.
            </p>
          </div>

          {success ? (
            <div className="p-6 bg-brand-neon/10 border border-brand-neon/30 rounded-xl text-center space-y-3 font-mono">
              <CheckCircle2 className="w-10 h-10 text-brand-neon mx-auto" />
              <h3 className="font-bold text-white uppercase text-sm">SENHA CONFIGURADA COM SUCESSO!</h3>
              <p className="text-xs text-gray-300">Redirecionando você para o seu Dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono">
              
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest block">NOVA SENHA</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest block">CONFIRMAR SENHA</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha digitada"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-brand-neon focus:outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-neon text-black font-space font-extrabold text-xs uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    SALVANDO SENHA...
                  </>
                ) : (
                  <>
                    DEFINIR SENHA E ACESSAR DASHBOARD
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

        </motion.div>
      </div>
    </Layout>
  )
}
