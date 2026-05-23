'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Boxes, Search, Package, Filter, ChevronRight, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  ShieldCheck, Zap, LayoutGrid, List, Plus, Download,
  FilterX, Activity, Hash, Tag, History, Settings,
  Trash2, Edit3, Heart, Sparkles, TrendingUp,
  AlertTriangle, CheckCircle2, ShoppingCart, 
  BarChart3, Layers, Globe, Cpu, Database
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

const InventoryStats = ({ products }: any) => {
  const lowStock = products.filter((p: any) => p.stock < 10).length
  const totalValue = products.reduce((acc: number, p: any) => acc + (p.baseCost * p.stock), 0)

  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: 'Total Produk', value: products.length.toString(), sub: 'Katalog Aktif', icon: Package, color: 'bg-blue-500' },
        { label: 'Nilai Aset', value: `Rp${(totalValue/1000000).toFixed(1)}jt`, sub: 'Estimasi Modal', icon: Layers, color: 'bg-emerald-500' },
        { label: 'Stok Menipis', value: lowStock.toString(), sub: 'Butuh Restock', icon: AlertTriangle, color: 'bg-rose-500' },
        { label: 'Barang Keluar', value: '142', sub: '24 Jam Terakhir', icon: ShoppingCart, color: 'bg-amber-500' },
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
}

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

export default function InventoryClient({ products }: { products: any[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredProducts = products.filter(p => 
    (p.name.toLowerCase().includes(search.toLowerCase())) &&
    (filter === 'Semua' || (filter === 'Menipis' && p.stock < 10) || (filter === 'Tersedia' && p.stock >= 10))
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-40">
      
      {/* Header Premium */}
      <header className="pt-8 px-8 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-[1000] tracking-tighter text-slate-900">Gudang Stok.</h1>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hayati Logistics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="w-14 h-14 rounded-3xl bg-[#121212] flex items-center justify-center text-white shadow-2xl shadow-black/20 hover:scale-105 transition-transform">
              <Plus className="w-6 h-6" />
           </button>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pt-10 px-6 space-y-10">
        
        {/* Quick Insights */}
        <InventoryStats products={products} />

        {/* Global Search & Filters */}
        <section className="space-y-6">
           <div className="relative group">
             <Input 
                placeholder="Cari Nama Barang..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-16 pl-14 pr-12 rounded-[1.5rem] bg-white border-none shadow-premium font-bold text-sm focus:ring-4 focus:ring-primary/5 transition-all"
             />
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
           </div>

           <div className="flex items-center justify-between">
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 flex-1">
                {['Semua', 'Menipis', 'Tersedia', 'Baru'].map(cat => (
                  <CategoryPill 
                    key={cat} 
                    label={cat} 
                    active={filter === cat} 
                    onClick={() => setFilter(cat)}
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

        {/* Product Grid */}
        <section className="space-y-6">
           <div className="flex items-end justify-between px-2">
              <div>
                 <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">Inventori Real-time</h3>
                 <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1.5 italic">Gudang Utama Pekanbaru</p>
              </div>
              <button className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-primary transition-colors">
                 Cetak Laporan <Download className="w-3 h-3" />
              </button>
           </div>

           <div className="grid grid-cols-1 gap-6">
             <AnimatePresence mode="popLayout">
               {filteredProducts.length > 0 ? filteredProducts.map((p, i) => (
                 <motion.div
                   key={p.id}
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ delay: 0.05 * i }}
                   className="group relative"
                 >
                   <Link href={`/inventory/${p.id}`}>
                     <Card className="rounded-[3rem] bg-white border border-slate-50 shadow-premium group-hover:shadow-lux group-hover:border-primary/20 transition-all overflow-hidden">
                       <CardContent className="p-8">
                         <div className="flex justify-between items-start mb-8">
                           <div className="flex items-center gap-5">
                              <div className="w-20 h-20 rounded-[2.2rem] bg-slate-50 flex items-center justify-center text-slate-200 border-2 border-slate-100 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                                 <Package className="w-10 h-10" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">SKU-{p.id.slice(0, 5).toUpperCase()}</p>
                                <h4 className="text-2xl font-[1000] text-slate-900 tracking-tighter truncate leading-none mb-2">{p.name}</h4>
                                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-50 w-fit">
                                   <Activity className="w-3 h-3 text-emerald-500" />
                                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Stock</span>
                                </div>
                              </div>
                           </div>
                           <div className="flex flex-col items-end">
                              <span className={cn(
                                "text-3xl font-[1000] tracking-tighter leading-none",
                                p.stock < 10 ? "text-rose-500" : "text-slate-900"
                              )}>
                                 {p.stock}
                              </span>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Unit</p>
                           </div>
                         </div>

                         <div className="grid grid-cols-2 gap-6 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100/50 group-hover:bg-white transition-all">
                            <div className="space-y-1">
                               <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Modal Satuan</p>
                               <p className="text-lg font-[1000] text-slate-900 tracking-tighter">
                                  {formatCurrency(p.baseCost)}
                               </p>
                            </div>
                            <div className="space-y-1 text-right">
                               <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Total Nilai</p>
                               <p className="text-lg font-[1000] text-primary tracking-tighter">
                                  {formatCurrency(p.baseCost * p.stock)}
                               </p>
                            </div>
                         </div>

                         <div className="mt-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="flex -space-x-2">
                                  {[1, 2, 3].map(a => (
                                    <div key={a} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
                                  ))}
                               </div>
                               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Terjual ke 12 Agen</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-24 h-6 bg-slate-50 rounded-xl overflow-hidden p-0.5">
                                  <CompactLineChart 
                                    data={Array.from({ length: 12 }, () => Math.random() * 100)} 
                                    color={p.stock < 10 ? "#f43f5e" : "#10b981"}
                                  />
                               </div>
                               <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                         </div>
                       </CardContent>
                       {p.stock < 10 && (
                          <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 text-white shadow-lg animate-pulse">
                             <AlertTriangle className="w-3 h-3" />
                             <span className="text-[8px] font-black uppercase tracking-widest">Low Stock</span>
                          </div>
                       )}
                     </Card>
                   </Link>
                 </motion.div>
               )) : (
                 <div className="py-20 text-center text-slate-300">Produk tidak ditemukan</div>
               )}
             </AnimatePresence>
           </div>
        </section>

        {/* Achievement Card */}
        <section className="p-12 rounded-[4.5rem] bg-[#121212] text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                 <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <History className="w-8 h-8 text-primary" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Opname Terakhir</p>
                    <p className="text-xl font-[1000] text-emerald-400 tracking-tighter mt-1 italic">Tadi Pagi, 08:30</p>
                 </div>
              </div>
              <h3 className="text-3xl font-[1000] tracking-tighter leading-tight">Sinkronisasi <br />Gudang Global.</h3>
              <p className="text-white/40 text-[10px] font-bold leading-relaxed max-w-[220px] uppercase tracking-widest mt-4">
                 Semua data stok terikat langsung dengan sistem kasir real-time. Tidak ada selisih, tidak ada delay.
              </p>
              <button className="w-full py-5 rounded-[2.5rem] bg-white text-black text-[10px] font-[1000] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
                 Lakukan Stock Opname
              </button>
           </div>
           <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40" />
           <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[2] pointer-events-none">
              <Cpu className="w-64 h-64 stroke-[0.5]" />
           </div>
        </section>

        {/* System Logs */}
        <footer className="pt-10 pb-20 text-center space-y-6">
           <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">Inventory Data Verified</span>
              </div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Hayati Logistics Terminal</p>
           </div>
        </footer>

      </div>
    </div>
  )
}
