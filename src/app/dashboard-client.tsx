'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Banknote, Receipt, Users, TrendingUp, ChevronRight, Clock, 
  ArrowUpRight, ArrowDownRight, Activity, Wallet, CreditCard, 
  Calendar, ShieldCheck, Zap, Sparkles, LayoutGrid, List,
  ArrowRight, Search, Bell, Menu, X, MoreHorizontal, Filter,
  Layers, Package, ShoppingCart, Settings, LogOut, ChevronDown,
  Globe, Smartphone, Coffee, Star, Heart, Target, Flame,
  Briefcase, BarChart3, PieChart, Info, MapPin, MousePointer2,
  Trophy, Rocket, ZapOff, Fingerprint, Crown, Diamond, User
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

const CompactLineChart = React.memo(({ data, color, height = 48 }: { data: number[], color: string, height?: number }) => {
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
      <defs>
        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.path
        d={`${path} L 100,100 L 0,100 Z`}
        fill={`url(#grad-${color})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </svg>
  )
})
CompactLineChart.displayName = 'CompactLineChart'

const DonutChart = ({ value, total, color, icon: Icon }: any) => {
  const percentage = Math.min((value / total) * 100, 100)
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
        <motion.circle
          cx="48"
          cy="48"
          r="40"
          stroke={color}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Icon className="w-4 h-4 text-slate-300" />
        <span className="text-[10px] font-black text-slate-900 leading-none mt-1">{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}

const ProgressBar = ({ progress, color, label, icon: Icon }: { progress: number, color: string, label: string, icon?: any }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3 h-3 text-slate-300" />}
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
      </div>
      <span className="text-[10px] font-black text-slate-900">{progress}%</span>
    </div>
    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100/50">
      <motion.div 
        className={cn("h-full rounded-full shadow-sm", color)}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </div>
  </div>
)

const MetricCard = React.memo(({ title, value, subValue, trend, icon: Icon, color, delay, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ y: -6, scale: 1.02 }}
    onClick={onClick}
    className="relative group h-full cursor-pointer"
  >
    <div className={cn(
      "h-full p-6 rounded-[3rem] bg-white border border-slate-50 shadow-premium transition-all duration-500",
      "hover:shadow-lux group-hover:border-primary/10"
    )}>
      <div className="flex justify-between items-start mb-6">
        <div className={cn("w-12 h-12 rounded-2xl text-white shadow-xl flex items-center justify-center transition-transform group-hover:rotate-12", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-full text-[9px] font-black shadow-sm",
          trend > 0 ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
        )}>
          {trend > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">{title}</p>
        <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter leading-none">{value}</h3>
        <p className="text-[9px] font-bold text-slate-400 mt-2 flex items-center gap-1.5">
           <div className={cn("w-1 h-1 rounded-full", trend > 0 ? "bg-emerald-400" : "bg-rose-400")} />
           {subValue}
        </p>
      </div>
      <div className="mt-6">
        <CompactLineChart 
          data={useMemo(() => Array.from({ length: 12 }, () => 20 + Math.random() * 80), [])} 
          color={color.includes('blue') ? '#3b82f6' : 
                 color.includes('emerald') ? '#10b981' : 
                 color.includes('rose') ? '#f43f5e' : '#f59e0b'} 
        />
      </div>
    </div>
  </motion.div>
))
MetricCard.displayName = 'MetricCard'

const AgentLeaderboard = ({ agents, onNavigate }: any) => (
  <div className="grid grid-cols-1 gap-4">
    {agents.map((agent: any, i: number) => (
      <motion.div 
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * i }}
        onClick={() => onNavigate(`/customers/${agent.id}`)}
        className="flex items-center gap-4 p-4 rounded-[2.5rem] bg-white border border-slate-50 shadow-soft hover:shadow-premium transition-all cursor-pointer group"
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden p-0.5 border border-slate-50 group-hover:border-primary/20 transition-all flex items-center justify-center">
            <User className="w-8 h-8 text-slate-300" />
          </div>
          {i === 0 && (
             <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center border-4 border-white shadow-sm">
                <Crown className="w-3 h-3 text-white fill-white" />
             </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{agent.uid}</p>
          <p className="text-sm font-[950] text-slate-900 truncate tracking-tight">{agent.name}</p>
          <div className="flex items-center gap-2 mt-1">
             <div className="flex -space-x-1">
                {[1, 2, 3].map(s => <div key={s} className="w-2 h-2 rounded-full bg-amber-400" />)}
             </div>
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">VIP Member</span>
          </div>
        </div>
        <div className="text-right pr-2">
          <p className="text-sm font-[1000] text-primary tracking-tighter">{agent.sales}</p>
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter mt-0.5">Transaksi</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
           <ChevronRight className="w-4 h-4" />
        </div>
      </motion.div>
    ))}
  </div>
)

export default function DashboardClient({ stats }: { stats: any }) {
  const router = useRouter()
  const [time, setTime] = useState(new Date())
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  const metrics = useMemo(() => [
    { title: 'Omset', value: formatIDR(stats.totalOmset), subValue: 'Growth terdeteksi +12.5%', trend: 12.5, icon: Receipt, color: 'bg-blue-600', path: '/settings' },
    { title: 'Kas', value: formatIDR(stats.totalKasDiterima), subValue: 'Likuiditas sangat aman', trend: 8.2, icon: Banknote, color: 'bg-emerald-600', path: '/settings' },
    { title: 'Piutang', value: formatIDR(stats.totalPiutang), subValue: 'Follow-up 12 agen pending', trend: -4.1, icon: Users, color: 'bg-rose-600', path: '/customers' },
    { title: 'Laba', value: formatIDR(stats.totalKeuntunganBersih), subValue: 'Efisiensi operasional tinggi', trend: 15.3, icon: TrendingUp, color: 'bg-amber-500', path: '/settings' },
  ], [stats])

  const topAgents = useMemo(() => [
    { id: '1', uid: 'AGN-001', name: 'Bp Nana', sales: 142 },
    { id: '2', uid: 'AGN-002', name: 'Bp Seno UD mulya Jaya', sales: 98 },
    { id: '3', uid: 'AGN-003', name: 'Tk Kartika Putri', sales: 76 },
  ], [])

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-64 selection:bg-primary/20 selection:text-primary">
      
      {/* Premium Dynamic Navbar */}
      <header className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[110] px-6 py-5 transition-all duration-500",
        isScrolled ? "bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-lux translate-y-0" : "bg-transparent translate-y-2"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => handleNavigate('/')}>
            <div className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center text-white shadow-2xl transition-all group-hover:rotate-12 group-hover:scale-110">
              <Flame className="w-7 h-7 fill-primary text-primary" />
            </div>
            <div className="transition-all group-hover:translate-x-1">
              <h1 className="text-2xl font-[1000] tracking-[0.05em] text-slate-900 leading-none">HAYATI.</h1>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.5em] mt-2 italic">Elite Terminal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm active:scale-90 relative">
               <Bell className="w-5 h-5" />
               <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-bounce" />
             </button>
             <div className="w-12 h-12 rounded-[1.25rem] bg-slate-100 border-2 border-white shadow-sm overflow-hidden p-0.5 group cursor-pointer" onClick={() => handleNavigate('/settings')}>
                <div className="w-full h-full bg-slate-200 rounded-xl group-hover:scale-110 transition-transform" />
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pt-32 px-6 space-y-12">
        
        {/* Welcome Section */}
        <section className="space-y-6">
           <div className="flex items-end justify-between px-2">
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/5">
                       V3.2 Premium
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 </div>
                 <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900 leading-tight">
                    Good Day, <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 italic">Commander.</span>
                 </h2>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{days[time.getDay()]}</p>
                 <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{time.getDate()} {months[time.getMonth()]}</p>
              </div>
           </div>
           
           <motion.div 
             whileHover={{ y: -10, scale: 1.02 }}
             className="p-10 rounded-[4rem] bg-[#121212] text-white relative overflow-hidden group shadow-2xl shadow-black/20"
           >
             <div className="relative z-10 flex flex-col h-full justify-between gap-12">
               <div className="flex items-center justify-between">
                  <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 bg-primary")}>
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex flex-col items-end text-right">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Efficiency</p>
                     <p className="text-2xl font-[1000] text-primary tracking-tighter mt-1">98.4%</p>
                  </div>
               </div>
               <div>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-px bg-primary/40" />
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic">System Intelligence</span>
                 </div>
                 <h3 className="text-3xl font-[1000] tracking-tighter leading-tight mb-4">Global Matrix</h3>
                 <p className="text-white/40 text-xs font-bold leading-relaxed max-w-[260px] uppercase tracking-wide">
                   Semua data inventori, piutang agen, dan kas real-time telah disinkronkan ke dalam satu dashboard operasional terpusat.
                 </p>
               </div>
               <div className="flex items-center gap-3">
                 <button 
                   onClick={() => handleNavigate('/cashier')}
                   className="flex items-center gap-4 bg-white text-black px-10 py-5 rounded-[2.5rem] text-[10px] font-[1000] uppercase tracking-widest shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 w-fit"
                 >
                   Explore Terminal <ArrowRight className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleNavigate('/settings')}
                   className="px-10 py-5 rounded-[2.5rem] bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                 >
                   Laporan
                 </button>
               </div>
             </div>
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-32 -mt-32" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-24 -mb-24" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[3] pointer-events-none">
                <Fingerprint className="w-64 h-64 stroke-[0.5]" />
             </div>
           </motion.div>
        </section>

        {/* Finance Metrics Grid */}
        <section className="space-y-6">
           <div className="flex items-end justify-between px-2">
              <div>
                 <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">Financials</h3>
                 <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1.5">Capital & Growth</p>
              </div>
              <button 
                onClick={() => handleNavigate('/settings')}
                className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-primary transition-colors"
              >
                 Detail Laporan <ChevronRight className="w-3 h-3" />
              </button>
           </div>
           <div className="grid grid-cols-2 gap-5">
             {metrics.map((m, idx) => (
               <MetricCard key={m.title} {...m} delay={0.1 * idx} onClick={() => handleNavigate(m.path)} />
             ))}
           </div>
        </section>

        {/* Goals & KPI Tracking */}
        <div className="p-8 rounded-[3.5rem] bg-white border border-slate-100 shadow-premium overflow-hidden relative group">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-base font-[1000] text-slate-900 tracking-tight leading-none uppercase">KPI Performance</h3>
                 <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1.5 italic">Live Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-[9px] font-black text-slate-900 uppercase">On Track</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-4 relative z-10">
             <div className="flex items-center gap-8">
                <DonutChart value={stats.totalOmset} total={stats.totalOmset * 1.5} color="#3b82f6" icon={TrendingUp} />
                <div className="flex-1 space-y-4">
                   <ProgressBar progress={72} color="bg-blue-600" label="Omset Mingguan" icon={Receipt} />
                   <ProgressBar progress={48} color="bg-amber-500" label="Margin Keuntungan" icon={TrendingUp} />
                </div>
             </div>
             <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                      <Calendar className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Waktu Tersisa</p>
                      <p className="text-xs font-[950] text-slate-900 mt-0.5">12 Hari Operasional</p>
                   </div>
                </div>
                <button 
                  onClick={() => handleNavigate('/settings')}
                  className="px-6 py-3 rounded-2xl bg-[#121212] text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 active:scale-95 transition-all"
                >
                   Manage Target
                </button>
             </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all duration-1000 pointer-events-none" />
        </div>

        {/* Top Agent Leaderboard */}
        <section className="space-y-8">
           <div className="flex items-end justify-between px-2">
              <div>
                 <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">Top Performers</h3>
                 <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1.5">Elite Agents Ranking</p>
              </div>
              <button 
                onClick={() => handleNavigate('/customers')}
                className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-primary transition-colors"
              >
                 Lihat Semua
              </button>
           </div>
           <AgentLeaderboard agents={topAgents} onNavigate={handleNavigate} />
        </section>

        {/* Quick Action Center */}
        <section className="grid grid-cols-2 gap-5">
           <div 
             onClick={() => handleNavigate('/cashier')}
             className="p-8 rounded-[3rem] bg-white border border-slate-100 shadow-premium flex flex-col items-center gap-6 group hover:border-primary/20 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 rounded-[1.75rem] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                 <ShoppingCart className="w-7 h-7" />
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Mode Kasir</p>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Buat Nota Baru</p>
              </div>
           </div>
           <div 
             onClick={() => handleNavigate('/inventory')}
             className="p-8 rounded-[3rem] bg-white border border-slate-100 shadow-premium flex flex-col items-center gap-6 group hover:border-blue-500/20 transition-all cursor-pointer"
           >
              <div className="w-16 h-16 rounded-[1.75rem] bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                 <Package className="w-7 h-7" />
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Cek Gudang</p>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Update Stok</p>
              </div>
           </div>
        </section>

        {/* Premium Achievement Card */}
        <section className="relative overflow-hidden p-12 rounded-[4.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white shadow-2xl group">
           <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <Trophy className="w-7 h-7 text-amber-400 fill-amber-400" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Milestone</p>
                    <p className="text-2xl font-[1000] text-emerald-400 tracking-tighter mt-1">1.2k+</p>
                 </div>
              </div>
              <div>
                 <h3 className="text-3xl font-[1000] tracking-tighter leading-tight">Elite Partner <br />Program.</h3>
                 <p className="text-white/40 text-[10px] font-bold leading-relaxed max-w-[220px] uppercase tracking-widest mt-4">
                    Anda telah mencapai level tertinggi dalam pengelolaan distribusi agen pekan ini.
                 </p>
              </div>
              <button 
                onClick={() => alert('Executive Reward Claimed! System processing...')}
                className="w-full py-5 rounded-[2.5rem] bg-white text-black text-[10px] font-[1000] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95"
              >
                 Claim Executive Reward
              </button>
           </div>
           <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40" />
           <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
           <div className="absolute bottom-10 right-10 opacity-5 scale-[2]">
              <Rocket className="w-32 h-32 stroke-[0.5]" />
           </div>
        </section>

        {/* Footer Note */}
        <footer className="pt-10 pb-40 text-center space-y-6">
           <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest italic">All Systems Operational</span>
              </div>
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Developed by Hayati Terminal</p>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Hayati Agency Network. All Rights Reserved.</p>
              </div>
           </div>
        </footer>

      </div>
    </div>
  )
}
