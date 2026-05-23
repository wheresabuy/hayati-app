'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Search, UserPlus, Filter, ChevronRight, 
  MapPin, Phone, CreditCard, Clock, Star, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Mail, MessageSquare, ShieldCheck, Zap, Globe,
  LayoutGrid, List, Plus, Download, FilterX,
  User, Award, Target, Flame, Box, Calendar,
  CreditCard as Wallet, Activity, Hash, Tag,
  History, Settings, Trash2, Edit3, Heart, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

const CompactLineChart = React.memo(({ data, color }: { data: number[], color: string }) => {
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
    <svg viewBox="0 0 100 100" className="w-full h-8 overflow-visible">
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />
    </svg>
  )
})
CompactLineChart.displayName = 'CompactLineChart'

const CustomerStats = ({ stats }: any) => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { label: 'Total Agen', value: '42', sub: 'Aktif Pekan Ini', icon: Users, color: 'bg-blue-500' },
      { label: 'Total Piutang', value: 'Rp12.4M', sub: 'Butuh Followup', icon: Wallet, color: 'bg-rose-500' },
      { label: 'VIP Member', value: '18', sub: 'Loyalitas Tinggi', icon: Star, color: 'bg-amber-500' },
      { label: 'New Lead', value: '5', sub: 'Belum Terverifikasi', icon: UserPlus, color: 'bg-emerald-500' },
    ].map((s, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * i }}
        className="p-6 rounded-[2.5rem] bg-white border border-slate-50 shadow-premium group hover:border-primary/20 transition-all"
      >
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform", s.color)}>
          <s.icon className="w-5 h-5" />
        </div>
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{s.label}</p>
        <h4 className="text-xl font-[1000] text-slate-900 tracking-tighter mt-1">{s.value}</h4>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{s.sub}</p>
      </motion.div>
    ))}
  </div>
)

const CategoryPill = ({ label, active, onClick, count }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
      active 
        ? "bg-[#121212] text-white shadow-xl scale-105" 
        : "bg-white text-slate-400 border border-slate-50 hover:bg-slate-50"
    )}
  >
    {label}
    {count !== undefined && (
       <span className={cn("ml-1 px-1.5 py-0.5 rounded-md text-[8px]", active ? "bg-primary text-white" : "bg-slate-100 text-slate-400")}>
          {count}
       </span>
    )}
  </button>
)

export default function CustomersClient({ customers }: { customers: any[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredCustomers = customers.filter(c => 
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.uid.toLowerCase().includes(search.toLowerCase())) &&
    (filter === 'Semua' || (filter === 'Hutang' && c.totalDebt > 0) || (filter === 'VIP' && c.id.length % 2 === 0))
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-40">
      
      {/* Header Premium */}
      <header className="pt-8 px-8 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-[1000] tracking-tighter text-slate-900">Jaringan Agen.</h1>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hayati Ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="w-14 h-14 rounded-3xl bg-[#121212] flex items-center justify-center text-white shadow-2xl shadow-black/20 hover:scale-105 transition-transform">
              <UserPlus className="w-6 h-6" />
           </button>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pt-10 px-6 space-y-10">
        
        {/* Quick Insights */}
        <CustomerStats />

        {/* Global Search & Filters */}
        <section className="space-y-6">
           <div className="relative group">
             <Input 
                placeholder="Cari Nama Agen atau UID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-16 pl-14 pr-12 rounded-[1.5rem] bg-white border-none shadow-premium font-bold text-sm focus:ring-4 focus:ring-primary/5 transition-all"
             />
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
             <AnimatePresence>
               {search && (
                 <motion.button 
                   initial={{ opacity: 0, scale: 0.5 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.5 }}
                   onClick={() => setSearch('')}
                   className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-rose-500"
                 >
                   <FilterX className="w-3 h-3" />
                 </motion.button>
               )}
             </AnimatePresence>
           </div>

           <div className="flex items-center justify-between">
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 flex-1">
                {['Semua', 'Hutang', 'VIP', 'Aktif'].map(cat => (
                  <CategoryPill 
                    key={cat} 
                    label={cat} 
                    active={filter === cat} 
                    onClick={() => setFilter(cat)}
                    count={cat === 'Semua' ? customers.length : undefined}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 ml-4 bg-white p-1.5 rounded-2xl border border-slate-50 shadow-soft">
                 <button 
                   onClick={() => setViewMode('grid')}
                   className={cn("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-slate-900 text-white" : "text-slate-300 hover:text-slate-900")}
                 >
                    <LayoutGrid className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => setViewMode('list')}
                   className={cn("p-2 rounded-xl transition-all", viewMode === 'list' ? "bg-slate-900 text-white" : "text-slate-300 hover:text-slate-900")}
                 >
                    <List className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </section>

        {/* Customer Matrix Grid */}
        <section className="space-y-6">
           <div className="flex items-end justify-between px-2">
              <div>
                 <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">Database Agen</h3>
                 <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1.5 italic">Synchronized Grid</p>
              </div>
              <button className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-primary transition-colors">
                 Ekspor Data <Download className="w-3 h-3" />
              </button>
           </div>

           <div className={cn(
             "grid gap-6",
             viewMode === 'grid' ? "grid-cols-1" : "grid-cols-1"
           )}>
             <AnimatePresence mode="popLayout">
               {filteredCustomers.length > 0 ? filteredCustomers.map((c, i) => (
                 <motion.div
                   key={c.id}
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ delay: 0.05 * i }}
                   className="group relative"
                 >
                   <Link href={`/customers/${c.id}`}>
                     <Card className="rounded-[3rem] bg-white border border-slate-50 shadow-premium group-hover:shadow-lux group-hover:border-primary/20 transition-all overflow-hidden">
                       <CardContent className="p-8">
                         <div className="flex justify-between items-start mb-8">
                           <div className="flex items-center gap-5">
                              <div className="relative">
                                 <div className="w-20 h-20 rounded-[2rem] bg-slate-50 overflow-hidden p-0.5 border-2 border-slate-100 group-hover:border-primary/20 transition-all flex items-center justify-center">
                                    <User className="w-10 h-10 text-slate-200" />
                                 </div>
                                 <div className={cn(
                                   "absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-white shadow-sm flex items-center justify-center",
                                   c.totalDebt > 0 ? "bg-rose-500" : "bg-emerald-500"
                                 )}>
                                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                 </div>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{c.uid}</p>
                                <h4 className="text-2xl font-[1000] text-slate-900 tracking-tighter truncate leading-none mb-2">{c.name}</h4>
                                <div className="flex items-center gap-2">
                                   <div className="flex -space-x-1">
                                      {[1, 2, 3].map(s => <Star key={s} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />)}
                                   </div>
                                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Elite Member</span>
                                </div>
                              </div>
                           </div>
                           <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                              <MoreHorizontal className="w-5 h-5" />
                           </button>
                         </div>

                         <div className="grid grid-cols-2 gap-6 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100/50 mb-8 group-hover:bg-white transition-all">
                            <div className="space-y-1">
                               <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Saldo Piutang</p>
                               <p className={cn("text-lg font-[1000] tracking-tighter", c.totalDebt > 0 ? "text-rose-500" : "text-emerald-500")}>
                                  {formatCurrency(c.totalDebt)}
                               </p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Total Transaksi</p>
                               <p className="text-lg font-[1000] text-slate-900 tracking-tighter">
                                  {c.transactions?.length || 0} Kali
                               </p>
                            </div>
                         </div>

                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                               <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                     <Phone className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Contact</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                     <MapPin className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Location</span>
                               </div>
                            </div>
                            <div className="w-32 h-10 bg-slate-50 rounded-2xl p-1 overflow-hidden group-hover:bg-primary/5 transition-all">
                               <CompactLineChart 
                                 data={Array.from({ length: 12 }, () => Math.random() * 100)} 
                                 color="#f59e0b"
                               />
                            </div>
                         </div>
                       </CardContent>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                     </Card>
                   </Link>
                 </motion.div>
               )) : (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="py-32 text-center space-y-6 bg-white rounded-[4rem] border-2 border-dashed border-slate-100"
                 >
                   <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner-soft">
                      <Search className="w-10 h-10 text-slate-200" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-[1000] text-slate-900 tracking-tighter italic">Data Tidak Ditemukan</h4>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Coba keyword pencarian lain</p>
                   </div>
                   <button className="px-8 py-4 bg-[#121212] text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                      Reset Pencarian
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </section>

        {/* Intelligence Insight */}
        <section className="p-12 rounded-[4rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
           <div className="relative z-10 flex flex-col gap-10">
              <div className="flex justify-between items-start">
                 <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-xl">
                    <Target className="w-8 h-8" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Target Growth</p>
                    <p className="text-2xl font-[1000] text-emerald-300 tracking-tighter mt-1">+142%</p>
                 </div>
              </div>
              <div>
                 <h3 className="text-3xl font-[1000] tracking-tighter leading-tight">Master Elite <br />Member Status.</h3>
                 <p className="text-white/40 text-[11px] font-bold leading-relaxed max-w-[240px] uppercase tracking-widest mt-4">
                    Kembangkan jaringan Anda lebih luas. Agen dengan performa 5-bintang akan mendapatkan prioritas stok premium.
                 </p>
              </div>
              <button className="flex items-center gap-4 bg-white text-indigo-600 px-10 py-5 rounded-[2.5rem] text-[10px] font-[1000] uppercase tracking-widest shadow-2xl hover:bg-emerald-400 hover:text-white transition-all active:scale-95 w-fit">
                 Buka VIP Portal <Sparkles className="w-4 h-4" />
              </button>
           </div>
           <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <Globe className="w-96 h-96 -ml-20 -mt-20 stroke-[0.5]" />
           </div>
        </section>

        {/* Footer Stats */}
        <footer className="pt-10 pb-20 text-center space-y-6">
           <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] italic">Network Health: Excellent</span>
              </div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Hayati Agency CRM Terminal</p>
           </div>
           <div className="flex items-center justify-center gap-4 opacity-20">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
           </div>
        </footer>

      </div>
    </div>
  )
}
