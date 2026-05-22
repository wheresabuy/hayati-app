import { getDashboardStats, getCustomers } from '@/app/actions/finance'
import { getProducts } from '@/app/actions/products'
import DashboardClient from './dashboard-client'
import { auth } from '@/auth'

export default async function DashboardPage() {
  const session = await auth()
  const stats = await getDashboardStats()

  return (
    <div className="flex flex-col gap-6 pb-20">
      <DashboardClient stats={stats} />
      
      <div className="px-6">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-cute text-center border-2 border-slate-50">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">
            "Selamat Bekerja, {session?.user?.name}!"
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Semua data transaksi tersimpan aman di Cloud.</p>
        </div>
      </div>
    </div>
  )
}
