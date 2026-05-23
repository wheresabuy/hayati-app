'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addProduct, setCustomerPrice, deleteProduct, setBulkCustomerPrices } from '@/app/actions/products'
import { addCustomer, deleteCustomer } from '@/app/actions/finance'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Search, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
    <div className="flex flex-col gap-4 pb-20">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('PRODUCT')} className={`flex-none px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PRODUCT' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>Produk</button>
        <button onClick={() => setActiveTab('CUSTOMER')} className={`flex-none px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CUSTOMER' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>Tambah Agen</button>
        <button onClick={() => setActiveTab('PRICE')} className={`flex-none px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PRICE' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>Harga Agen</button>
      </div>

      <Card className="border-none bg-white rounded-[2.5rem] shadow-premium">
        <CardContent className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'PRODUCT' && (
              <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <Input placeholder="Nama Produk Baru" value={name} onChange={e => setName(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" required />
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="number" placeholder="Modal" value={cost} onChange={e => setCost(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" required />
                    <Input type="number" placeholder="Stok" value={stock} onChange={e => setStock(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl font-black bg-slate-900 text-white">
                    {loading ? 'PROSES...' : success ? 'BERHASIL!' : 'SIMPAN PRODUK'}
                  </Button>
                </form>
                <div className="mt-8 space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 ml-1">Daftar Produk</p>
                    <div className="relative w-40">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
                      <input 
                        type="text" 
                        placeholder="Cari..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border-none rounded-lg text-[10px] font-bold focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  {filteredProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group transition-all hover:bg-slate-100">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{p.name}</span>
                        <span className="text-[9px] font-bold text-slate-400">Modal: Rp {p.baseCost.toLocaleString('id-ID')} | Stok: {p.stock}</span>
                      </div>
                      <button onClick={() => handleDeleteProd(p.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'CUSTOMER' && (
              <motion.div key="cust" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <form onSubmit={handleAddCustomer} className="space-y-4">
                  <Input placeholder="Nama Agen Baru" value={custName} onChange={e => setCustName(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" required />
                  <Input placeholder="UID (Contoh: USR-015)" value={custUid} onChange={e => setCustUid(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" required />
                  <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl font-black bg-slate-900 text-white">
                    {loading ? 'PROSES...' : success ? 'BERHASIL!' : 'TAMBAH AGEN'}
                  </Button>
                </form>
                <div className="mt-8 space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 ml-1">Daftar Agen</p>
                  {customers.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-all">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{c.uid}</p>
                        <p className="font-bold text-slate-700">{c.name}</p>
                      </div>
                      <button onClick={() => handleDeleteCust(c.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'PRICE' && (
              <motion.div key="price" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] ml-1">1. Pilih Agen</p>
                  <Select onValueChange={(v) => setSelectedCust(v || '')} value={selectedCust}>
                    <SelectTrigger className="h-16 rounded-[1.5rem] bg-slate-50 border-none font-black text-lg shadow-inner-soft">
                      <SelectValue placeholder="Pilih Agen..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-3xl border-none shadow-lux">
                      {customers.map(c => <SelectItem key={c.id} value={c.id} className="py-4 font-bold">{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <AnimatePresence>
                  {selectedCust && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] ml-1">2. Atur Harga Jual</p>
                        <div className="relative flex-1 max-w-[200px]">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
                          <input 
                            type="text" 
                            placeholder="Cari barang..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-1 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1 pb-4">
                        {filteredProducts.length > 0 ? filteredProducts.map(p => (
                          <div key={p.id} className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between gap-4 group hover:bg-slate-100 transition-all">
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 truncate">{p.name}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Modal: Rp {p.baseCost.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="relative w-32 shrink-0">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">Rp</span>
                              <input 
                                type="number" 
                                value={batchPrices[p.id] || ''} 
                                onChange={(e) => setBatchPrices({ ...batchPrices, [p.id]: e.target.value })}
                                className="w-full pl-8 pr-3 py-2.5 bg-white border-none rounded-xl text-sm font-black text-primary text-right focus:ring-2 focus:ring-primary/10 shadow-sm"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-10 text-slate-300 font-bold text-[10px] uppercase tracking-widest italic">Barang tidak ditemukan</div>
                        )}
                      </div>

                      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 z-40">
                        <Button 
                          onClick={handleBulkSave} 
                          disabled={loading}
                          className="w-full h-16 rounded-[2rem] font-black text-base bg-[#121212] text-white shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : success ? (
                            <><CheckCircle2 className="w-6 h-6 text-emerald-400" /> HARGA TERSIMPAN!</>
                          ) : (
                            <><Save className="w-5 h-5" /> SIMPAN SEMUA HARGA</>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  {!selectedCust && (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-200 gap-4">
                      <AlertCircle className="w-12 h-12 stroke-[1.5]" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Pilih Agen Terlebih Dahulu</p>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

