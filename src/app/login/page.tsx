'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Flame, User, Lock, Eye, EyeOff, Info, 
  ArrowRight, Loader2, Sparkles, Shield, Zap
} from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.style.backgroundColor = '#FFFDF9'
    document.body.style.backgroundColor = '#FFFDF9'
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username || !formData.password || isLoading) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await signIn('credentials', {
        username: formData.username.trim(),
        password: formData.password,
        redirect: false
      })

      if (response?.error) {
        setError('Otentikasi gagal.')
        setIsLoading(false)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('Koneksi terputus.')
      setIsLoading(false)
    }
  }

  if (!mounted) return <div className="fixed inset-0 bg-[#FFFDF9]" />

  return (
    <main className="relative min-h-[100dvh] w-full flex items-center justify-center p-8 selection:bg-[#2D5BFF]/5 selection:text-[#2D5BFF] antialiased overflow-hidden">
      
      {/* 8K-FIDELITY BACKGROUND */}
      <div className="fixed inset-0 bg-[#FFFDF9] -z-[100]" />
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-15%] w-[70%] h-[70%] bg-[#2D5BFF]/5 rounded-full blur-[140px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF6B00]/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
        
        {/* BRANDING: GEOMETRIC CONTINUITY */}
        <motion.div 
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-22 h-22 squircle bg-[#1A1D1E] shadow-geometric mb-10 relative group">
            <Flame className="w-11 h-11 text-[#2D5BFF] fill-[#2D5BFF] group-hover:rotate-12 transition-transform duration-500" />
            <motion.div 
              animate={{ opacity: [0, 0.6, 0], scale: [1, 1.4, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-[#2D5BFF]/10 blur-3xl rounded-full"
            />
          </div>
          <h1 className="text-5xl font-black tracking-[-0.04em] text-[#1A1D1E] leading-none uppercase italic">
            Hayati<span className="text-[#2D5BFF] not-italic">.</span>
          </h1>
        </motion.div>

        {/* SQUIRCLE TERMINAL FORM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <Card className="squircle bg-white border border-slate-50 shadow-geometric p-12 sm:p-14 relative overflow-hidden group">
            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              
              <div className="space-y-8">
                {/* IDENTITY INPUT */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Identity</span>
                  </div>
                  <div className="relative h-18 rounded-[1.75rem] bg-[#F8F9FA] btn-stroke focus-within:bg-white focus-within:border-[#2D5BFF]/30 focus-within:ring-8 focus-within:ring-[#2D5BFF]/[0.02] transition-all duration-500">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      name="username"
                      type="text"
                      placeholder="User"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      autoCapitalize="none"
                      className="w-full h-full bg-transparent pl-16 pr-6 outline-none text-[#1A1D1E] font-extrabold text-base tracking-tight placeholder:text-slate-200"
                    />
                  </div>
                </div>

                {/* TOKEN INPUT */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Token</span>
                  </div>
                  <div className="relative h-18 rounded-[1.75rem] bg-[#F8F9FA] btn-stroke focus-within:bg-white focus-within:border-[#2D5BFF]/30 focus-within:ring-8 focus-within:ring-[#2D5BFF]/[0.02] transition-all duration-500">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full h-full bg-transparent pl-16 pr-16 outline-none text-[#1A1D1E] font-extrabold text-base tracking-tight placeholder:text-slate-200"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-300 hover:text-[#1A1D1E] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* DYNAMIC FEEDBACK */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-2xl bg-[#FF6B00]/5 border border-[#FF6B00]/10 flex items-center gap-4 text-[#FF6B00]"
                  >
                    <Info className="w-5 h-5 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTION: GEOMETRIC CLAYMORPHISM */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !formData.username || !formData.password}
                  className="geometric-cta w-full h-20 rounded-[2rem] text-white flex items-center justify-center gap-6 disabled:opacity-20 active:scale-95 transition-all shadow-orange-glow"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                       <span className="text-[13px] font-black uppercase tracking-[0.5em]">Masuk</span>
                       <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* GEOMETRIC FOOTER */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 flex flex-col items-center gap-10 opacity-30 hover:opacity-60 transition-opacity"
        >
           <div className="flex items-center gap-8">
              {[Shield, Sparkles, Zap].map((I, i) => (
                <I key={i} className="w-5 h-5 text-[#1A1D1E]" strokeWidth={2.5} />
              ))}
           </div>
           <div className="space-y-3 text-center">
              <p className="text-[10px] font-black text-[#1A1D1E] uppercase tracking-[0.8em]">8K Fidelity Platform</p>
              <div className="flex items-center justify-center gap-4">
                 <div className="h-px w-8 bg-[#1A1D1E]/20" />
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Hayati Intelligence</p>
                 <div className="h-px w-8 bg-[#1A1D1E]/20" />
              </div>
           </div>
        </motion.div>

      </div>

    </main>
  )
}
