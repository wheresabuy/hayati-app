'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function getProducts() {
  return await prisma.product.findMany({
    include: { customPrices: true },
    orderBy: { name: 'asc' }
  })
}

export async function addProduct(name: string, baseCost: number, initialStock: number = 0) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized')

  const product = await prisma.product.create({
    data: { name, baseCost, stock: initialStock }
  })
  revalidatePath('/inventory')
  revalidatePath('/settings')
  return product
}

export async function setCustomerPrice(customerId: string, productId: string, sellingPrice: number) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized')

  const price = await prisma.customerPrice.upsert({
    where: {
      customerId_productId: { customerId, productId }
    },
    update: { sellingPrice },
    create: { customerId, productId, sellingPrice }
  })
  revalidatePath('/settings')
  return price
}

export async function setBulkCustomerPrices(customerId: string, updates: { productId: string, sellingPrice: number }[]) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized')

  const results = await prisma.$transaction(
    updates.map(u => 
      prisma.customerPrice.upsert({
        where: { customerId_productId: { customerId, productId: u.productId } },
        update: { sellingPrice: u.sellingPrice },
        create: { customerId, productId: u.productId, sellingPrice: u.sellingPrice }
      })
    )
  )
  revalidatePath('/settings')
  revalidatePath('/manage')
  return results
}

export async function updateProduct(id: string, data: { name?: string, baseCost?: number, stock?: number, priceIncrease?: number }) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  // Izinkan STAFF untuk update (terutama stok), tapi mungkin priceIncrease hanya ADMIN?
  // Untuk sekarang kita izinkan keduanya demi kemudahan operasional
  
  const result = await prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id },
      data: {
        name: data.name,
        baseCost: data.baseCost,
        stock: data.stock
      }
    })

    if (data.priceIncrease && data.priceIncrease > 0) {
      const customPrices = await tx.customerPrice.findMany({
        where: { productId: id }
      })

      for (const cp of customPrices) {
        await tx.customerPrice.update({
          where: { id: cp.id },
          data: {
            sellingPrice: {
              increment: data.priceIncrease
            }
          }
        })
      }
    }

    return product
  })

  revalidatePath('/inventory')
  revalidatePath('/settings')
  revalidatePath('/')
  return result
}

export async function deleteProduct(id: string) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized')

  return await prisma.$transaction(async (tx) => {
    await tx.customerPrice.deleteMany({ where: { productId: id } })
    await tx.transactionItem.deleteMany({ where: { productId: id } })
    return await tx.product.delete({ where: { id } })
  })
}

export async function getCustomerPrices(customerId: string) {
  return await prisma.customerPrice.findMany({
    where: { customerId },
    include: { product: true }
  })
}
