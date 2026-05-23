'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, Plus, ArrowLeft, CheckCircle2, Minus, ShoppingBag, 
  Download, Search, Package, AlertCircle, CreditCard, 
  Wallet, Banknote, Receipt, ArrowRight, Zap, Sparkles,
  Layers, Database, ShieldCheck, History, User, Tag,
  Clock, MapPin, Hash, Info, Target, ChevronRight,
  MousePointer2, Flame, Laptop, Smartphone
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CustomerSelect } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createTransaction } from '@/app/actions/finance'
import { cn } from '@/lib/utils'

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

const SuccessScreen = ({ lastTransaction, generatePDF, onBack }: any) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
    
    <motion.div 
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', damping: 15 }}
      className="w-40 h-40 bg-emerald-50 text-emerald-500 rounded-[4rem] flex items-center justify-center mb-12 shadow-2xl relative z-10"
    >
      <CheckCircle2 className="w-20 h-20" />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 border-4 border-emerald-200 rounded-[4rem]"
      />
    </motion.div>

    <div className="relative z-10 space-y-4 max-w-[320px]">
      <h2 className="text-5xl font-[1000] text-slate-900 tracking-tighter leading-none italic">
        Transaksi <br />Berhasil!
      </h2>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Stok Terpotong Real-time</p>
      
      <div className="pt-12 space-y-3">
        <button 
          onClick={() => generatePDF(lastTransaction)}
          className="w-full h-16 rounded-[2rem] bg-[#121212] text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all"
        >
          <Download className="w-5 h-5" /> Cetak Nota (PDF)
        </button>
        <button 
          onClick={onBack}
          className="w-full h-16 rounded-[2rem] bg-white border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-900 hover:border-slate-900 transition-all active:scale-95"
        >
          Kembali ke Terminal
        </button>
      </div>
    </div>

    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20">
       <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]">Hayati Agency System</p>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
       </div>
    </div>
  </div>
)

export default function CashierForm({ customers, products }: { customers: any[], products: any[] }) {
  const router = useRouter()
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [customerPrices, setCustomerPrices] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'TRANSFER' | 'DEBT'>('CASH')

  useEffect(() => {
    if (selectedCustomerId) {
      fetch(`/api/customer-prices?customerId=${selectedCustomerId}`)
        .then(res => res.json())
        .then(data => setCustomerPrices(data))
    } else {
      setCustomerPrices([])
      setCart([])
    }
  }, [selectedCustomerId])

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId)
    const priceObj = customerPrices.find(cp => cp.productId === productId)
    if (!product || !priceObj) return
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId)
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('Batas stok tercapai!')
          return prev
        }
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { productId, productName: product.name, quantity: 1, price: priceObj.sellingPrice, stock: product.stock }]
    })
  }

  const updateQuantity = (index: number, q: number) => {
    const item = cart[index]
    if (q < 1) return
    if (q > item.stock) {
      alert('Stok tidak mencukupi!')
      return
    }
    setCart(prev => prev.map((item, i) => i === index ? { ...item, quantity: q } : item))
  }

  const total = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart])

  const generatePDF = (transaction: any) => {
    if (!transaction) return
    const doc = new jsPDF()
    const customer = customers.find(c => c.id === selectedCustomerId)
    
    doc.setFillColor(18, 18, 18)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('HAYATI AGEN', 14, 25)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('ELITE AGENCY TERMINAL v3.2', 14, 32)
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.text(`NOTA ID: #${transaction.id.slice(0, 8).toUpperCase()}`, 14, 55)
    doc.text(`TANGGAL: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 61)
    doc.text(`PELANGGAN: ${customer?.name || 'UMUM'} (${customer?.uid || '-'})`, 14, 67)

    const tableData = cart.map((item, idx) => [
      idx + 1,
      item.productName,
      `${item.quantity} UNIT`,
      `Rp ${item.price.toLocaleString('id-ID')}`,
      `Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
    ])

    autoTable(doc, {
      startY: 75,
      head: [['NO', 'PRODUK', 'QTY', 'HARGA', 'SUBTOTAL']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [18, 18, 18], fontStyle: 'bold', halign: 'center' },
      columnStyles: { 0: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' } }
    })

    const finalY = (doc as any).lastAutoTable.finalY + 15
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL PEMBAYARAN:', 120, finalY)
    doc.text(`Rp ${total.toLocaleString('id-ID')}`, 200, finalY, { align: 'right' })
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(150, 150, 150)
    doc.text('Dokumen ini sah dan diterbitkan secara digital oleh Sistem Hayati.', 105, finalY + 30, { align: 'center' })

    doc.save(`NOTA-HAYATI-${transaction.id.slice(0, 8)}.pdf`)
  }

  const handleSubmit = async () => {
    if (!selectedCustomerId || cart.length === 0) return
    for (const item of cart) { if (item.quantity > item.stock) { alert(`Stok ${item.productName} habis!`); return } }
    setLoading(true)
    try {
      const res = await createTransaction(selectedCustomerId, cart.map(item => ({ productId: item.productId, quantity: item.quantity })))
      setLastTransaction(res)
      setSuccess(true)
    } catch (e) { alert('Gagal memproses transaksi.') } finally { setLoading(false) }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (success) return <SuccessScreen lastTransaction={lastTransaction} generatePDF={generatePDF} onBack={() => { router.push('/customers'); router.refresh() }} />

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-64 selection:bg-primary/20">
      
      {/* Dynamic Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[60] bg-white/80 backdrop-blur-2xl px-6 py-6 border-b border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="w-12 h-12 rounded-[1.25rem] border border-slate-100 flex items-center justify-center bg-white shadow-sm active:scale-90 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-slate-900" />
          </button>
          <div>
            <h1 className="text-2xl font-[1000] tracking-tighter text-slate-900">Kasir.</h1>
            <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1 italic">POS Terminal</p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl relative overflow-hidden">
          <ShoppingBag className="h-5 w-5 relative z-10" />
          <div className="absolute top-0 right-0 w-6 h-6 bg-primary/20 rounded-full blur-xl" />
        </div>
      </header>

      <div className="max-w-[480px] mx-auto pt-32 px-6 space-y-12">
        
        {/* Step 1: Agent Identity */}
        <section className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">Identitas</h3>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1.5 italic">1. Pilih Agen Penerima</p>
            </div>
            {selectedCustomerId && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100">
                 <ShieldCheck className="w-3 h-3" />
                 <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
              </div>
            )}
          </div>
          
          <div className="group relative">
            <CustomerSelect 
              customers={customers} 
              value={selectedCustomerId} 
              onValueChange={(val) => val && setSelectedCustomerId(val)} 
              size="lg"
              variant="premium"
              className="h-20 rounded-[2rem] shadow-premium bg-white border-none text-lg font-[1000] tracking-tight focus:ring-4 focus:ring-primary/5"
            />
          </div>
        </section>

        {/* Step 2: Product Matrix */}
        <AnimatePresence>
          {selectedCustomerId && (
            <motion.section 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-8"
            >
              <div className="flex items-center justify-between px-2">
                <div>
                  <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">Katalog</h3>
                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1.5 italic">2. Tambah Barang</p>
                </div>
                <div className="relative w-40 sm:w-60 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Cari..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border-none rounded-[1.25rem] text-xs font-[1000] shadow-premium focus:ring-4 focus:ring-primary/5 outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-h-[440px] overflow-y-auto no-scrollbar pb-8 pr-1">
                {filteredProducts.map((p, i) => {
                  const priceObj = customerPrices.find(cp => cp.productId === p.id)
                  const isInCart = cart.find(item => item.productId === p.id)
                  
                  return (
                    <motion.button 
                      key={p.id} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => addToCart(p.id)}
                      disabled={!priceObj || p.stock <= 0}
                      className={cn(
                        "relative flex flex-col p-5 rounded-[2.5rem] text-left transition-all border-2 overflow-hidden group/item",
                        isInCart ? "bg-primary/5 border-primary/20 scale-[0.98]" : "bg-white border-slate-50 shadow-soft hover:shadow-premium hover:border-primary/10",
                        (!priceObj || p.stock <= 0) && "opacity-40 grayscale pointer-events-none"
                      )}
                    >
                      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        <div className="flex justify-between items-start">
                           <div className={cn(
                             "w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover/item:rotate-12 shadow-sm",
                             isInCart ? "bg-primary text-white" : "bg-slate-50 text-slate-300"
                           )}>
                             <Package className="w-5 h-5" />
                           </div>
                           <div className="text-right">
                              <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest block">Stok</span>
                              <span className="text-sm font-[1000] text-slate-900 leading-none">{p.stock}</span>
                           </div>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="font-[1000] text-xs text-slate-900 leading-tight block truncate uppercase tracking-tighter">{p.name}</span>
                          <div className="flex items-center gap-1.5">
                             <span className="text-[9px] font-black text-primary">
                                {priceObj ? formatCurrency(priceObj.sellingPrice) : 'N/A'}
                             </span>
                          </div>
                        </div>

                        {isInCart && (
                          <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-primary/10 w-fit">
                            <Sparkles className="w-2.5 h-2.5 text-primary fill-primary" />
                            <span className="text-[8px] font-black text-primary uppercase">{isInCart.quantity} Units</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </motion.button>
                  )
                })}
              </div>
            </motion.section>
          )}
          {!selectedCustomerId && (
            <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 gap-6 shadow-inner-soft">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                 <User className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-[1000] text-slate-300 uppercase tracking-[0.4em] italic text-center leading-relaxed">
                 Pilih Agen Terlebih <br /> Dahulu Untuk Melanjutkan
              </p>
            </div>
          )}
        </AnimatePresence>

        {/* Step 3: Cart Matrix */}
        <section className="space-y-8">
          <div className="flex items-end justify-between px-2">
            <div>
              <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">Keranjang</h3>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1.5 italic">3. Daftar Belanja</p>
            </div>
            {cart.length > 0 && (
              <button 
                onClick={() => setCart([])}
                className="text-[8px] font-black text-rose-500 uppercase tracking-widest hover:underline"
              >
                 Kosongkan
              </button>
            )}
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div 
                  key={item.productId} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  layout
                >
                  <Card className="rounded-[3rem] bg-white border border-slate-100 shadow-premium overflow-hidden group">
                    <CardContent className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                         <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all shadow-sm">
                            <Package className="w-6 h-6" />
                         </div>
                         <div className="min-w-0">
                            <p className="font-[1000] text-slate-900 text-lg tracking-tighter truncate uppercase">{item.productName}</p>
                            <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">{formatCurrency(item.price)} / Unit</p>
                         </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-8 bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100/50">
                        <div className="flex items-center gap-4 bg-white rounded-2xl p-1 px-2 shadow-sm border border-slate-100">
                          <button 
                            onClick={() => updateQuantity(index, item.quantity - 1)} 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 active:scale-90 transition-all"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-[1000] text-slate-900 min-w-[32px] text-center text-base">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(index, item.quantity + 1)} 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 active:scale-90 transition-all"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => setCart(cart.filter((_, i) => i !== index))} 
                          className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                        >
                           <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {cart.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 relative group overflow-hidden">
                <div className="relative z-10 space-y-4">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner-soft group-hover:scale-110 transition-transform duration-700">
                      <ShoppingBag className="w-6 h-6 text-slate-200" />
                   </div>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Terminal Keranjang Kosong</p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-[1000] text-slate-50/50 select-none pointer-events-none uppercase tracking-tighter">EMPTY</div>
              </div>
            )}
          </div>
        </section>

        {/* Intelligence Banner */}
        <section className="p-10 rounded-[3.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
           <div className="relative z-10 flex flex-col gap-8">
              <div className="flex justify-between items-start">
                 <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <Database className="w-6 h-6 text-white" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Matrix Ops</p>
                    <p className="text-2xl font-[1000] text-emerald-300 tracking-tighter mt-1 italic leading-none">99.8% ACC</p>
                 </div>
              </div>
              <h3 className="text-2xl font-[1000] tracking-tighter leading-tight">Sinkronisasi <br />Aset Terminal.</h3>
              <p className="text-white/40 text-[9px] font-bold leading-relaxed max-w-[200px] uppercase tracking-widest">
                 Verifikasi ulang data agen sebelum melakukan checkout untuk memastikan akurasi piutang global.
              </p>
           </div>
           <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
           <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <Target className="w-96 h-96 -ml-20 -mt-20 stroke-[0.5]" />
           </div>
        </section>

        {/* Footer Note */}
        <footer className="pt-10 pb-20 text-center opacity-30">
           <p className="text-[8px] font-black text-slate-900 uppercase tracking-[0.5em]">Hayati Enterprise Edition v3.2</p>
        </footer>

      </div>

      {/* Floating Checkout Matrix */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-6 z-[70]">
        <motion.div 
          initial={{ y: 100, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-[#121212] rounded-[3.5rem] shadow-2xl p-8 flex flex-col gap-8 text-white border border-white/10 relative overflow-hidden group"
        >
          <div className="relative z-10 flex items-center justify-between px-2">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Total Nilai Nota</p>
              <h3 className="text-3xl font-[1000] tracking-tighter text-white leading-none">
                 {formatCurrency(total)}
              </h3>
            </div>
            <div className="text-right">
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Item Matrix</p>
               <div className="flex items-center justify-end gap-2">
                  <Package className="w-3.5 h-3.5 text-primary" />
                  <span className="text-lg font-[1000] text-white leading-none">{cart.length}</span>
               </div>
            </div>
          </div>

          <div className="relative z-10 flex gap-3">
             <button 
               onClick={handleSubmit}
               disabled={loading || cart.length === 0 || !selectedCustomerId} 
               className="flex-1 h-18 py-5 rounded-[2rem] bg-white text-black font-[1000] text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-20 shadow-xl"
             >
               {loading ? (
                 <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin" />
               ) : (
                 <><Zap className="w-4 h-4 fill-current" /> Finalize Checkout</>
               )}
             </button>
             <button className="w-18 h-18 rounded-[2rem] bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <CreditCard className="w-6 h-6" />
             </button>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-primary/20 transition-all duration-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[2.5] pointer-events-none">
             <Flame className="w-64 h-64 stroke-[0.5]" />
          </div>
        </motion.div>
      </div>

    </div>
  )
}
