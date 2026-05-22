'use client'

import { getCustomerDetail, deleteTransaction, deletePayment } from '@/app/actions/finance'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, FileText, ArrowDownCircle, History, Trash2 } from 'lucide-react'
import PaymentDialog from './payment-dialog'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

export default function CustomerDetailClient({ customer, isAdmin }: { customer: any, isAdmin: boolean }) {
  const router = useRouter()
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

  const handleDeleteTrans = async (id: string) => {
    if (!confirm('Hapus nota ini? Stok barang akan dikembalikan otomatis.')) return
    await deleteTransaction(id)
    router.refresh()
  }

  const handleDeletePay = async (id: string) => {
    if (!confirm('Hapus catatan cicilan ini?')) return
    await deletePayment(id)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <header className="flex items-center gap-4 py-2">
        <Button variant="ghost" size="icon" asChild className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100">
          <Link href="/customers"><ChevronLeft className="h-5 w-5 text-black" /></Link>
        </Button>
        <div>
          <h1 className="text-xl font-[900] text-black leading-none">{customer.name}</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{customer.uid}</p>
        </div>
      </header>

      {/* Putih - Sesuai Request User */}
      <Card className="border-none bg-white rounded-[2.5rem] p-4 shadow-lux overflow-hidden">
        <CardContent className="p-4 space-y-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-2">Total Sisa Piutang</p>
            <h2 className="text-4xl font-[950] text-[#121212] tracking-tighter">{formatCurrency(customer.sisaPiutang)}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Akumulasi Nota</p>
              <p className="text-sm font-[900] text-black mt-1">{formatCurrency(customer.totalNota)}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Laba Bersih (Cash)</p>
              <p className={`text-sm font-[900] mt-1 ${customer.keuntungan >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {formatCurrency(customer.keuntungan)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="px-1">
        <PaymentDialog customerId={customer.id} customerName={customer.name} />
      </div>

      <div className="space-y-4 pt-4 pb-20">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-2">Riwayat Aktivitas</h3>

        <div className="flex flex-col gap-4">
          {[
            ...customer.transactions.map((t: any) => ({ ...t, type: 'TRANS' })),
            ...customer.payments.map((p: any) => ({ ...p, type: 'PAY' }))
          ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((item: any, idx) => (
            <Card key={idx} className="border-none bg-white rounded-[2rem] shadow-soft active:scale-[0.98] transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'PAY' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-black'}`}>
                    {item.type === 'PAY' ? <ArrowDownCircle className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                      {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                    </p>
                    <p className="text-sm font-black text-black mt-0.5">
                      {item.type === 'PAY' ? 'Cicilan Masuk' : `Nota Belanja`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-sm font-black ${item.type === 'PAY' ? 'text-emerald-500' : 'text-black'}`}>
                    {item.type === 'PAY' ? '+' : '-'}{formatCurrency(item.type === 'PAY' ? item.amount : item.totalReceivable)}
                  </p>
                  {isAdmin && (
                    <button onClick={() => item.type === 'PAY' ? handleDeletePay(item.id) : handleDeleteTrans(item.id)} className="text-slate-200 hover:text-rose-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {customer.transactions.length === 0 && customer.payments.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] text-slate-300 font-bold text-xs uppercase tracking-widest italic">Belum Ada Aktivitas</div>
          )}
        </div>
      </div>
    </div>
  )
}
