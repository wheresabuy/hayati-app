import { getProducts } from '@/app/actions/products'
import ProductDetailClient from './detail-client'
import { notFound } from 'next/navigation'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const products = await getProducts()
  const product = products.find(p => p.id === id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
