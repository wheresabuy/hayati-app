'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { addPayment } from '@/app/actions/finance'
import { PlusCircle } from 'lucide-react'

export default function PaymentDialog({ customerId, customerName }: { customerId: string, customerName: string }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return

    setLoading(true)
    try {
      await addPayment(customerId, parseFloat(amount))
      setOpen(false)
      setAmount('')
    } catch (error) {
      alert('Gagal simpan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-black text-white shadow-lg shadow-emerald-100">
            <PlusCircle className="h-5 w-5 mr-2" />
            CATAT CICILAN BARU
          </Button>
        }
      />
      <DialogContent className="rounded-[2.5rem] border-none p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900">Pembayaran: {customerName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Jumlah Nominal (Rp)</label>
            <Input 
              type="number" 
              placeholder="0" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-14 rounded-2xl bg-slate-50 border-none font-black text-lg text-slate-900"
              required
            />
          </div>
          <Button type="submit" className="w-full h-14 rounded-2xl font-black bg-slate-900 text-white" disabled={loading}>
            {loading ? 'MENYIMPAN...' : 'SIMPAN SEKARANG'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
