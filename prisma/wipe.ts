import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = `${process.env.DATABASE_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Memulai proses pembersihan data dari Cloud Database...')

  try {
    // Menghapus data dalam urutan yang benar
    
    console.log('🗑️ Menghapus Riwayat Pembayaran...')
    await prisma.paymentHistory.deleteMany({})

    console.log('🗑️ Menghapus Item Transaksi...')
    await prisma.transactionItem.deleteMany({})

    console.log('🗑️ Menghapus Transaksi/Nota...')
    await prisma.transaction.deleteMany({})

    console.log('🗑️ Menghapus Harga Khusus Agen...')
    await prisma.customerPrice.deleteMany({})

    console.log('🗑️ Menghapus Data Agen...')
    await prisma.customer.deleteMany({})

    console.log('🗑️ Menghapus Data Produk/Barang...')
    await prisma.product.deleteMany({})

    console.log('✅ BERHASIL! Database sekarang bersih.')
    
  } catch (error) {
    console.error('❌ Terjadi kesalahan:', error)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main()
