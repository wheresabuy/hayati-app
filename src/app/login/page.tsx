'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Flame, ArrowRight, Zap, Lock, Mail, Eye, EyeOff, Globe, 
  Smartphone, Shield, Info, Cpu, Database
} from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5
          }}
          animate={{ 
            y: [null, Math.random() * -100 + "%"],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

const FloatingIcon = ({ icon: Icon, delay, className }: any) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    className={className}
    style={{ position: 'absolute', opacity: 0.1 }}
  >
    <Icon size={120} strokeWidth={0.5} />
  </motion.div>
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || isLoading) return
    
    setIsLoading(true)
    setError('')
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      if (result?.error) {
        setError('Akses ditolak. Periksa kembali kredensial Anda.')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center p-6 selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      
      {/* SOLID FIXED BACKGROUND - Fixes the "white box" issue on scroll/bounce */}
      <div className="fixed inset-0 bg-[#050505] -z-[100]" />
      
      {/* Immersive Visual Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        <ParticleBackground />
        
        <FloatingIcon icon={Shield} delay={0} className="top-20 -left-20 text-primary" />
        <FloatingIcon icon={Cpu} delay={2} className="bottom-20 -right-20 text-blue-500" />
        <FloatingIcon icon={Database} delay={4} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
      </div>

      <div className="w-full max-w-[440px] relative z-10 py-12">
        
        {/* Branding Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#121212] to-black border border-white/10 shadow-2xl mb-6 relative group">
            <Flame className="w-10 h-10 text-primary fill-primary group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 rounded-[2rem] bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h1 className="text-4xl font-[1000] tracking-tighter text-white mb-2 uppercase">HAYATI</h1>
          <div className="flex items-center justify-center gap-3">
             <div className="h-px w-8 bg-white/10" />
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Agency Terminal</p>
             <div className="h-px w-8 bg-white/10" />
          </div>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#121212]/90 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <h3 className="text-2xl font-[1000] text-white tracking-tight uppercase">Login Access</h3>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                Identifikasi diperlukan untuk akses terminal.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 pl-16 pr-6 bg-white/5 border border-white/5 rounded-2xl text-white font-black text-xs tracking-widest focus:bg-white/10 focus:border-primary/30 outline-none transition-all placeholder:text-white/10 uppercase"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 pl-16 pr-16 bg-white/5 border border-white/5 rounded-2xl text-white font-black text-xs tracking-widest focus:bg-white/10 focus:border-primary/30 outline-none transition-all placeholder:text-white/10 uppercase"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400"
              >
                <Info className="w-4 h-4 shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">{error}</span>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-16 rounded-2xl bg-primary text-white font-[1000] text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-20 shadow-xl shadow-primary/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>Authorize <Zap className="w-4 h-4 fill-current" /></>
              )}
            </button>
          </form>
          
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        </motion.div>

        {/* Footer Features */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 space-y-12"
        >
          <div className="grid grid-cols-3 gap-8">
             {[
               { icon: Globe, label: 'GLOBAL' },
               { icon: Shield, label: 'SECURE' },
               { icon: Smartphone, label: 'HYBRID' }
             ].map((f, i) => (
               <div key={i} className="flex flex-col items-center gap-3 opacity-20 hover:opacity-50 transition-opacity cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                    <f.icon className="w-6 h-6 text-white stroke-[1.5]" />
                  </div>
                  <span className="text-[7px] font-black text-white uppercase tracking-[0.4em]">{f.label}</span>
               </div>
             ))}
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 opacity-10">
               <div className="h-px flex-1 bg-white" />
               <p className="text-[7px] font-black text-white uppercase tracking-[0.8em]">v3.2.0 PREMIUM</p>
               <div className="h-px flex-1 bg-white" />
            </div>
            <p className="text-[7px] font-bold text-white/10 uppercase tracking-[0.2em]">© 2026 Hayati Intelligence Terminal. All Rights Reserved.</p>
          </div>
        </motion.div>

      </div>

      {/* Connection Status Decorator */}
      <div className="fixed bottom-10 right-10 opacity-20 pointer-events-none">
         <div className="text-right space-y-1">
            <p className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Connection Status</p>
            <div className="flex items-center justify-end gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
               <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Stable</span>
            </div>
         </div>
      </div>

    </div>
  )
}
