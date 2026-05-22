import { getProducts } from '@/app/actions/products'
import InventoryClient from './inventory-client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function InventoryPage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/')
  }

  const products = await getProducts()

  return <InventoryClient products={products} />
}
