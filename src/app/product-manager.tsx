'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addProduct, setCustomerPrice, deleteProduct } from '@/app/actions/products'
import { addCustomer, deleteCustomer } from '@/app/actions/finance'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
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
  const [selectedProd, setSelectedProd] = useState('')
  const [price, setPrice] = useState('')

  const [custName, setCustName] = useState('')
  const [custUid, setCustUid] = useState('')

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('PRODUCT')} className={`flex-none px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PRODUCT' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>Produk</button>
        <button onClick={() => setActiveTab('CUSTOMER')} className={`flex-none px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CUSTOMER' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>Tambah Agen</button>
        <button onClick={() => setActiveTab('PRICE')} className={`flex-none px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PRICE' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>Harga Agen</button>
      </div>

      <Card className="border-none bg-white rounded-[2.5rem] shadow-premium">
        <CardContent className="p-8">
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
                  <p className="text-[10px] font-black uppercase text-slate-400 ml-1">Daftar Produk (Klik Sampah untuk Hapus)</p>
                  {products.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="font-bold text-slate-700">{p.name}</span>
                      <button onClick={() => handleDeleteProd(p.id)} className="text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
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
                  <p className="text-[10px] font-black uppercase text-slate-400 ml-1">Daftar Agen (Klik Sampah untuk Hapus)</p>
                  {customers.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="text-[9px] font-black text-slate-400">{c.uid}</p>
                        <p className="font-bold text-slate-700">{c.name}</p>
                      </div>
                      <button onClick={() => handleDeleteCust(c.id)} className="text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'PRICE' && (
              <motion.form key="price" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={async (e) => {
                e.preventDefault()
                setLoading(true)
                try {
                  await setCustomerPrice(selectedCust, selectedProd, parseFloat(price))
                  setSuccess(true); setPrice('')
                  setTimeout(() => setSuccess(false), 2000)
                  router.refresh()
                } catch (e) { alert('Gagal atur harga') } finally { setLoading(false) }
              }} className="space-y-4">
                <Select onValueChange={(v) => setSelectedCust(v || '')} value={selectedCust}>
                  <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold"><SelectValue placeholder="Siapa Agennya?" /></SelectTrigger>
                  <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Select onValueChange={(v) => setSelectedProd(v || '')} value={selectedProd}>
                  <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold"><SelectValue placeholder="Barang yang mana?" /></SelectTrigger>
                  <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" placeholder="Harga Jual Khusus" value={price} onChange={e => setPrice(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" required />
                <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl font-black bg-primary text-white">
                  {loading ? 'PROSES...' : success ? 'BERHASIL!' : 'SIMPAN HARGA KHUSUS'}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
