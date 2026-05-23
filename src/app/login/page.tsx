'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Flame, ShieldCheck, Fingerprint, ArrowRight, Zap, 
  Sparkles, Lock, Mail, Eye, EyeOff, Globe, 
  Smartphone, Shield, ChevronRight, CheckCircle2,
  Cpu, Database, Cloud, Wifi, Info, Star, Heart
} from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

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
    className={cn("absolute opacity-10", className)}
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
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30 selection:text-primary">
      
      {/* Immersive Background Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        <ParticleBackground />
        
        {/* Floating Abstract Shapes */}
        <FloatingIcon icon={Shield} delay={0} className="top-20 -left-20 text-primary" />
        <FloatingIcon icon={Cpu} delay={2} className="bottom-20 -right-20 text-blue-500" />
        <FloatingIcon icon={Database} delay={4} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        
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
          <h1 className="text-4xl font-[1000] tracking-tighter text-white mb-2">HAYATI<span className="text-primary">.</span></h1>
          <div className="flex items-center justify-center gap-3">
             <div className="h-px w-8 bg-white/10" />
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Elite Agency Terminal</p>
             <div className="h-px w-8 bg-white/10" />
          </div>
        </motion.div>

        {/* Main Auth Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#121212]/80 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden group"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-[950] text-white tracking-tight">Security Check</h3>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                    Masukkan identitas digital Anda untuk mengakses jaringan Hayati.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="group/input relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input 
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-16 pl-16 pr-6 bg-white/5 border border-white/5 rounded-2xl text-white font-bold text-sm focus:bg-white/10 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-white/10"
                    />
                  </div>

                  <div className="group/input relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Security Token"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-16 pl-16 pr-16 bg-white/5 border border-white/5 rounded-2xl text-white font-bold text-sm focus:bg-white/10 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-white/10"
                    />
                    <button 
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
                    <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                  </motion.div>
                )}

                <button 
                  onClick={() => email && password && setStep(2)}
                  disabled={!email || !password}
                  className="w-full h-16 rounded-2xl bg-white text-black font-[1000] text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-20 shadow-xl"
                >
                  Verify Identity <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                   <button onClick={() => setStep(1)} className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-primary transition-colors mb-4">
                      <ChevronRight className="w-3 h-3 rotate-180" /> Back to Credentials
                   </button>
                   <h3 className="text-2xl font-[950] text-white tracking-tight">Biometric Link</h3>
                   <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                      Konfirmasi akses melalui protokol enkripsi tingkat lanjut.
                   </p>
                </div>

                <div className="flex flex-col items-center justify-center py-10 relative">
                   <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                   <motion.div
                     initial={{ scale: 0.8 }}
                     animate={{ scale: [0.8, 1.1, 1] }}
                     transition={{ duration: 0.5 }}
                     className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-2xl shadow-primary/40 relative z-10"
                   >
                      <Fingerprint className="w-16 h-16 text-white stroke-[1.5]" />
                      <motion.div 
                        className="absolute inset-0 border-2 border-white rounded-[2.5rem]"
                        animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                   </motion.div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">AES-256 Encrypted Connection</span>
                   </div>
                   <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/5">
                      <Wifi className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Verified Workstation ID</span>
                   </div>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl bg-primary text-white font-[1000] text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-primary/20"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Zap className="w-4 h-4" /> Finalize Login</>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all duration-1000" />
        </motion.div>

        {/* System Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 space-y-8"
        >
          <div className="grid grid-cols-3 gap-4">
             {[
               { icon: Globe, label: 'Secure' },
               { icon: Shield, label: 'Encrypted' },
               { icon: Smartphone, label: 'PWA Ready' }
             ].map((f, i) => (
               <div key={i} className="flex flex-col items-center gap-3 opacity-30 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">{f.label}</span>
               </div>
             ))}
          </div>

          <div className="pt-8 border-t border-white/5 text-center space-y-3">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">System Core v3.2.0-Premium</p>
            <div className="flex items-center justify-center gap-4">
               <div className="w-1 h-1 rounded-full bg-primary/40" />
               <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">© 2026 Hayati Intelligence Network</p>
               <div className="w-1 h-1 rounded-full bg-primary/40" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Extreme Visual Flair */}
      <div className="fixed top-10 left-10 opacity-20 hidden lg:block">
         <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-1 h-10 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   className="w-full h-1/2 bg-primary"
                   animate={{ y: [0, 40, 0] }}
                   transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                 />
              </div>
            ))}
         </div>
      </div>

      <div className="fixed bottom-10 right-10 opacity-20 hidden lg:block">
         <div className="text-right">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Terminal Connection</p>
            <div className="flex items-center justify-end gap-2 mt-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-black text-emerald-500 uppercase">Live Ops</span>
            </div>
         </div>
      </div>

    </div>
  )
}
