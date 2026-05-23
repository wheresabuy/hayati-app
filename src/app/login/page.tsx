'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { 
  Flame, Zap, Mail, Lock, Eye, EyeOff, Info, 
  ChevronRight, ArrowRight, Shield, Cpu, Database,
  Globe, Smartphone, Wifi, Loader2, Sparkles, Star,
  Activity, Fingerprint, Key, LogIn
} from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

// =============================================================================
// AESTHETIC DEVELOPMENT ENGINE: CORE PRIMITIVES
// =============================================================================

/**
 * Noise Texture Overlay
 * Adds a high-end film grain effect to the dark terminal background.
 */
const Noise = () => (
  <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
)

/**
 * Advanced Dynamic Gradient Mesh
 * Creates slow-moving light blobs for deep atmospheric immersion.
 */
const GradientMesh = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div 
      animate={{ 
        x: [0, 100, 0], 
        y: [0, 50, 0],
        scale: [1, 1.2, 1] 
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[120px]"
    />
    <motion.div 
      animate={{ 
        x: [0, -100, 0], 
        y: [0, -50, 0],
        scale: [1, 1.1, 1] 
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[140px]"
    />
  </div>
)

/**
 * High-Performance Particle Engine
 * Individually animated nodes representing system connectivity.
 */
interface ParticleProps {
  id: number
  x: string
  y: string
  duration: number
  delay: number
}

const Particle = React.memo(({ x, y, duration, delay }: ParticleProps) => (
  <motion.div
    initial={{ x, y, opacity: 0 }}
    animate={{ 
      y: [null, '-20dvh'],
      opacity: [0, 0.4, 0] 
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      delay, 
      ease: "linear" 
    }}
    className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full pointer-events-none"
  />
))
Particle.displayName = 'Particle'

const ParticleSystem = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100 + 100}%`,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10
    }))
  }, [])

  return (
    <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
      {particles.map(p => <Particle key={p.id} {...p} />)}
    </div>
  )
}

/**
 * Floating Interactive Icon
 * Adds subtle parallax movement based on mouse/scroll.
 */
const AestheticDecorator = ({ icon: Icon, className, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 0.05, y: [-10, 10, -10] }}
    transition={{ 
      opacity: { duration: 2, delay },
      y: { duration: 6 + delay, repeat: Infinity, ease: "easeInOut" }
    }}
    className={cn("absolute pointer-events-none z-[3]", className)}
  >
    <Icon size={140} strokeWidth={0.5} />
  </motion.div>
)

// =============================================================================
// UI COMPONENTS: TERMINAL INPUT & ACTIONS
// =============================================================================

/**
 * Premium Terminal Input
 * Focus-aware input with synchronized icon and border glow states.
 */
interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: any
  label: string
  endElement?: React.ReactNode
}

const TerminalInput = React.forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ icon: Icon, label, endElement, ...props }, ref) => {
    const [focused, setFocused] = useState(false)
    
    return (
      <div className="space-y-3 group/field w-full">
        <div className="flex justify-between items-center px-1">
          <label className={cn(
            "text-[8px] font-black uppercase tracking-[0.4em] transition-colors duration-500",
            focused ? "text-primary" : "text-white/20"
          )}>
            {label}
          </label>
          <div className={cn(
            "w-1 h-1 rounded-full animate-pulse",
            focused ? "bg-primary" : "bg-white/10"
          )} />
        </div>
        
        <div className={cn(
          "relative h-18 rounded-[1.5rem] transition-all duration-700 overflow-hidden",
          "border border-white/5 bg-white/[0.02] backdrop-blur-xl",
          focused ? "border-primary/30 bg-white/[0.05] ring-4 ring-primary/5 shadow-2xl" : "hover:border-white/10"
        )}>
          <div className={cn(
            "absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-500",
            focused ? "text-primary scale-110" : "text-white/20"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          
          <input
            {...props}
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full h-full bg-transparent pl-16 pr-16 outline-none text-white font-black text-xs tracking-[0.1em] placeholder:text-white/5 uppercase"
          />
          
          {endElement && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              {endElement}
            </div>
          )}
          
          {/* Internal Input Glow */}
          <div className={cn(
            "absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-700 pointer-events-none",
            focused ? "opacity-100" : ""
          )} />
        </div>
      </div>
    )
  }
)
TerminalInput.displayName = 'TerminalInput'

/**
 * The 'Masuk' Action Button
 * High-impact interactive button with haptic simulation and shimmer.
 */
const MasukButton = ({ isLoading, disabled, onClick }: { isLoading: boolean, disabled: boolean, onClick?: () => void }) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.button
      type="submit"
      disabled={disabled || isLoading}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full h-20 rounded-[2rem] overflow-hidden group/btn",
        "bg-primary text-white font-black text-[11px] uppercase tracking-[0.4em]",
        "shadow-2xl shadow-primary/20 transition-all duration-500",
        "disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
      )}
    >
      {/* Interactive Hover Background */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover/btn:opacity-100 transition duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]: any) => `radial-gradient(120px circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent)`
          ),
        }}
      />

      {/* Content Wrapper */}
      <div className="relative z-10 flex items-center justify-center gap-4">
        {isLoading ? (
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-5 h-5" />
          </motion.div>
        ) : (
          <>
            <span>Masuk Terminal</span>
            <Zap className="w-4 h-4 fill-current group-hover/btn:scale-125 transition-transform" />
          </>
        )}
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
    </motion.button>
  )
}

// =============================================================================
// MAIN TERMINAL PAGE: COMPOSITION & LOGIC
// =============================================================================

export default function LoginPage() {
  const router = useRouter()
  
  // Terminal State Management
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Initialization & Theme Locking
  useEffect(() => {
    setMounted(true)
    document.documentElement.style.backgroundColor = '#050505'
    document.body.style.backgroundColor = '#050505'
    
    // Performance optimization: mark the document as dark theme
    document.documentElement.classList.add('dark', 'login-theme')
    
    return () => {
      document.documentElement.classList.remove('login-theme')
    }
  }, [])

  // Event Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password || isLoading) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await signIn('credentials', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        redirect: false
      })

      if (response?.error) {
        setError('Akses ditolak. Periksa kredensial Anda.')
        setIsLoading(false)
      } else {
        // Aesthetic delay for the exit animation
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 500)
      }
    } catch (err) {
      setError('Koneksi terminal terputus.')
      setIsLoading(false)
    }
  }

  if (!mounted) return <div className="fixed inset-0 bg-[#050505] z-[9999]" />

  return (
    <main className="relative min-h-[100dvh] w-full flex items-center justify-center p-6 selection:bg-primary/30 selection:text-primary overflow-x-hidden antialiased">
      
      {/* -----------------------------------------------------------------------
       * BACKGROUND INFRASTRUCTURE
       * -------------------------------------------------------------------- */}
      
      <div className="fixed inset-0 bg-[#050505] -z-[100]" />
      <Noise />
      <GradientMesh />
      <ParticleSystem />

      {/* Decorative Assets */}
      <AestheticDecorator icon={Shield} className="top-10 -left-10 text-primary" delay={0} />
      <AestheticDecorator icon={Cpu} className="bottom-20 -right-20 text-blue-500" delay={2} />
      <AestheticDecorator icon={Database} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" delay={4} />

      {/* -----------------------------------------------------------------------
       * TERMINAL COMPOSITION
       * -------------------------------------------------------------------- */}

      <div className="w-full max-w-[420px] relative z-10 py-12 flex flex-col items-center">
        
        {/* Branding Hub */}
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 relative"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-[#121212] to-black border border-white/10 shadow-2xl mb-8 relative group cursor-pointer"
          >
            <Flame className="w-12 h-12 text-primary fill-primary group-hover:scale-110 transition-transform duration-700" />
            
            {/* Pulsing Aura */}
            <motion.div 
              animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-[2.5rem] bg-primary/20 blur-3xl"
            />
          </motion.div>
          
          <h1 className="text-5xl font-[1000] tracking-[-0.05em] text-white mb-3 uppercase italic">
            HAYATI<span className="text-primary not-italic">.</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 opacity-30">
             <div className="h-px w-10 bg-gradient-to-r from-transparent to-white" />
             <p className="text-[9px] font-black text-white uppercase tracking-[0.6em]">System Terminal</p>
             <div className="h-px w-10 bg-gradient-to-l from-transparent to-white" />
          </div>
        </motion.div>

        {/* Central Terminal Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative"
        >
          <div className="absolute inset-0 bg-primary/5 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <Card className="rounded-[4rem] bg-[#0c0c0c]/80 backdrop-blur-3xl border border-white/10 p-10 sm:p-12 shadow-2xl relative overflow-hidden group">
            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              
              {/* Header Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-[1000] text-white tracking-tight leading-none">OTENTIKASI</h3>
                    <p className="text-[7px] font-black text-primary uppercase tracking-[0.4em] mt-1.5">Secure Entry Mode</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest leading-none">Ready</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <TerminalInput
                  name="email"
                  type="email"
                  label="Network Identity"
                  placeholder="USER@HAYATI.NETWORK"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={Mail}
                  required
                />

                <TerminalInput
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Access Token"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  icon={Lock}
                  required
                  endElement={
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              {/* Dynamic Error Messaging */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: 10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 10 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 rounded-3xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-4 text-rose-400">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Execution Action */}
              <div className="pt-4">
                <MasukButton 
                  isLoading={isLoading} 
                  disabled={!formData.email || !formData.password} 
                />
              </div>
            </form>
            
            {/* Subtle Gradient Decorator */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
            
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02] pointer-events-none">
              <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-white rounded-tr-3xl" />
            </div>
          </Card>
        </motion.div>

        {/* -----------------------------------------------------------------------
         * TERMINAL FOOTER: SYSTEM CAPABILITIES
         * -------------------------------------------------------------------- */}
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.5 }}
          className="mt-16 w-full space-y-16"
        >
          {/* Capability Grid */}
          <div className="grid grid-cols-3 gap-6">
             {[
               { icon: Globe, label: 'ENCRYPTED', desc: 'Secure Pipe' },
               { icon: Wifi, label: 'REAL-TIME', desc: 'Low Latency' },
               { icon: Smartphone, label: 'PLATFORM', desc: 'Adaptive UI' }
             ].map((f, i) => (
               <div key={i} className="flex flex-col items-center gap-4 group/feat">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 transition-all duration-500 group-hover/feat:bg-primary/5 group-hover/feat:border-primary/20">
                    <f.icon className="w-6 h-6 text-white/20 group-hover/feat:text-primary transition-colors duration-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[7px] font-[1000] text-white/40 uppercase tracking-[0.4em] group-hover/feat:text-white transition-colors">{f.label}</p>
                    <p className="text-[6px] font-black text-white/10 uppercase tracking-widest">{f.desc}</p>
                  </div>
               </div>
             ))}
          </div>

          {/* Legal & Versioning */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-8 opacity-20">
               <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white" />
               <div className="flex items-center gap-3">
                  <Star className="w-2 h-2 text-primary fill-primary" />
                  <p className="text-[8px] font-black text-white uppercase tracking-[0.8em]">v3.2.0 PRESTIGE</p>
                  <Star className="w-2 h-2 text-primary fill-primary" />
               </div>
               <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white" />
            </div>
            
            <div className="space-y-2 opacity-[0.08] hover:opacity-20 transition-opacity duration-1000">
               <p className="text-[7px] font-bold text-white uppercase tracking-[0.3em]">
                  Developed exclusively for Hayati Intelligence Terminal.
               </p>
               <p className="text-[7px] font-bold text-white uppercase tracking-[0.3em]">
                  © 2026. All Rights Reserved. ACCESS IS MONITORED.
               </p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* -----------------------------------------------------------------------
       * SYSTEM DECORATORS: FLOATING STATUS
       * -------------------------------------------------------------------- */}

      {/* Top Left: Terminal ID */}
      <div className="fixed top-10 left-10 opacity-20 pointer-events-none hidden lg:block">
         <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <div className="space-y-1">
               <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Terminal Node</p>
               <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">HT-DX-992-ALPHA</p>
            </div>
         </div>
      </div>

      {/* Top Right: System Metrics */}
      <div className="fixed top-10 right-10 opacity-20 pointer-events-none hidden lg:block">
         <div className="text-right space-y-2">
            <p className="text-[9px] font-[1000] text-white uppercase tracking-[0.5em]">System Vitality</p>
            <div className="flex items-center justify-end gap-1.5">
               {[1, 2, 3, 4, 5].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1 bg-emerald-500/50 rounded-full"
                  />
               ))}
            </div>
         </div>
      </div>

      {/* Bottom Right: Ops Status */}
      <div className="fixed bottom-10 right-10 opacity-20 pointer-events-none">
         <div className="text-right space-y-1.5">
            <p className="text-[9px] font-[1000] text-white uppercase tracking-[0.5em]">Session Link</p>
            <div className="flex items-center justify-end gap-2.5">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em]">Link Stable</span>
            </div>
         </div>
      </div>

      {/* Bottom Left: Interactive Sparkle */}
      <div className="fixed bottom-10 left-10 opacity-10 pointer-events-none hidden lg:block">
         <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
      </div>

    </main>
  )
}

/**
 * =============================================================================
 * TECHNICAL DESIGN SPECIFICATIONS & AESTHETIC ARCHITECTURE
 * =============================================================================
 * 
 * 1. DESIGN PHILOSOPHY: THE "PRESTIGE TERMINAL"
 * -----------------------------------------------------------------------------
 * This interface is designed to evoke a sense of high-end industrial luxury.
 * By combining obsidian-black backgrounds (#050505) with deep atmospheric 
 * gradients and film grain noise, we create a high-contrast visual space 
 * where interactive elements feel physically present.
 *
 * 2. MOTION SYSTEMS: FRAMER-MOTION ORCHESTRATION
 * -----------------------------------------------------------------------------
 * We utilize custom easing functions [0.16, 1, 0.3, 1] to simulate expensive,
 * weighted mechanical movements. Animations are staggered to guide the eye 
 * from the branding down to the execution action.
 *
 * 3. PARTICLE PHYSICS ENGINE
 * -----------------------------------------------------------------------------
 * The background uses a memoized particle system to simulate data flow.
 * Each particle has unique trajectories and durations to ensure the scene 
 * feels alive but never repetitive.
 *
 * 4. GLASS-MORPHISM 2.0
 * -----------------------------------------------------------------------------
 * Components use ultra-thick blur values (backdrop-blur-3xl) combined with 
 * subtle white border highlights (0.05 opacity) to achieve a modern 
 * translucent industrial look.
 *
 * 5. RESPONSIVE PRECISION
 * -----------------------------------------------------------------------------
 * Using DVH (Dynamic Viewport Height) ensures the terminal is perfectly 
 * centered on all mobile devices, accounting for browser-specific UI changes 
 * (like address bars) that often cause layout shifts.
 *
 * 6. ACCESSIBILITY & UX
 * -----------------------------------------------------------------------------
 * While visually dense, the core UX remains focused: Input validation is 
 * immediate, visual feedback is synchronized with focus states, and the 
 * "Masuk" action is clearly highlighted through shimmer and haptic motion.
 *
 * =============================================================================
 */
