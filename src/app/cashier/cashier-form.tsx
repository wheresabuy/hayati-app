'use client'

import { useState, useEffect } from 'react'
import { CustomerSelect, ProductSelect } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createTransaction } from '@/app/actions/finance'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, ArrowLeft, CheckCircle2, Minus, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CashierForm({ customers, products }: { customers: any[], products: any[] }) {
  const router = useRouter()
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [customerPrices, setCustomerPrices] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (selectedCustomerId) {
      fetch(`/api/customer-prices?customerId=${selectedCustomerId}`).then(res => res.json()).then(data => setCustomerPrices(data))
    }
  }, [selectedCustomerId])

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId)
    const priceObj = customerPrices.find(cp => cp.productId === productId)
    if (!product || !priceObj) return
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId)
      if (existing) return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
      return [...prev, { productId, productName: product.name, quantity: 1, price: priceObj.sellingPrice, stock: product.stock }]
    })
  }

  const updateQuantity = (index: number, q: number) => {
    if (q < 1) return
    setCart(prev => prev.map((item, i) => i === index ? { ...item, quantity: q } : item))
  }

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const handleSubmit = async () => {
    if (!selectedCustomerId || cart.length === 0) return
    for (const item of cart) { if (item.quantity > item.stock) { alert(`Stok ${item.productName} habis!`); return } }
    setLoading(true)
    try {
      await createTransaction(selectedCustomerId, cart.map(item => ({ productId: item.productId, quantity: item.quantity })))
      setSuccess(true)
      setTimeout(() => { router.push('/customers'); router.refresh() }, 1500)
    } catch (e) { alert('Gagal simpan') } finally { setLoading(false) }
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-[3rem] flex items-center justify-center mb-8 shadow-xl">
          <CheckCircle2 className="w-16 h-16" />
        </motion.div>
        <h2 className="text-4xl font-[950] text-black tracking-tighter italic">Nota Berhasil!</h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mt-4 text-[10px]">Stok Terpotong Real-time</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 pb-48">
      <header className="flex items-center justify-between py-2 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button onClick={() => router.back()} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-100 flex items-center justify-center bg-white shadow-sm active:scale-90 transition-transform shrink-0">
            <ArrowLeft className="h-5 w-5 text-black" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-[950] tracking-tighter truncate">Kasir</h1>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
          <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </header>

      <div className="space-y-6 sm:space-y-8">
        <div className="space-y-3">
          <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">1. Pilih Agen</label>
          <CustomerSelect 
            customers={customers} 
            value={selectedCustomerId} 
            onValueChange={(val) => val && setSelectedCustomerId(val)} 
            size="lg"
            variant="premium"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-1">2. Tambah Barang</label>
          <ProductSelect 
            products={products} 
            onValueChange={(val) => val && addToCart(val)}
            size="lg"
            variant="secondary"
            disabled={!selectedCustomerId}
          />
        </div>
      </div>

      <div className="space-y-4 mt-8 sm:mt-12">
        <h3 className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-1">3. Daftar Belanja</h3>
        <AnimatePresence mode="popLayout">
          {cart.map((item, index) => (
            <motion.div key={item.productId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} layout>
              <Card variant="premium" padding="none" className="group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-black text-base sm:text-lg tracking-tight truncate">{item.productName}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-none pt-3 sm:pt-0">
                    <div className="flex items-center gap-3 sm:gap-4 bg-slate-50 rounded-2xl p-1 px-3 border border-slate-100">
                      <button onClick={() => updateQuantity(index, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 active:text-black"><Minus className="h-3 w-3" /></button>
                      <span className="font-black text-black min-w-[20px] text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 active:text-black"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => setCart(cart.filter((_, i) => i !== index))} className="text-slate-200 hover:text-rose-500 transition-colors p-2"><Trash2 className="h-5 w-5" /></button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {cart.length === 0 && <div className="text-center py-16 sm:py-24 bg-slate-50/50 rounded-[3rem] sm:rounded-[3.5rem] border-2 border-dashed border-slate-100 text-slate-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest italic">Belum Ada Barang</div>}
      </div>

      <div className="fixed bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 sm:px-8 z-40">
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-[#121212] rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl p-6 sm:p-10 flex items-center justify-between text-white border border-white/5 overflow-hidden">
          <div className="relative z-10 min-w-0">
            <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.4em] opacity-40">Total Nota</p>
            <p className="text-xl sm:text-3xl font-[950] tracking-tighter mt-0.5 truncate">{formatCurrency(total)}</p>
          </div>
          <Button 
            disabled={loading || cart.length === 0 || !selectedCustomerId} 
            onClick={handleSubmit} 
            variant="gold"
            effect="shimmer"
            size="lg"
            className="px-6 sm:px-10 rounded-[1.5rem] sm:rounded-[2rem] relative z-10 shrink-0 ml-2"
          >
            {loading ? '...' : 'CHECKOUT'}
          </Button>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl" />
        </motion.div>
      </div>
    </div>
  )
}
