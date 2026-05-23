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

const CompactLineChart = React.memo(({ data, color, height = 32 }: { data: number[], color: string, height?: number }) => {
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
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
    </svg>
  )
})
CompactLineChart.displayName = 'CompactLineChart'

const ExecutiveMetric = ({ title, value, trend, icon: Icon, color, delay, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    onClick={onClick}
    className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-subtle hover:shadow-executive transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className={cn(
        "flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black",
        trend > 0 ? "bg-[#5A8B6B]/10 text-[#5A8B6B]" : "bg-[#D96B6B]/10 text-[#D96B6B]"
      )}>
        {trend > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
        {Math.abs(trend)}%
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-xl font-bold text-[#2C3338] tracking-tight">{value}</h3>
    </div>
    <div className="mt-6 opacity-30 group-hover:opacity-60 transition-opacity">
       <CompactLineChart 
         data={useMemo(() => Array.from({ length: 10 }, () => Math.random() * 100), [])} 
         color={color.includes('primary') ? '#6488EA' : color.includes('positive') ? '#5A8B6B' : '#D96B6B'} 
       />
    </div>
  </motion.div>
)

const DataGridItem = ({ title, value, icon: Icon, subValue }: any) => (
  <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-4 hover:bg-slate-50/50 transition-colors cursor-default">
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-sm font-bold text-[#2C3338] truncate">{value}</h4>
        {subValue && <span className="text-[8px] font-medium text-slate-400">{subValue}</span>}
      </div>
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

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  const metrics = useMemo(() => [
    { title: 'Gross Revenue', value: formatIDR(stats.totalOmset), trend: 12.5, icon: Receipt, color: 'bg-[#6488EA]', path: '/settings' },
    { title: 'Cash on Hand', value: formatIDR(stats.totalKasDiterima), trend: 8.2, icon: Banknote, color: 'bg-[#5A8B6B]', path: '/settings' },
    { title: 'Account Receivable', value: formatIDR(stats.totalPiutang), trend: -4.1, icon: Users, color: 'bg-[#D96B6B]', path: '/customers' },
    { title: 'Net Profit', value: formatIDR(stats.totalKeuntunganBersih), trend: 15.3, icon: TrendingUp, color: 'bg-[#D4A373]', path: '/settings' },
  ], [stats])

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-40">
      
      {/* Executive Header */}
      <header className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[110] px-6 py-6 transition-all duration-500",
        isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-subtle" : "bg-transparent"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C3338] flex items-center justify-center text-white shadow-executive">
              <Flame className="w-6 h-6 fill-[#6488EA] text-[#6488EA]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#2C3338] leading-none uppercase">HAYATI</h1>
              <p className="text-[8px] font-black text-[#6488EA] uppercase tracking-[0.3em] mt-1.5 italic">Executive Terminal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#6488EA] transition-all shadow-subtle active:scale-95">
               <Bell className="w-4 h-4" />
             </button>
             <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden p-0.5 cursor-pointer" onClick={() => router.push('/settings')}>
                <div className="w-full h-full bg-slate-200 rounded-lg" />
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pt-28 px-6 space-y-12">
        
        {/* Analytics Summary */}
        <section className="space-y-6">
           <div className="flex items-end justify-between px-1">
              <div>
                 <h2 className="text-2xl font-extrabold text-[#2C3338] tracking-tight">Financial Hub</h2>
                 <p className="text-[9px] font-bold text-[#5A8B6B] uppercase tracking-[0.4em] mt-1">Operational Performance</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{months[time.getMonth()]}, {time.getFullYear()}</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             {metrics.map((m, idx) => (
               <ExecutiveMetric key={m.title} {...m} delay={idx * 0.1} onClick={() => router.push(m.path)} />
             ))}
           </div>
        </section>

        {/* Business Intelligence Grid */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold text-[#2C3338] tracking-tight uppercase">Operational Grid</h3>
              <button className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#6488EA] transition-colors">View Timeline</button>
           </div>
           
           <div className="grid grid-cols-1 gap-3">
              <DataGridItem title="Active Nodes" value="14 Elite Agents" icon={Users} subValue="+2 This Week" />
              <DataGridItem title="Warehouse Status" value="Global Synchronized" icon={Package} subValue="99.8% Accuracy" />
              <DataGridItem title="System Latency" value="12ms Response" icon={Activity} subValue="Optimized" />
           </div>
        </section>

        {/* Executive Action: Claymorphism CTA */}
        <section className="relative group">
           <div className="p-10 rounded-[2rem] bg-white border border-slate-100 shadow-executive overflow-hidden relative">
              <div className="relative z-10 space-y-8">
                 <div>
                    <h3 className="text-2xl font-bold text-[#2C3338] tracking-tight leading-tight">Elite Deployment <br />Protocol.</h3>
                    <p className="text-slate-400 text-[10px] font-medium leading-relaxed max-w-[220px] uppercase tracking-wide mt-4">
                       Semua sistem logistik dan distribusi telah dipetakan ke dalam struktur korporat terpusat.
                    </p>
                 </div>
                 <button 
                   onClick={() => router.push('/cashier')}
                   className="clay-btn w-full py-5 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4"
                 >
                    Initialize Terminal <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
              <div className="absolute top-[-20%] right-[-10%] opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 <Globe size={240} />
              </div>
           </div>
        </section>

        {/* Performance Milestones */}
        <section className="space-y-6">
           <div className="flex items-baseline justify-between px-1">
              <h3 className="text-lg font-bold text-[#2C3338] tracking-tight uppercase">KPI Analytics</h3>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#5A8B6B]" />
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Steady Growth</span>
              </div>
           </div>
           
           <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-subtle space-y-8">
              <div className="flex items-center gap-8">
                 <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="40" cy="40" r="34" stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
                       <motion.circle 
                         cx="40" cy="40" r="34" stroke="#6488EA" strokeWidth="6" fill="transparent" 
                         strokeDasharray={2 * Math.PI * 34}
                         initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                         animate={{ strokeDashoffset: (1 - 0.72) * 2 * Math.PI * 34 }}
                         transition={{ duration: 1.5, ease: "easeOut" }}
                         strokeLinecap="round"
                       />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-xs font-bold text-[#2C3338]">72%</span>
                    </div>
                 </div>
                 <div className="flex-1 space-y-4">
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                          <span>Market Share</span>
                          <span>48%</span>
                       </div>
                       <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '48%' }} className="h-full bg-[#D4A373]" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                          <span>Agent Loyalty</span>
                          <span>92%</span>
                       </div>
                       <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-[#5A8B6B]" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Clean Footer */}
        <footer className="pt-10 pb-40 text-center space-y-6 opacity-30">
           <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200">
                 <ShieldCheck className="w-3.5 h-3.5 text-[#5A8B6B]" />
                 <span className="text-[8px] font-bold text-[#2C3338] uppercase tracking-widest">Enterprise Secured</span>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.5em]">Hayati Digital Infrastructure</p>
           </div>
        </footer>

      </div>
    </div>
  )
}
