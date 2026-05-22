import { getCustomers } from '@/app/actions/finance'
import { getProducts } from '@/app/actions/products'
import ProductManager from '../product-manager'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PlusSquare } from 'lucide-react'

export default async function ManagePage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/')
  }

  const [customers, products] = await Promise.all([
    getCustomers(),
    getProducts()
  ])

  return (
    <div className="flex flex-col gap-6 p-8">
      <header className="flex justify-between items-end pt-4">
        <div>
          <h1 className="text-3xl font-[800] tracking-tight text-[#1A1A1A]">Tambah</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Input Data Baru</p>
        </div>
        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center">
          <PlusSquare className="h-6 w-6 text-black" />
        </div>
      </header>

      <ProductManager customers={customers} products={products} />
    </div>
  )
}
