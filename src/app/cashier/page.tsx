import { getCustomers } from '@/app/actions/finance'
import { getProducts } from '@/app/actions/products'
import CashierForm from './cashier-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default async function CashierPage() {
  const [customers, products] = await Promise.all([
    getCustomers(),
    getProducts()
  ])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/customers"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Kasir (Buat Nota)</h1>
      </div>

      <CashierForm customers={customers} products={products} />
    </div>
  )
}
