'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/ui/card'
import { Boxes, Search, X } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'

export default function InventoryClient({ products }: { products: any[] }) {
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 p-6 pb-32">
      <header className="flex justify-between items-center py-2 px-2">
        <div>
          <h1 className="text-3xl font-[950] text-slate-900 tracking-tighter">Gudang Stok</h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Management v3.2</p>
        </div>
        <div className="w-14 h-14 rounded-[1.75rem] bg-[#121212] flex items-center justify-center text-white shadow-xl shadow-black/10">
          <Boxes className="h-6 w-6" />
        </div>
      </header>

      {/* Real Search Functionality */}
      <div className="px-2">
        <div className="relative group">
          <Input 
            placeholder="Cari nama barang..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="secondary"
            size="lg"
            className="pl-12 bg-white"
            icon={<Search className="w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />}
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <p className="text-[9px] font-bold text-slate-400 mt-3 uppercase tracking-widest ml-1">
          Menampilkan {filteredProducts.length} dari {products.length} produk
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((p) => (
            <motion.div 
              key={p.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Link href={`/inventory/${p.id}`}>
                <ProductCard product={p} />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center space-y-4 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
               <Search className="w-6 h-6 text-slate-200" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Produk tidak ditemukan</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
