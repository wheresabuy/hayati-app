'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, PasswordInput } from '@/components/ui/input'
import { ArrowRight, Fingerprint, ShieldCheck, UserCircle2, Sparkles, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(true)
        setLoading(false)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (e: any) {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-[#0A0A0B]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="text-center mb-10 space-y-4">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Hayati Enterprise</span>
          </motion.div>
          
          <h1 className="text-6xl font-[1000] text-white tracking-tighter leading-none italic">
            Welcome.
          </h1>
          <p className="text-xs font-bold text-white/30 uppercase tracking-[0.4em]">
            Elite Agency Terminal v3.2
          </p>
        </div>

        <Card variant="darkGlass" padding="none" className="rounded-[3rem] border-white/5 shadow-2xl backdrop-blur-3xl overflow-hidden">
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Access Identity</label>
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    variant="dark"
                    size="xl"
                    className="bg-white/5 border-white/5 text-white placeholder:text-white/10 h-16 rounded-[1.5rem] px-8"
                    icon={<UserCircle2 className="h-5 w-5 text-white/20" />}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Security Key</label>
                  <PasswordInput
                    placeholder="Enter security key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="dark"
                    size="xl"
                    className="bg-white/5 border-white/5 text-white placeholder:text-white/10 h-16 rounded-[1.5rem] px-8"
                    icon={<Fingerprint className="h-5 w-5 text-white/20" />}
                    required
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3"
                    >
                      <ShieldCheck className="w-4 h-4 text-rose-500" />
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                        Identity rejected. Check credentials.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="gold"
                  effect="shimmer"
                  size="xl"
                  className="w-full h-20 rounded-[2rem] font-[1000] text-xl tracking-tighter shadow-[0_20px_50px_-10px_rgba(234,179,8,0.3)] active:scale-95 transition-all"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                       <Globe className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-3">
                      AUTHORIZE ACCESS
                      <ArrowRight className="h-6 w-6 stroke-[3]" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">
            Secure Cloud Encryption Active • Hayati Protocol 2026
          </p>
        </motion.div>
      </motion.div>

      {/* Decorative Bottom Glow */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-blue-500/20 rounded-full blur-[150px] pointer-events-none" />
    </div>
  )
}
