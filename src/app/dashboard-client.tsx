'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Banknote, Receipt, Users, TrendingUp, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardClient({ stats }: { stats: any }) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

  const cards = [
    { title: 'Omset', value: formatCurrency(stats.totalOmset), icon: Receipt, sub: 'Potensi' },
    { title: 'Kas', value: formatCurrency(stats.totalKasDiterima), icon: Banknote, sub: 'Tangan' },
    { title: 'Piutang', value: formatCurrency(stats.totalPiutang), icon: Users, sub: 'Luar' },
    { title: 'Laba', value: formatCurrency(stats.totalKeuntunganBersih), icon: TrendingUp, sub: 'Bersih' },
  ]

  return (
    <div className="flex flex-col gap-8 p-8">
      <header className="flex justify-between items-end pt-4">
        <div>
          <h1 className="text-3xl font-[800] tracking-tight text-[#1A1A1A]">Hayati</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Overview 2025</p>
        </div>
        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-100" />
        </div>
      </header>
      
      <div className="grid gap-4 grid-cols-2">
        {cards.map((card, idx) => (
          <motion.div 
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-none bg-white rounded-[2rem] shadow-lux overflow-hidden">
              <CardContent className="p-6 flex flex-col gap-6">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <card.icon className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                  <p className="text-base font-black text-[#1A1A1A] mt-1">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-[#121212] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Smart Analysis</span>
          </div>
          <h2 className="text-xl font-bold leading-tight">Bisnis Abang <br />Hari Ini.</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-[180px]">
            Laba dihitung dari realisasi uang fisik yang masuk ke kas.
          </p>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-[10px] font-bold">
            Detail Performa <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
      </motion.div>
    </div>
  )
}
