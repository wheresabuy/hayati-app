'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, ArrowRight, ShieldCheck, UserCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-[2rem] shadow-xl shadow-primary/20 flex items-center justify-center text-white mx-auto mb-6">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">Hayati Agen</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">
            Login Sesuai Akun Anda
          </p>
        </div>

        <Card className="border-none bg-white rounded-[2.5rem] shadow-premium overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Anda</label>
                  <div className="relative group">
                    <Input
                      placeholder="Masukkan nama..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-none bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary/20 transition-all"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                      <UserCircle2 className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className="relative group">
                    <Input
                      type="password"
                      placeholder="Masukkan password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-none bg-slate-50 font-bold text-slate-700 focus-visible:ring-primary/20 transition-all"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-1 text-center">
                    Nama atau Password salah Bang!
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg shadow-xl shadow-primary/20 group transition-all"
              >
                {loading ? 'MENGECEK...' : (
                  <span className="flex items-center gap-2">
                    MASUK
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
