'use client'

import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronRight, Search, Plus, UserCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

export default function CustomersClient({ customers }: { customers: any[] }) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

  return (
    <div className="flex flex-col gap-6 p-8">
      <header className="flex justify-between items-end pt-4">
        <div>
          <h1 className="text-3xl font-[800] tracking-tight text-[#1A1A1A]">Agen</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Daftar Rekanan</p>
        </div>
        <Link href="/cashier">
          <div className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <Plus className="h-6 w-6" />
          </div>
        </Link>
      </header>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-black transition-colors" />
        <Input 
          placeholder="Cari nama agen..." 
          className="pl-14 h-16 bg-slate-50 border-none rounded-2xl font-bold text-[#1A1A1A] placeholder:text-slate-300 shadow-inner-soft" 
        />
      </div>

      <div className="flex flex-col gap-4">
        {customers.map((c, idx) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link href={`/customers/${c.id}`}>
              <Card className="border-none bg-white rounded-2xl shadow-lux active:scale-[0.98] transition-all overflow-hidden group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-slate-100 group-hover:text-slate-400 transition-colors overflow-hidden">
                      <UserCircle2 className="h-10 w-10" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em]">{c.uid}</span>
                      <h3 className="text-base font-black text-[#1A1A1A] leading-tight">{c.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Piutang:</p>
                        <p className="text-xs font-black text-orange-600">{formatCurrency(c.sisaPiutang)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`rounded-full px-3 py-1 text-[9px] font-black tracking-wider ${c.keuntungan >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {c.keuntungan >= 0 ? '+' : ''}{formatCurrency(c.keuntungan)}
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
