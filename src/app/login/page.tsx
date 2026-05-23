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
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
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
    <main className="relative min-h-[100dvh] w-full flex items-center justify-center p-8 selection:bg-[#2D5BFF]/10 selection:text-[#2D5BFF] antialiased overflow-hidden">
      
      {/* VIBRANT BACKGROUND LAYERS */}
      <div className="fixed inset-0 bg-[#FFFDF9] -z-[100]" />
      
      {/* Atmospheric Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#2D5BFF]/5 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF6B00]/5 rounded-full blur-[100px]"
        />
      </div>

      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
        
        {/* BRAND IDENTITY: VIBRANT & CLEAN */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[1.75rem] bg-[#1A1D1E] shadow-vibrant mb-10 group relative">
            <Flame className="w-10 h-10 text-[#2D5BFF] fill-[#2D5BFF] group-hover:rotate-12 transition-transform duration-500" />
            <motion.div 
              animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-[#2D5BFF]/20 blur-2xl rounded-full"
            />
          </div>
          <h1 className="text-5xl font-[1000] tracking-[-0.04em] text-[#1A1D1E] leading-none uppercase italic">
            Hayati<span className="text-[#2D5BFF] not-italic">.</span>
          </h1>
        </motion.div>

        {/* VIBRANT SQUIRCLE FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', damping: 20 }}
          className="w-full"
        >
          <Card className="squircle bg-white border border-slate-50 shadow-vibrant p-12 sm:p-14 relative overflow-hidden group">
            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              
              <div className="space-y-6">
                {/* USER FIELD */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Identity</span>
                  </div>
                  <div className="relative h-18 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50/30 focus-within:bg-white focus-within:border-[#2D5BFF]/20 focus-within:ring-8 focus-within:ring-[#2D5BFF]/[0.02] transition-all duration-500">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      name="username"
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      autoCapitalize="none"
                      className="w-full h-full bg-transparent pl-16 pr-6 outline-none text-[#1A1D1E] font-extrabold text-base placeholder:text-slate-200"
                    />
                  </div>
                </div>

                {/* PASSWORD FIELD */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Token</span>
                  </div>
                  <div className="relative h-18 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50/30 focus-within:bg-white focus-within:border-[#2D5BFF]/20 focus-within:ring-8 focus-within:ring-[#2D5BFF]/[0.02] transition-all duration-500">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full h-full bg-transparent pl-16 pr-16 outline-none text-[#1A1D1E] font-extrabold text-base placeholder:text-slate-200"
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

              {/* ERROR FEEDBACK */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-2xl bg-[#FF6B00]/5 border border-[#FF6B00]/10 flex items-center gap-4 text-[#FF6B00]"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
                       <Info className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTION: VIBRANT CLAYMORPHISM */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !formData.username || !formData.password}
                  className="clay-cta w-full h-20 rounded-[2rem] text-white flex items-center justify-center gap-5 disabled:opacity-20 active:scale-95 transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                       <span className="text-[12px] font-black uppercase tracking-[0.5em]">Masuk</span>
                       <Zap className="w-5 h-5 fill-current" />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Subtle Texture Decorator */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#2D5BFF]/5 rounded-full blur-3xl pointer-events-none" />
          </Card>
        </motion.div>

        {/* VIBRANT FOOTER */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex flex-col items-center gap-8 opacity-40 group"
        >
           <div className="flex items-center gap-6">
              {[Shield, Sparkles, Zap].map((I, i) => (
                <I key={i} className="w-5 h-5 text-[#1A1D1E] group-hover:text-[#2D5BFF] transition-colors" />
              ))}
           </div>
           <div className="space-y-2 text-center">
              <p className="text-[9px] font-black text-[#1A1D1E] uppercase tracking-[0.6em]">System Matrix v3.2.0</p>
              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">© 2026 Hayati Intelligence Terminal</p>
           </div>
        </motion.div>

      </div>

    </main>
  )
}
