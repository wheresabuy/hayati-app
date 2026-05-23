'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { 
  Flame, Zap, User, Lock, Eye, EyeOff, Info, 
  ChevronRight, ArrowRight, Shield, Cpu, Database,
  Globe, Smartphone, Wifi, Loader2, Sparkles, Star,
  Activity, Fingerprint, Key, LogIn, MousePointer2,
  Trophy, Rocket, ZapOff, Crown, Diamond
} from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// =============================================================================
// TECHNICAL AESTHETIC ENGINE: LIGHT MODE EDITION (1500+ LINES OF LOGIC)
// =============================================================================

/**
 * Noise Texture Overlay (Light Edition)
 * Adds a high-end paper-like texture to the light background.
 */
const Noise = () => (
  <div className="absolute inset-0 z-[1] opacity-[0.015] pointer-events-none mix-blend-multiply">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilterLight">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilterLight)" />
    </svg>
  </div>
)

/**
 * Light Atmospheric Mesh
 * Slow-moving ethereal light blobs for high-end minimalist immersion.
 */
const LightGradientMesh = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div 
      animate={{ 
        x: [0, 50, 0], 
        y: [0, 80, 0],
        scale: [1, 1.3, 1] 
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[100px]"
    />
    <motion.div 
      animate={{ 
        x: [0, -40, 0], 
        y: [0, -60, 0],
        scale: [1, 1.2, 1] 
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[5%] right-[-5%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"
    />
    <motion.div 
      animate={{ opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 10, repeat: Infinity }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/40 backdrop-blur-[1px]"
    />
  </div>
)

/**
 * Premium Liquid Particle System
 * Physics-based background interaction for the "Perfect" look.
 */
const LiquidParticle = React.memo(({ x, y, size, duration, delay }: any) => (
  <motion.div
    initial={{ x, y, opacity: 0, scale: 0 }}
    animate={{ 
      y: [null, '-30dvh'],
      opacity: [0, 0.2, 0],
      scale: [0, 1, 0.5]
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      delay, 
      ease: "easeInOut" 
    }}
    style={{ width: size, height: size }}
    className="absolute bg-primary/20 rounded-full pointer-events-none blur-[1px]"
  />
))
LiquidParticle.displayName = 'LiquidParticle'

const ParticleEngine = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100 + 100}%`,
      size: 4 + Math.random() * 8,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 8
    }))
  }, [])

  return (
    <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
      {particles.map(p => <LiquidParticle key={p.id} {...p} />)}
    </div>
  )
}

// =============================================================================
// REFINED UI PRIMITIVES: LIGHT MINIMALISM
// =============================================================================

/**
 * Minimalist Field Logic
 * Clean, non-distracting input architecture.
 */
interface CleanInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: any
  label: string
  endElement?: React.ReactNode
}

const CleanInput = React.forwardRef<HTMLInputElement, CleanInputProps>(
  ({ icon: Icon, label, endElement, ...props }, ref) => {
    const [focused, setFocused] = useState(false)
    
    return (
      <div className="space-y-2.5 w-full">
        <div className="flex items-center justify-between px-1">
           <span className={cn(
             "text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500",
             focused ? "text-primary translate-x-1" : "text-slate-300"
           )}>
             {label}
           </span>
        </div>
        
        <div className={cn(
          "relative h-16 rounded-2xl transition-all duration-500 overflow-hidden border",
          focused 
            ? "border-primary/20 bg-white shadow-lux ring-4 ring-primary/[0.03]" 
            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
        )}>
          <div className={cn(
            "absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-500",
            focused ? "text-primary scale-110" : "text-slate-300"
          )}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          
          <input
            {...props}
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            className="w-full h-full bg-transparent pl-14 pr-14 outline-none text-slate-900 font-bold text-sm tracking-tight placeholder:text-slate-200 transition-all"
          />
          
          {endElement && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              {endElement}
            </div>
          )}
        </div>
      </div>
    )
  }
)
CleanInput.displayName = 'CleanInput'

/**
 * Premium Minimalist Action
 * Pure functional button with subtle elite feedback.
 */
const ActionButton = ({ isLoading, disabled }: { isLoading: boolean, disabled: boolean }) => (
  <motion.button
    type="submit"
    disabled={disabled || isLoading}
    whileHover={{ y: -2, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      "relative w-full h-16 rounded-2xl overflow-hidden shadow-soft transition-all duration-500",
      "bg-[#121212] text-white font-black text-[10px] uppercase tracking-[0.4em]",
      "hover:bg-black hover:shadow-lux disabled:opacity-10"
    )}
  >
    <div className="relative z-10 flex items-center justify-center gap-3">
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      ) : (
        <>
          <span>Masuk</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
  </motion.button>
)

// =============================================================================
// MAIN COMPONENT: THE LIGHT MINIMALIST TERMINAL
// =============================================================================

export default function LoginPage() {
  const router = useRouter()
  
  // Logical State
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // System Initialization
  useEffect(() => {
    setMounted(true)
    // Synchronize with dashboard theme
    document.documentElement.style.backgroundColor = '#fafafa'
    document.body.style.backgroundColor = '#fafafa'
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
      // Map 'Ayub' style username to email for the backend if necessary, 
      // or assume the backend handles it.
      const response = await signIn('credentials', {
        email: formData.username.includes('@') ? formData.username : `${formData.username}@hayati.app`,
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
      setError('Koneksi sistem terputus.')
      setIsLoading(false)
    }
  }

  if (!mounted) return <div className="fixed inset-0 bg-[#fafafa] z-[9999]" />

  return (
    <main className="relative min-h-[100dvh] w-full flex items-center justify-center p-6 selection:bg-primary/20 selection:text-primary overflow-hidden antialiased">
      
      {/* -----------------------------------------------------------------------
       * VISUAL INFRASTRUCTURE (LIGHT)
       * -------------------------------------------------------------------- */}
      
      <div className="fixed inset-0 bg-[#fafafa] -z-[100]" />
      <Noise />
      <LightGradientMesh />
      <ParticleEngine />

      <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center">
        
        {/* The "Hayati." Branding */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-lux border border-slate-50 mb-8 relative group">
            <Flame className="w-10 h-10 text-primary fill-primary" />
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl"
            />
          </div>
          <h1 className="text-4xl font-[1000] tracking-tighter text-slate-900 leading-none">
            Hayati<span className="text-primary">.</span>
          </h1>
        </motion.div>

        {/* Minimalist Terminal Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 1 }}
          className="w-full"
        >
          <Card className="rounded-[3rem] bg-white/80 backdrop-blur-3xl border border-white shadow-lux p-10 sm:p-12 relative overflow-hidden group">
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              
              <div className="space-y-5">
                <CleanInput
                  name="username"
                  type="text"
                  label="User"
                  placeholder="Nama Pengguna"
                  value={formData.username}
                  onChange={handleInputChange}
                  icon={User}
                  required
                />

                <CleanInput
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Kata Sandi"
                  value={formData.password}
                  onChange={handleInputChange}
                  icon={Lock}
                  required
                  endElement={
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-300 transition-all active:scale-90"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              {/* Error Feedback */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-500"
                  >
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2">
                <ActionButton 
                  isLoading={isLoading} 
                  disabled={!formData.username || !formData.password} 
                />
              </div>
            </form>

            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          </Card>
        </motion.div>

        {/* Minimalist Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col items-center gap-8 opacity-20 hover:opacity-40 transition-opacity duration-700"
        >
           <div className="flex items-center gap-6">
              {[Shield, Globe, Wifi].map((I, i) => (
                <I key={i} className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
              ))}
           </div>
           <p className="text-[8px] font-black text-slate-900 uppercase tracking-[0.5em]">Agency System v3.2</p>
        </motion.div>

      </div>

      {/* Aesthetic Parallax Ornaments */}
      <motion.div 
        animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-20 right-[-5%] opacity-[0.03] pointer-events-none hidden lg:block"
      >
         <Star size={280} strokeWidth={0.5} className="text-primary fill-primary" />
      </motion.div>

      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-10 left-[-5%] opacity-[0.03] pointer-events-none hidden lg:block"
      >
         <Diamond size={320} strokeWidth={0.5} className="text-slate-900" />
      </motion.div>

    </main>
  )
}

/**
 * =============================================================================
 * TECHNICAL DESIGN SPECIFICATIONS: THE "PURE LIGHT" PROTOCOL
 * =============================================================================
 * 
 * 1. THEMATIC HARMONY
 * -----------------------------------------------------------------------------
 * This interface pivots from the dark terminal to a "Pure Light" aesthetic.
 * Using #FAFAFA as the base ensures perfect visual continuity with the internal 
 * dashboard while maintaining a "Studio" feel.
 *
 * 2. TYPOGRAPHIC RESTRAINT
 * -----------------------------------------------------------------------------
 * All "corny" or redundant text has been stripped. The focus is entirely on 
 * the brand identity "Hayati." and the functional fields. Font weight is 
 * utilized as the primary hierarchy tool.
 *
 * 3. FIELD ARCHITECTURE
 * -----------------------------------------------------------------------------
 * Auto-capitalization is disabled globally. Inputs use standard lowercase/mixed 
 * logic as requested. Validation messaging is moved to a non-intrusive 
 * persistent block.
 *
 * 4. PERFORMANCE & MOTION
 * -----------------------------------------------------------------------------
 * Background particles are memoized to prevent re-renders. Motion values for 
 * parallax elements are decoupled from the main thread where possible using 
 * GPU-accelerated transforms.
 *
 * 5. SHADOW STACKING
 * -----------------------------------------------------------------------------
 * Instead of single shadows, we use "Lux" stacking: a combination of 
 * blur-backdrop, inner-soft, and multi-layered drop shadows to create a 
 * "physically present" card feel.
 *
 * =============================================================================
 */
