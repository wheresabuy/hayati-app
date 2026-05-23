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

/**
 * GEOMETRIC VIBRANT CHART
 * Perfectly rounded geometric tips for statistical satisfaction.
 */
const GeometricChart = React.memo(({ data, color, height = 36 }: { data: number[], color: string, height?: number }) => {
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
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
})
GeometricChart.displayName = 'GeometricChart'

/**
 * CORPORATE SQUIRCLE WIDGET
 * Mirrored geometry to Poppins typography.
 */
const GeometricWidget = ({ title, value, trend, icon: Icon, color, delay, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    onClick={onClick}
    className="bg-white p-6 squircle border border-slate-50 shadow-ambient hover:shadow-geometric transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-8">
      <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6", color)}>
        <Icon className="w-5.5 h-5.5" />
      </div>
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold shadow-sm animate-badge-in",
        trend > 0 ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#FF6B00]/10 text-[#FF6B00]"
      )}>
        {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(trend)}%
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">{title}</p>
      <h3 className="text-2xl font-extrabold text-[#1A1D1E] tracking-tight">{value}</h3>
    </div>
    <div className="mt-8 opacity-40 group-hover:opacity-100 transition-opacity">
       <GeometricChart 
         data={useMemo(() => Array.from({ length: 8 }, () => 10 + Math.random() * 90), [])} 
         color={color.includes('blue') ? '#2D5BFF' : color.includes('emerald') ? '#10B981' : '#FF6B00'} 
       />
    </div>
  </motion.div>
)

const AnalyticsRow = ({ label, percentage, color }: any) => (
  <div className="space-y-2.5">
    <div className="flex justify-between items-center px-1">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <span className="text-[11px] font-extrabold text-[#1A1D1E]">{percentage}%</span>
    </div>
    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 btn-stroke">
       <motion.div 
         initial={{ width: 0 }}
         animate={{ width: `${percentage}%` }}
         transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
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
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const metrics = useMemo(() => [
    { title: 'Revenues', value: formatIDR(stats.totalOmset), trend: 14.8, icon: Receipt, color: 'bg-[#2D5BFF]', path: '/settings' },
    { title: 'Operational', value: formatIDR(stats.totalKasDiterima), trend: 9.2, icon: Banknote, color: 'bg-[#10B981]', path: '/settings' },
    { title: 'Receivables', value: formatIDR(stats.totalPiutang), trend: -3.5, icon: Users, color: 'bg-[#FF6B00]', path: '/customers' },
    { title: 'Net Profit', value: formatIDR(stats.totalKeuntunganBersih), trend: 18.4, icon: TrendingUp, color: 'bg-indigo-600', path: '/settings' },
  ], [stats])

  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-44 selection:bg-[#2D5BFF]/5">
      
      {/* Geometric Persistent Header */}
      <header className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[120] px-8 py-6 transition-all duration-700",
        isScrolled ? "bg-white/95 backdrop-blur-3xl border-b border-slate-100 shadow-ambient" : "bg-transparent"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-12 h-12 squircle bg-[#1A1D1E] flex items-center justify-center text-white shadow-geometric transition-all group-hover:scale-110">
              <Flame className="w-7 h-7 fill-[#2D5BFF] text-[#2D5BFF]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#1A1D1E] leading-none uppercase italic">HAYATI</h1>
              <p className="text-[9px] font-black text-[#2D5BFF] uppercase tracking-[0.5em] mt-2">Elite System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <button className="w-12 h-12 rounded-[1.25rem] bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-[#2D5BFF] transition-all shadow-ambient">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#FF6B00] rounded-full border-2 border-white animate-badge-in" />
             </div>
             <div className="w-12 h-12 rounded-[1.25rem] bg-slate-100 border-2 border-white shadow-sm overflow-hidden p-0.5 cursor-pointer" onClick={() => router.push('/settings')}>
                <div className="w-full h-full bg-slate-200 rounded-xl hover:scale-110 transition-transform duration-500" />
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pt-32 px-8 space-y-12">
        
        {/* Core Analytics Grid */}
        <section className="space-y-8">
           <div className="flex items-end justify-between px-1">
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Matrix Online</span>
                 </div>
                 <h2 className="text-4xl font-black tracking-tighter text-[#1A1D1E] leading-none">
                    Financial <br />
                    <span className="text-[#2D5BFF] italic">Continuity.</span>
                 </h2>
              </div>
              <div className="text-right">
                 <p className="text-[11px] font-extrabold text-[#1A1D1E] uppercase tracking-widest">{time.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</p>
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">{time.toLocaleDateString('id-ID', { weekday: 'long' })}</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-5">
             {metrics.map((m, idx) => (
               <GeometricWidget key={m.title} {...m} delay={idx * 0.1} />
             ))}
           </div>
        </section>

        {/* Corporate Operations CTA */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-extrabold text-[#1A1D1E] tracking-tight uppercase">Operational Hub</h3>
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#2D5BFF] transition-colors">Timeline</button>
           </div>
           
           <div className="bg-white border border-slate-100 p-10 squircle shadow-geometric relative overflow-hidden group">
              <div className="relative z-10 space-y-10">
                 <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-[1.75rem] bg-[#2D5BFF]/10 flex items-center justify-center text-[#2D5BFF] btn-stroke group-hover:scale-110 transition-transform duration-500">
                       <Zap className="w-8 h-8 fill-current" />
                    </div>
                    <div className="px-5 py-2.5 rounded-full bg-[#FDFBF7] border border-slate-50 shadow-sm">
                       <p className="text-[11px] font-black text-[#10B981] tracking-tighter uppercase italic">Verified Node</p>
                    </div>
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-[#1A1D1E] tracking-tighter leading-tight mb-4 uppercase italic">Initialize <br />Deployment.</h3>
                    <p className="text-slate-400 text-[11px] font-extrabold leading-relaxed max-w-[260px] uppercase tracking-wide">
                       Sistem logistik telah terkalibrasi. Tekan tombol di bawah untuk membuka terminal input data.
                    </p>
                 </div>
                 <button 
                   onClick={() => router.push('/cashier')}
                   className="geometric-cta w-full h-20 rounded-[2rem] text-white flex items-center justify-center gap-6"
                 >
                    <span className="text-[12px] font-black uppercase tracking-[0.5em]">Buka Terminal</span>
                    <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[3] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                 <Globe className="w-96 h-96 stroke-[0.5]" />
              </div>
           </div>
        </section>

        {/* High-Fidelity Performance Bar */}
        <section className="space-y-8 pb-10">
           <div className="flex items-end justify-between px-1">
              <div>
                 <h3 className="text-lg font-black text-[#1A1D1E] tracking-tight uppercase">Corporate KPI</h3>
                 <p className="text-[8px] font-black text-[#10B981] uppercase tracking-[0.5em] mt-1.5 italic">Real-time Analysis</p>
              </div>
              <button onClick={() => router.push('/settings')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#2D5BFF] transition-colors">Details</button>
           </div>
           
           <div className="bg-white border border-slate-100 p-9 squircle shadow-ambient space-y-10 group hover:shadow-geometric transition-all duration-500">
              <div className="flex items-center gap-10">
                 <div className="relative w-28 h-24 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="56" cy="48" r="44" stroke="#F8F9FA" strokeWidth="12" fill="transparent" />
                       <motion.circle 
                         cx="56" cy="48" r="44" stroke="#2D5BFF" strokeWidth="12" fill="transparent" 
                         strokeDasharray={2 * Math.PI * 44}
                         initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                         animate={{ strokeDashoffset: (1 - 0.72) * 2 * Math.PI * 44 }}
                         transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                         strokeLinecap="round"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-xl font-black text-[#1A1D1E] leading-none">72%</span>
                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter mt-1">Matrix</span>
                    </div>
                 </div>
                 <div className="flex-1 space-y-8">
                    <AnalyticsRow label="Agent Utilization" percentage={94} color="bg-[#10B981]" />
                    <AnalyticsRow label="Profit Margin" percentage={52} color="bg-[#FF6B00]" />
                 </div>
              </div>
           </div>
        </section>

        {/* Global Footer Notes */}
        <footer className="pt-8 pb-32 text-center space-y-6 opacity-40">
           <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm">
                 <ShieldCheck className="w-4.5 h-4.5 text-[#10B981]" strokeWidth={2.5} />
                 <span className="text-[10px] font-black text-[#1A1D1E] uppercase tracking-[0.4em] italic">8K Fidelity Sync</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">Hayati Enterprise Ecosystem v3.2</p>
           </div>
        </footer>

      </div>
    </div>
  )
}
