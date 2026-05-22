import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🧹 Membersihkan database...')

  // Urutan hapus (yang punya relasi dihapus dulu)
  await prisma.transactionItem.deleteMany({})
  await prisma.transaction.deleteMany({})
  await prisma.paymentHistory.deleteMany({})
  await prisma.customerPrice.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.customer.deleteMany({})

  console.log('✅ Database bersih. Memasukkan data awal...')

  // 1. Produk Awal (Stok 0)
  const productsData = [
    { name: 'MP Merah', baseCost: 64350 },
    { name: 'MP Belang', baseCost: 64350 },
    { name: 'MP Putih', baseCost: 64350 },
  ]

  const products = []
  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        baseCost: p.baseCost,
        stock: 0,
      },
    })
    products.push(product)
  }

  // 2. Data Pelanggan Tetap & Harga Khusus
  const customersData = [
    { name: 'Bp Nana', price: 67500 },
    { name: 'Bp Seno UD mulya Jaya', price: 69500 },
    { name: 'Tk Kartika Putri', price: 68500 },
    { name: 'Bp Hartoyo', price: 67500 },
    { name: 'Tk Sahlan', price: 69500 },
    { name: 'Mama amel', price: 69500 },
    { name: 'Bu Zulfan', price: 69500 },
    { name: 'Simpang frozen', price: 69500 },
    { name: 'Bp Slamet', price: 66800 },
    { name: 'Tk H Ujang', price: 68500 },
    { name: 'Tk Mubarok', price: 68500 },
    { name: 'RTM Plastik', price: 69500 },
    { name: 'Tk Wijaya Telor 1', price: 68500 },
    { name: 'Tk Wijaya Telor 2', price: 68500 },
  ]

  const getUid = (index: number) => `USR-${(index + 1).toString().padStart(3, '0')}`

  for (let i = 0; i < customersData.length; i++) {
    const c = customersData[i]
    const customer = await prisma.customer.create({
      data: {
        uid: getUid(i),
        name: c.name,
      },
    })

    // Masukkan harga khusus tiap barang
    for (const product of products) {
      await prisma.customerPrice.create({
        data: {
          customerId: customer.id,
          productId: product.id,
          sellingPrice: c.price,
        },
      })
    }
  }

  console.log('🚀 DATABASE BERHASIL DIRESET! Sekarang bersih dan siap dipakai.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
