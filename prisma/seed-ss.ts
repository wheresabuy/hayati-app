import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Menambah Produk SS & Update Harga Khusus...')

  // 1. Tambah Produk Baru SS
  const ssProductsData = [
    { name: 'SS Merah', baseCost: 90000 },
    { name: 'SS Putih', baseCost: 90000 },
  ]

  const ssProducts = []
  for (const p of ssProductsData) {
    const product = await prisma.product.upsert({
      where: { name: p.name },
      update: { baseCost: p.baseCost },
      create: { name: p.name, baseCost: p.baseCost, stock: 0 }
    })
    ssProducts.push(product)
  }

  // 2. Data Harga Jual Khusus (Berdasarkan Request)
  const ssPrices = [
    { name: 'Bp Slamet SPI', price: 93000 },
    { name: 'Tk Wijaya Telor 2', price: 92500 },
    { name: 'RTM Plastik', price: 96000 },
    { name: 'Tk Kartika Putri', price: 93000 },
    { name: 'Bp Hartoyo', price: 92000 },
    { name: 'Tk wijaya telor 1', price: 93000 },
    { name: 'Bp Nana', price: 96000 },
    { name: 'Batak', price: 95000 },
  ]

  for (const entry of ssPrices) {
    // Cari atau buat customer jika belum ada
    let customer = await prisma.customer.findFirst({
      where: { name: { contains: entry.name, mode: 'insensitive' } }
    })

    if (!customer) {
      const count = await prisma.customer.count()
      customer = await prisma.customer.create({
        data: {
          name: entry.name,
          uid: `USR-${(count + 1).toString().padStart(3, '0')}`
        }
      })
    }

    // Set harga khusus untuk produk SS Merah & SS Putih
    for (const prod of ssProducts) {
      await prisma.customerPrice.upsert({
        where: {
          customerId_productId: {
            customerId: customer.id,
            productId: prod.id
          }
        },
        update: { sellingPrice: entry.price },
        create: {
          customerId: customer.id,
          productId: prod.id,
          sellingPrice: entry.price
        }
      })
    }
  }

  console.log('✅ Produk SS & Harga Khusus Berhasil Ditambahkan!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
