'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Banknote, Receipt, Users, TrendingUp, ChevronRight, Cloud, Sun, CloudRain, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardClient({ stats }: { stats: any }) {
  const [time, setTime] = useState(new Date())
  const [weather, setWeather] = useState({ temp: '28°C', icon: Sun, color: 'text-orange-400' })

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

  const cards = [
    { title: 'Omset', value: formatCurrency(stats.totalOmset), icon: Receipt, sub: 'Potensi', color: 'bg-blue-500', shadow: 'shadow-blue-200' },
    { title: 'Kas', value: formatCurrency(stats.totalKasDiterima), icon: Banknote, sub: 'Tangan', color: 'bg-emerald-500', shadow: 'shadow-emerald-200' },
    { title: 'Piutang', value: formatCurrency(stats.totalPiutang), icon: Users, sub: 'Luar', color: 'bg-rose-500', shadow: 'shadow-rose-200' },
    { title: 'Laba', value: formatCurrency(stats.totalKeuntunganBersih), icon: TrendingUp, sub: 'Bersih', color: 'bg-amber-500', shadow: 'shadow-amber-200' },
  ]

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 pb-32">
      <header className="flex justify-between items-center py-4 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-[1000] tracking-tighter text-slate-900 leading-none">Hayati.</h1>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Overview</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end text-right">
           <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-50">
              <weather.icon className={`w-4 h-4 ${weather.color}`} />
              <span className="font-black text-slate-900 text-xs">{weather.temp}</span>
           </div>
           <p className="text-[9px] font-bold text-slate-300 mt-2 uppercase tracking-widest">Pekanbaru, ID</p>
        </div>
      </header>

      {/* Real Time Widget */}
      <Card variant="lux" padding="lg" radius="2xl" className="relative overflow-hidden group">
         <div className="relative z-10 flex justify-between items-center">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{days[time.getDay()]}, {time.getDate()} {months[time.getMonth()]} {time.getFullYear()}</p>
               <h2 className="text-4xl font-[950] text-white tracking-tighter">
                  {time.getHours().toString().padStart(2, '0')}:
                  {time.getMinutes().toString().padStart(2, '0')}
                  <span className="text-xl opacity-30 ml-1">{time.getSeconds().toString().padStart(2, '0')}</span>
               </h2>
            </div>
            <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
               <Clock className="w-6 h-6 text-white/80" />
            </div>
         </div>
         <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
      </Card>
      
      <div className="grid gap-4 grid-cols-2 mt-2">
        {cards.map((card, idx) => (
          <motion.div 
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card variant="premium" padding="none" className="h-full border-none shadow-premium overflow-hidden group">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center text-white shadow-lg ${card.shadow} group-hover:scale-110 transition-transform duration-500`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{card.title}</p>
                  <p className="text-lg font-[950] text-slate-900 mt-1 tracking-tighter">{card.value}</p>
                </div>
                <div className="flex items-center gap-1.5 opacity-30 mt-auto">
                   <div className="w-1 h-1 rounded-full bg-slate-900" />
                   <span className="text-[8px] font-black uppercase tracking-tighter">{card.sub}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-slate-50 relative overflow-hidden group mt-4"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Smart Insight</span>
          </div>
          <h2 className="text-2xl font-[950] leading-tight text-slate-900 tracking-tighter">Performa Bisnis <br />Makin Stabil.</h2>
          <p className="text-slate-400 text-[10px] font-bold leading-relaxed max-w-[200px] uppercase tracking-wide">
            Laba dihitung berdasarkan realisasi fisik kas di tangan.
          </p>
          <button className="flex items-center gap-3 bg-[#121212] text-white px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            Lihat Laporan <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-slate-50 rounded-full blur-3xl group-hover:bg-slate-100 transition-all duration-700" />
      </motion.div>
    </div>
  )
}
