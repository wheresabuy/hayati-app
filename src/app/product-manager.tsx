'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addProduct, setCustomerPrice, deleteProduct, setBulkCustomerPrices } from '@/app/actions/products'
import { addCustomer, deleteCustomer } from '@/app/actions/finance'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Search, Save, CheckCircle2, AlertCircle, Plus, UserPlus, Tag, Package, Boxes, Users, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function ProductManager({ customers, products }: { customers: any[], products: any[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'PRODUCT' | 'PRICE' | 'CUSTOMER'>('PRODUCT')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [stock, setStock] = useState('')

  const [selectedCust, setSelectedCust] = useState('')
  const [batchPrices, setBatchPrices] = useState<{ [productId: string]: string }>({})
  const [searchQuery, setSearchQuery] = useState('')

  const [custName, setCustName] = useState('')
  const [custUid, setCustUid] = useState('')

  // Fetch prices when customer changes
  useEffect(() => {
    if (selectedCust) {
      setLoading(true)
      fetch(`/api/customer-prices?customerId=${selectedCust}`)
        .then(res => res.json())
        .then(data => {
          const prices: { [productId: string]: string } = {}
          data.forEach((p: any) => {
            prices[p.productId] = p.sellingPrice.toString()
          })
          setBatchPrices(prices)
        })
        .finally(() => setLoading(false))
    } else {
      setBatchPrices({})
    }
  }, [selectedCust])

  const handleBulkSave = async () => {
    if (!selectedCust) return
    setLoading(true)
    try {
      const updates = Object.entries(batchPrices)
        .filter(([_, val]) => val !== '')
        .map(([productId, val]) => ({
          productId,
          sellingPrice: parseFloat(val)
        }))
      
      await setBulkCustomerPrices(selectedCust, updates)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      router.refresh()
    } catch (e) {
      alert('Gagal simpan harga massal')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addProduct(name, parseFloat(cost), parseInt(stock) || 0)
      setSuccess(true); setName(''); setCost(''); setStock('')
      setTimeout(() => setSuccess(false), 2000)
      router.refresh()
    } catch (e) { alert('Gagal tambah produk') } finally { setLoading(false) }
  }

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addCustomer(custName, custUid)
      setSuccess(true); setCustName(''); setCustUid('')
      setTimeout(() => setSuccess(false), 2000)
      router.refresh()
    } catch (e) { alert('Gagal tambah pelanggan') } finally { setLoading(false) }
  }

  const handleDeleteCust = async (id: string) => {
    if (!confirm('Hapus agen ini? Semua riwayat transaksi & utang akan HILANG PERMANEN!')) return
    try {
      await deleteCustomer(id)
      router.refresh()
    } catch (e) { alert('Gagal hapus') }
  }

  const handleDeleteProd = async (id: string) => {
    if (!confirm('Hapus produk ini? Semua data harga khusus & stok akan HILANG!')) return
    try {
      await deleteProduct(id)
      router.refresh()
    } catch (e) { alert('Gagal hapus') }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 pb-40">
      
      {/* Navigation & Tabs */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
           <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
              <ArrowLeft className="w-5 h-5" />
           </button>
           <h1 className="text-3xl font-[1000] tracking-tighter text-slate-900 leading-none">Management.</h1>
        </div>

        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[1.75rem] overflow-x-auto no-scrollbar">
          {[
            { id: 'PRODUCT', label: 'Barang', icon: Package },
            { id: 'CUSTOMER', label: 'Agen', icon: Users },
            { id: 'PRICE', label: 'Harga', icon: Tag },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={cn(
                "flex items-center gap-2 px-6 py-3.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-none bg-white rounded-[3.5rem] shadow-premium overflow-hidden relative">
        <CardContent className="p-8 sm:p-12 relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'PRODUCT' && (
              <motion.div key="prod" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-10">
                   <h3 className="text-xl font-[1000] text-slate-900 tracking-tight">Data Barang</h3>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Tambah Produk Baru ke Katalog</p>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <Input placeholder="Nama Produk Baru" value={name} onChange={e => setName(e.target.value)} className="h-16 rounded-[1.5rem] bg-slate-50 border-none font-bold text-base focus:ring-4 focus:ring-primary/5" required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Modal (Rp)" value={cost} onChange={e => setCost(e.target.value)} className="h-16 rounded-[1.5rem] bg-slate-50 border-none font-bold text-base focus:ring-4 focus:ring-primary/5" required />
                    <Input type="number" placeholder="Stok Awal" value={stock} onChange={e => setStock(e.target.value)} className="h-16 rounded-[1.5rem] bg-slate-50 border-none font-bold text-base focus:ring-4 focus:ring-primary/5" />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] bg-slate-900 text-white shadow-xl hover:bg-black active:scale-95 transition-all">
                    {loading ? 'Processing...' : success ? 'Berhasil Disimpan' : 'Simpan Produk'}
                  </Button>
                </form>

                <div className="mt-16 space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Daftar Produk</p>
                    <div className="relative w-48 group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Cari..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-[10px] font-bold outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {filteredProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.75rem] group hover:bg-white hover:shadow-soft border border-transparent hover:border-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors shadow-sm">
                              <Package className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="font-[1000] text-slate-700 tracking-tight">{p.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Modal: Rp {p.baseCost.toLocaleString('id-ID')} | Stok: {p.stock}</p>
                           </div>
                        </div>
                        <button onClick={() => handleDeleteProd(p.id)} className="w-10 h-10 rounded-full hover:bg-rose-50 text-slate-200 hover:text-rose-500 transition-all flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'CUSTOMER' && (
              <motion.div key="cust" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-10">
                   <h3 className="text-xl font-[1000] text-slate-900 tracking-tight">Database Agen</h3>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Daftarkan Agen Baru ke Jaringan</p>
                </div>

                <form onSubmit={handleAddCustomer} className="space-y-4">
                  <Input placeholder="Nama Lengkap Agen" value={custName} onChange={e => setCustName(e.target.value)} className="h-16 rounded-[1.5rem] bg-slate-50 border-none font-bold text-base focus:ring-4 focus:ring-primary/5" required />
                  <Input placeholder="Identitas UID (Contoh: AGN-015)" value={custUid} onChange={e => setCustUid(e.target.value)} className="h-16 rounded-[1.5rem] bg-slate-50 border-none font-bold text-base focus:ring-4 focus:ring-primary/5" required />
                  <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] bg-slate-900 text-white shadow-xl hover:bg-black active:scale-95 transition-all">
                    {loading ? 'Processing...' : success ? 'Agen Terdaftar' : 'Tambahkan Agen'}
                  </Button>
                </form>

                <div className="mt-16 space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest px-2">Agen Aktif</p>
                  <div className="grid gap-3">
                    {customers.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.75rem] group hover:bg-white hover:shadow-soft border border-transparent hover:border-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors shadow-sm">
                              <Users className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.uid}</p>
                              <p className="font-[1000] text-slate-700 tracking-tight">{c.name}</p>
                           </div>
                        </div>
                        <button onClick={() => handleDeleteCust(c.id)} className="w-10 h-10 rounded-full hover:bg-rose-50 text-slate-200 hover:text-rose-500 transition-all flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'PRICE' && (
              <motion.div key="price" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-4">
                  <div className="mb-2">
                     <h3 className="text-xl font-[1000] text-slate-900 tracking-tight">Matrix Harga</h3>
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Konfigurasi Harga Jual Per Agen</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] ml-1">1. Pilih Agen</p>
                    <Select onValueChange={(v) => setSelectedCust(v || '')} value={selectedCust}>
                      <SelectTrigger className="h-20 rounded-[1.75rem] bg-slate-50 border-none font-[1000] text-lg shadow-inner-soft focus:ring-4 focus:ring-primary/5">
                        <SelectValue placeholder="Pilih Agen..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-[2rem] border-none shadow-lux p-2">
                        {customers.map(c => <SelectItem key={c.id} value={c.id} className="py-4 rounded-xl font-bold">{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedCust && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] ml-1">2. Atur Harga Jual</p>
                        </div>
                        <div className="relative flex-1 max-w-[200px] group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-primary transition-colors" />
                          <input 
                            type="text" 
                            placeholder="Filter barang..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 max-h-[440px] overflow-y-auto no-scrollbar pr-1 pb-10">
                        {filteredProducts.length > 0 ? filteredProducts.map(p => (
                          <div key={p.id} className="bg-slate-50 rounded-[2rem] p-6 flex items-center justify-between gap-4 group hover:bg-white hover:shadow-soft border border-transparent hover:border-slate-100 transition-all">
                            <div className="flex-1 min-w-0">
                              <p className="font-[1000] text-slate-900 truncate uppercase tracking-tight">{p.name}</p>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Modal: Rp {p.baseCost.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="relative w-40 shrink-0">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">Rp</span>
                              <input 
                                type="number" 
                                value={batchPrices[p.id] || ''} 
                                onChange={(e) => setBatchPrices({ ...batchPrices, [p.id]: e.target.value })}
                                className="w-full pl-11 pr-5 py-4 bg-white border-none rounded-2xl text-sm font-[1000] text-primary text-right focus:ring-4 focus:ring-primary/5 shadow-sm"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-20 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] italic">Barang tidak ditemukan</div>
                        )}
                      </div>

                      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-6 z-50">
                        <Button 
                          onClick={handleBulkSave} 
                          disabled={loading}
                          className="w-full h-20 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] bg-[#121212] text-white shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all border border-white/5"
                        >
                          {loading ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : success ? (
                            <><CheckCircle2 className="w-6 h-6 text-emerald-400" /> Matrix Saved</>
                          ) : (
                            <><Save className="w-5 h-5" /> Update All Prices</>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  {!selectedCust && (
                    <div className="py-32 flex flex-col items-center justify-center text-slate-100 gap-6">
                      <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center">
                         <AlertCircle className="w-10 h-10 text-slate-100" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-center">Pilih Agen Terlebih Dahulu <br /> Untuk Mengatur Matrix</p>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      </Card>
    </div>
  )
}
