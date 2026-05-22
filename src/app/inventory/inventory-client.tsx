'use client'

import { ProductCard } from '@/components/ui/card'
import { Boxes } from 'lucide-react'
import Link from 'next/link'

export default function InventoryClient({ products }: { products: any[] }) {
  return (
    <div className="flex flex-col gap-6 p-6 pb-32">
      <header className="flex justify-between items-center py-2 px-2">
        <div>
          <h1 className="text-3xl font-[950] text-slate-900 tracking-tighter">Gudang Stok</h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Management v3.0</p>
        </div>
        <div className="w-14 h-14 rounded-[1.75rem] bg-[#121212] flex items-center justify-center text-white shadow-xl shadow-black/10">
          <Boxes className="h-6 w-6" />
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <Link key={p.id} href={`/inventory/${p.id}`}>
            <ProductCard product={p} />
          </Link>
        ))}
      </div>
    </div>
  )
}
