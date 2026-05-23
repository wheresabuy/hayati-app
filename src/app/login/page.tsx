'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Flame, User, Lock, Eye, EyeOff, Info, 
  ArrowRight, Loader2, Sparkles, Shield
} from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * REFINED EXECUTIVE LOGIN TERMINAL
 * Strictly Minimalist - High Fidelity Business Aesthetic
 */
export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.style.backgroundColor = '#FDFBF7'
    document.body.style.backgroundColor = '#FDFBF7'
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

  if (!mounted) return <div className="fixed inset-0 bg-[#FDFBF7]" />

  return (
    <main className="relative min-h-[100dvh] w-full flex items-center justify-center p-6 selection:bg-[#6488EA]/20 selection:text-[#6488EA] antialiased">
      
      {/* SOLID EXECUTIVE BACKGROUND */}
      <div className="fixed inset-0 bg-[#FDFBF7] -z-[100]" />
      
      {/* SUBTLE TEXTURE */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center">
        
        {/* BRAND IDENTITY: ABSOLUTE MINIMALISM */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-subtle border border-slate-100 mb-8">
            <Flame className="w-8 h-8 text-[#6488EA] fill-[#6488EA]" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#2C3338] leading-none uppercase">
            Hayati<span className="text-[#6488EA]">.</span>
          </h1>
        </motion.div>

        {/* TERMINAL FORM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 1 }}
          className="w-full"
        >
          <Card className="rounded-[2.5rem] bg-white border border-slate-100 shadow-executive p-10 sm:p-12 relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              
              <div className="space-y-5">
                {/* USER FIELD */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">User</label>
                  <div className="relative h-16 rounded-2xl border border-slate-100 bg-slate-50/50 focus-within:bg-white focus-within:border-[#6488EA]/30 focus-within:ring-4 focus-within:ring-[#6488EA]/[0.03] transition-all duration-300">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                    <input
                      name="username"
                      type="text"
                      placeholder="Nama Pengguna"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full h-full bg-transparent pl-14 pr-6 outline-none text-[#2C3338] font-bold text-sm"
                    />
                  </div>
                </div>

                {/* PASSWORD FIELD */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">Password</label>
                  <div className="relative h-16 rounded-2xl border border-slate-100 bg-slate-50/50 focus-within:bg-white focus-within:border-[#6488EA]/30 focus-within:ring-4 focus-within:ring-[#6488EA]/[0.03] transition-all duration-300">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Kata Sandi"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full h-full bg-transparent pl-14 pr-14 outline-none text-[#2C3338] font-bold text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* ERROR BLOCK */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl bg-[#D96B6B]/5 border border-[#D96B6B]/10 flex items-center gap-3 text-[#D96B6B]"
                  >
                    <Info className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CLAYMORPHISM ACTION */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !formData.username || !formData.password}
                  className="clay-btn w-full h-16 rounded-2xl text-white font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 disabled:opacity-20"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Masuk</span>}
                </button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* FOOTER: CLEAN SYSTEM INFO */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-col items-center gap-6 opacity-20"
        >
           <Shield className="w-5 h-5 text-[#2C3338]" strokeWidth={2.5} />
           <p className="text-[8px] font-black text-[#2C3338] uppercase tracking-[0.5em]">Enterprise Terminal v3.2</p>
        </motion.div>

      </div>

    </main>
  )
}
