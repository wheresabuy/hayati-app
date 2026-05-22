'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

/**
 * Mendapatkan ringkasan statistik untuk Dashboard
 */
export async function getDashboardStats() {
  const transactions = await prisma.transaction.aggregate({
    _sum: {
      totalReceivable: true,
      totalCogs: true,
    },
  })

  const payments = await prisma.paymentHistory.aggregate({
    _sum: {
      amount: true,
    },
  })

  const totalOmset = transactions._sum.totalReceivable || 0
  const totalCogs = transactions._sum.totalCogs || 0
  const totalKasDiterima = payments._sum.amount || 0
  
  // Keuntungan Bersih = Kas Nyata - Total Modal
  const totalKeuntunganBersih = totalKasDiterima - totalCogs
  const totalPiutang = totalOmset - totalKasDiterima

  return {
    totalOmset,
    totalKasDiterima,
    totalPiutang,
    totalKeuntunganBersih,
  }
}

/**
 * Mendapatkan daftar pelanggan beserta ringkasan saldo mereka
 */
export async function getCustomers() {
  const customers = await prisma.customer.findMany({
    include: {
      transactions: true,
      payments: true,
    },
    orderBy: { uid: 'asc' },
  })

  return customers.map((c) => {
    const totalNota = c.transactions.reduce((acc, t) => acc + t.totalReceivable, 0)
    const totalModal = c.transactions.reduce((acc, t) => acc + t.totalCogs, 0)
    const totalBayar = c.payments.reduce((acc, p) => acc + p.amount, 0)

    return {
      ...c,
      totalNota,
      totalModal,
      totalBayar,
      sisaPiutang: totalNota - totalBayar,
      keuntungan: totalBayar - totalModal,
    }
  })
}

/**
 * Mendapatkan data satu pelanggan secara detail
 */
export async function getCustomerDetail(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      transactions: {
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
      customPrices: {
        include: { product: true },
      },
    },
  })

  if (!customer) return null

  const totalNota = customer.transactions.reduce((acc, t) => acc + t.totalReceivable, 0)
  const totalModal = customer.transactions.reduce((acc, t) => acc + t.totalCogs, 0)
  const totalBayar = customer.payments.reduce((acc, p) => acc + p.amount, 0)

  return {
    ...customer,
    totalNota,
    totalModal,
    totalBayar,
    sisaPiutang: totalNota - totalBayar,
    keuntungan: totalBayar - totalModal,
  }
}

/**
 * Menambah Pelanggan Baru (Hanya Admin)
 */
export async function addCustomer(name: string, uid: string) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized')

  return await prisma.$transaction(async (tx) => {
    // 1. Buat Customer
    const customer = await tx.customer.create({
      data: { name, uid }
    })

    // 2. Ambil semua produk yang ada
    const products = await tx.product.findMany()

    // 3. Beri harga standar (baseCost) untuk tiap produk ke customer baru ini
    for (const p of products) {
      await tx.customerPrice.create({
        data: {
          customerId: customer.id,
          productId: p.id,
          sellingPrice: p.baseCost + 2000
        }
      })
    }

    return customer
  })
}

/**
 * Menghapus Pelanggan (Hanya Admin)
 */
export async function deleteCustomer(id: string) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized')

  return await prisma.$transaction(async (tx) => {
    await tx.customerPrice.deleteMany({ where: { customerId: id } })
    await tx.paymentHistory.deleteMany({ where: { customerId: id } })
    await tx.transactionItem.deleteMany({ where: { transaction: { customerId: id } } })
    await tx.transaction.deleteMany({ where: { customerId: id } })
    return await tx.customer.delete({ where: { id } })
  })
}

/**
 * Menghapus Satu Transaksi (Hanya Admin)
 * Dan mengembalikan stok barang
 */
export async function deleteTransaction(id: string) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized')

  return await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({
      where: { id },
      include: { items: true }
    })

    if (transaction) {
      for (const item of transaction.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        })
      }
    }

    await tx.transactionItem.deleteMany({ where: { transactionId: id } })
    return await tx.transaction.delete({ where: { id } })
  })
}

/**
 * Menghapus Cicilan/Pembayaran (Hanya Admin)
 */
export async function deletePayment(id: string) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') throw new Error('Unauthorized')

  const payment = await prisma.paymentHistory.delete({
    where: { id }
  })

  revalidatePath('/customers')
  revalidatePath('/')
  return payment
}

/**
 * Mencatat transaksi baru (Keranjang Belanja)
 */
export async function createTransaction(
  customerId: string,
  items: { productId: string; quantity: number }[]
) {
  // 1. Ambil harga khusus customer ini
  const customPrices = await prisma.customerPrice.findMany({
    where: { customerId },
  })

  // 2. Ambil data produk untuk modal
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  })

  let totalReceivable = 0
  let totalCogs = 0

  const transactionItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!
    const customPrice = customPrices.find((cp) => cp.productId === item.productId)
    
    // Jika tidak ada harga khusus, gunakan base cost (ini pengaman saja)
    const pricePerUnit = customPrice?.sellingPrice || product.baseCost
    const costPerUnit = product.baseCost

    totalReceivable += pricePerUnit * item.quantity
    totalCogs += costPerUnit * item.quantity

    return {
      productId: item.productId,
      quantity: item.quantity,
      pricePerUnit,
      costPerUnit,
    }
  })

  const transaction = await prisma.$transaction(async (tx) => {
    // 1. Kurangi stok barang
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    // 2. Buat nota transaksi
    return await tx.transaction.create({
      data: {
        customerId,
        totalReceivable,
        totalCogs,
        items: {
          create: transactionItems,
        },
      },
    })
  })

  revalidatePath('/customers')
  revalidatePath('/')
  return transaction
}

/**
 * Mencatat pembayaran cicilan
 */
export async function addPayment(customerId: string, amount: number, method: string = 'CASH') {
  const payment = await prisma.paymentHistory.create({
    data: {
      customerId,
      amount,
      paymentMethod: method,
    },
  })

  revalidatePath('/customers')
  revalidatePath('/')
  return payment
}
