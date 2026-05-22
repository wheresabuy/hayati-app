'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProduct } from '@/app/actions/products'
import { Save, ArrowLeft, Package, TrendingUp, History, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(product.name || '')
  const [cost, setCost] = useState(product.baseCost || 0)
  const [stock, setStock] = useState(product.stock || 0)
  const [increase, setIncrease] = useState(0)

  const handleUpdate = async () => {
    if (!name) return alert('Nama produk tidak boleh kosong')
    
    setLoading(true)
    try {
      const res = await updateProduct(product.id, { 
        name, 
        baseCost: Number(cost), 
        stock: Number(stock), 
        priceIncrease: Number(increase) 
      })
      
      if (res) {
        alert('Berhasil! Data produk telah diperbarui.')
        router.refresh()
      }
    } catch (error: any) {
      console.error(error)
      alert('Gagal update: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-8 pb-32">
      <header className="flex items-center gap-4 py-2 sm:py-4">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-100 flex items-center justify-center bg-white shadow-sm active:scale-90 transition-transform shrink-0"
        >
          <ArrowLeft className="h-5 w-5 text-black" />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-[950] tracking-tighter text-slate-900 truncate">Detail Produk</h1>
          <p className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-0.5 truncate">Management Engine v3.0</p>
        </div>
      </header>

      <div className="space-y-4 sm:space-y-6">
        <Card variant="premium" padding="none" className="overflow-hidden">
          <CardContent className="p-5 sm:p-8 space-y-6 sm:space-y-8">
            <Input 
              label="Nama Produk"
              placeholder="Masukkan nama barang..."
              value={name} 
              onChange={e => setName(e.target.value)}
              variant="secondary"
              size="lg"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="Harga Modal"
                type="number" 
                value={cost || ''} 
                onChange={e => setCost(parseFloat(e.target.value) || 0)}
                variant="secondary"
                size="lg"
                icon={<Wallet className="w-5 h-5" />}
              />
              <Input 
                label="Stok Gudang"
                type="number" 
                value={stock || ''} 
                onChange={e => setStock(parseInt(e.target.value) || 0)}
                variant="secondary"
                size="lg"
                icon={<Package className="w-5 h-5" />}
              />
            </div>

            <div className="bg-primary/5 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 space-y-4 border border-primary/10 relative overflow-hidden">
              <div className="flex items-center gap-2 text-primary relative z-10">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Kenaikan Harga Global</span>
              </div>
              <div className="space-y-4 relative z-10">
                <Input 
                  placeholder="Isi jika harga jual naik..." 
                  type="number"
                  value={increase || ''}
                  onChange={e => setIncrease(parseFloat(e.target.value) || 0)}
                  variant="glass"
                  size="lg"
                  className="bg-white/60"
                  icon={<History className="w-5 h-5" />}
                />
                <p className="text-[10px] text-slate-400 leading-relaxed font-bold italic px-2">
                  * Mengupdate harga jual di <span className="text-primary">SELURUH AGEN</span> secara otomatis sebesar nilai di atas.
                </p>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            </div>

            <Button 
              onClick={handleUpdate}
              disabled={loading}
              variant="gold"
              effect="shimmer"
              size="xl"
              className="w-full rounded-[2rem] shadow-2xl"
            >
              {loading ? 'MEMPROSES...' : (
                <span className="flex items-center gap-2">
                  <Save className="h-6 w-6" />
                  SIMPAN PERUBAHAN
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card variant="default" padding="sm" radius="xl" className="bg-white/50 border-dashed">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Perkiraan Aset</p>
            <p className="text-xl font-[950] mt-2 text-slate-900 tracking-tighter">{formatCurrency(cost * stock)}</p>
          </Card>
          <Card variant="default" padding="sm" radius="xl" className="bg-white/50 border-dashed flex flex-col justify-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Status Stok</p>
             <div className="flex items-center gap-2 mt-2">
                <div className={`w-2.5 h-2.5 rounded-full ${stock > 15 ? 'bg-emerald-400' : stock > 5 ? 'bg-amber-400' : 'bg-rose-500 animate-ping'}`} />
                <span className="text-sm font-black text-slate-700">{stock > 15 ? 'AMAN' : stock > 5 ? 'MENIPIS' : 'HABIS'}</span>
             </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
