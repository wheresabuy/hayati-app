'use client'

import { signOut } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, FileText, UserCircle, ShieldCheck, ChevronRight, Info } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SettingsClient({ session }: { session: any }) {
  const role = (session?.user as any)?.role

  const menuItems = [
    { label: 'Laporan Penjualan', icon: FileText, sub: 'Lihat mutasi barang & uang', color: 'text-blue-500' },
    { label: 'Keamanan Akun', icon: ShieldCheck, sub: 'Ganti password (Coming Soon)', color: 'text-emerald-500' },
    { label: 'Tentang Aplikasi', icon: Info, sub: 'Hayati Agen v5.5', color: 'text-slate-400' },
  ]

  return (
    <div className="flex flex-col gap-6 p-8">
      <header className="flex justify-between items-end pt-4">
        <div>
          <h1 className="text-3xl font-[800] tracking-tight text-[#1A1A1A]">Akun</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Profile & Menu</p>
        </div>
        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center">
          <UserCircle className="h-6 w-6 text-black" />
        </div>
      </header>

      {/* Profile Card */}
      <Card className="border-none bg-white rounded-[2.5rem] shadow-lux overflow-hidden">
        <CardContent className="p-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xl">
            {session?.user?.name?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{session?.user?.name}</h2>
            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest mt-1">
              {role}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 pt-4">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Menu Utama</h3>
        <div className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <Card key={item.label} className="border-none bg-white rounded-3xl shadow-soft hover:shadow-lux transition-all active:scale-[0.98]">
              <CardContent className="p-5 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 leading-none">{item.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">{item.sub}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="pt-8 pb-20">
        <Button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full h-16 rounded-[2rem] bg-rose-50 hover:bg-rose-100 text-rose-600 font-black border-none shadow-none transition-all group"
        >
          <LogOut className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          LOGOUT DARI APLIKASI
        </Button>
      </div>
    </div>
  )
}
