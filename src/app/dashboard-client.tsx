'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Banknote, Receipt, Users, TrendingUp, ChevronRight, Clock, 
  ArrowUpRight, ArrowDownRight, Activity, Wallet, CreditCard, 
  Calendar, ShieldCheck, Zap, Sparkles, LayoutGrid, List,
  ArrowRight, Search, Bell, Menu, X, MoreHorizontal, Filter,
  Layers, Package, ShoppingCart, Settings, LogOut, ChevronDown,
  Globe, Smartphone, Coffee, Star, Heart, Target, Flame,
  Briefcase, BarChart3, PieChart, Info, MapPin, MousePointer2,
  Trophy, Rocket, ZapOff, Crown, Diamond, User
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const formatIDR = (val: number) => 
  new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(val)

const CompactVibrantChart = React.memo(({ data, color, height = 40 }: { data: number[], color: string, height?: number }) => {
  const points = useMemo(() => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min
    return data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - ((d - min) / (range || 1)) * 100
    }))
  }, [data])

  const path = useMemo(() => `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`, [points])
  
  return (
    <svg viewBox="0 0 100 100" className="w-full overflow-visible" style={{ height }}>
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "anticipate" }}
      />
    </svg>
  )
})
CompactVibrantChart.displayName = 'CompactVibrantChart'

const PrestigeWidget = ({ title, value, trend, icon: Icon, color, delay, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring', damping: 20 }}
    onClick={onClick}
    className="bg-white p-7 squircle border border-slate-50 shadow-ambient hover:shadow-vibrant transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-8">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-110", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm",
          trend > 0 ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#FF6B00]/10 text-[#FF6B00]"
        )}
      >
        {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(trend)}%
      </motion.div>
    </div>
    <div className="space-y-1.5">
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-2xl font-[900] text-[#1A1D1E] tracking-tight">{value}</h3>
    </div>
    <div className="mt-8">
       <CompactVibrantChart 
         data={useMemo(() => Array.from({ length: 12 }, () => 20 + Math.random() * 80), [])} 
         color={color.includes('blue') ? '#2D5BFF' : color.includes('emerald') ? '#10B981' : '#FF6B00'} 
       />
    </div>
  </motion.div>
)

const AnalyticsBar = ({ label, percentage, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
      <span>{label}</span>
      <span className="text-[#1A1D1E]">{percentage}%</span>
    </div>
    <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden p-0.5">
       <motion.div 
         initial={{ width: 0 }}
         animate={{ width: `${percentage}%` }}
         transition={{ duration: 1.5, ease: "circOut" }}
         className={cn("h-full rounded-full", color)}
       />
    </div>
  </div>
)

export default function DashboardClient({ stats }: { stats: any }) {
  const router = useRouter()
  const [time, setTime] = useState(new Date())
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const metrics = useMemo(() => [
    { title: 'Revenues', value: formatIDR(stats.totalOmset), trend: 14.2, icon: Receipt, color: 'bg-[#2D5BFF]', path: '/settings' },
    { title: 'Operational Kas', value: formatIDR(stats.totalKasDiterima), trend: 8.5, icon: Banknote, color: 'bg-[#10B981]', path: '/settings' },
    { title: 'Receivables', value: formatIDR(stats.totalPiutang), trend: -2.4, icon: Users, color: 'bg-[#FF6B00]', path: '/customers' },
    { title: 'Corporate Profit', value: formatIDR(stats.totalKeuntunganBersih), trend: 21.0, icon: TrendingUp, color: 'bg-indigo-600', path: '/settings' },
  ], [stats])

  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-40">
      
      {/* Vibrant Executive Header */}
      <header className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[110] px-8 py-6 transition-all duration-500",
        isScrolled ? "bg-white/90 backdrop-blur-2xl border-b border-slate-100 shadow-ambient" : "bg-transparent"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-12 h-12 squircle bg-[#1A1D1E] flex items-center justify-center text-white shadow-vibrant transition-all group-hover:rotate-12">
              <Flame className="w-7 h-7 fill-[#2D5BFF] text-[#2D5BFF]" />
            </div>
            <div>
              <h1 className="text-2xl font-[950] tracking-tighter text-[#1A1D1E] leading-none uppercase">HAYATI</h1>
              <p className="text-[9px] font-black text-[#2D5BFF] uppercase tracking-[0.4em] mt-2 italic">Elite Matrix</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#2D5BFF] transition-all shadow-ambient active:scale-90">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-[#FF6B00] rounded-full border-2 border-white animate-badge" />
             </div>
             <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden p-0.5 group cursor-pointer" onClick={() => router.push('/settings')}>
                <div className="w-full h-full bg-slate-200 rounded-xl group-hover:scale-110 transition-transform" />
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pt-32 px-8 space-y-12">
        
        {/* Welcome Section */}
        <section className="space-y-8">
           <div className="flex items-end justify-between px-1">
              <div>
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">System Live</span>
                 </div>
                 <h2 className="text-4xl font-[1000] tracking-tighter text-[#1A1D1E] leading-tight">
                    Corporate <br />
                    <span className="text-[#2D5BFF] italic">Overview.</span>
                 </h2>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{time.toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                 <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{time.getDate()} {time.toLocaleDateString('id-ID', { month: 'short' })}</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-5">
             {metrics.map((m, idx) => (
               <PrestigeWidget key={m.title} {...m} delay={idx * 0.1} />
             ))}
           </div>
        </section>

        {/* Action Center - Dynamic CTAs */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-black text-[#1A1D1E] tracking-tight uppercase">Elite Terminal</h3>
              <div className="flex items-center gap-2">
                 <MousePointer2 className="w-3.5 h-3.5 text-[#2D5BFF]" />
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Input</span>
              </div>
           </div>
           
           <div className="bg-white border border-slate-50 p-10 squircle shadow-vibrant relative overflow-hidden group">
              <div className="relative z-10 space-y-10">
                 <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-[1.75rem] bg-[#2D5BFF]/10 flex items-center justify-center text-[#2D5BFF] shadow-inner-soft group-hover:rotate-12 transition-transform">
                       <Zap className="w-8 h-8 fill-current" />
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Ready State</p>
                       <p className="text-2xl font-[1000] text-[#10B981] tracking-tighter mt-1 italic">V3.2.0-Elite</p>
                    </div>
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-[#1A1D1E] tracking-tighter leading-none mb-4 uppercase italic">Initialize <br />Operations.</h3>
                    <p className="text-slate-400 text-[11px] font-bold leading-relaxed max-w-[260px] uppercase tracking-wide">
                       Mulai pencatatan nota baru atau monitoring distribusi stok ke jaringan agen.
                    </p>
                 </div>
                 <button 
                   onClick={() => router.push('/cashier')}
                   className="clay-cta w-full py-6 rounded-[2rem] text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-5"
                 >
                    Buka Terminal Kasir <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[3] pointer-events-none group-hover:scale-[3.2] transition-transform duration-1000">
                 <Globe className="w-96 h-96 stroke-[0.5]" />
              </div>
           </div>
        </section>

        {/* Business Performance Analytics */}
        <section className="space-y-8">
           <div className="flex items-end justify-between px-1">
              <div>
                 <h3 className="text-lg font-black text-[#1A1D1E] tracking-tight uppercase">Corporate KPI</h3>
                 <p className="text-[8px] font-black text-[#10B981] uppercase tracking-[0.4em] mt-1.5 italic">Operational Intelligence</p>
              </div>
              <button onClick={() => router.push('/settings')} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-[#2D5BFF] transition-colors">Reports</button>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              <div className="bg-white border border-slate-100 p-8 squircle shadow-ambient space-y-8 group hover:shadow-vibrant transition-all">
                 <div className="flex items-center gap-8">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                       <svg className="w-full h-full -rotate-90 drop-shadow-sm">
                          <circle cx="48" cy="48" r="42" stroke="#F8F9FA" strokeWidth="10" fill="transparent" />
                          <motion.circle 
                            cx="48" cy="48" r="42" stroke="#2D5BFF" strokeWidth="10" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 42}
                            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                            animate={{ strokeDashoffset: (1 - 0.78) * 2 * Math.PI * 42 }}
                            transition={{ duration: 2, ease: "circOut" }}
                            strokeLinecap="round"
                          />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-black text-[#1A1D1E] leading-none">78%</span>
                          <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter mt-1">Goal</span>
                       </div>
                    </div>
                    <div className="flex-1 space-y-6">
                       <AnalyticsBar label="Active Agent Rate" percentage={92} color="bg-[#10B981]" />
                       <AnalyticsBar label="Market Penetration" percentage={64} color="bg-[#FF6B00]" />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Footer Infrastructure */}
        <footer className="pt-10 pb-40 text-center space-y-6 opacity-40">
           <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm">
                 <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                 <span className="text-[9px] font-black text-[#1A1D1E] uppercase tracking-[0.3em] italic">Encrypted Connection</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">Hayati Digital Distribution System</p>
           </div>
        </footer>

      </div>
    </div>
  )
}
