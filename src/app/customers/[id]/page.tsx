import { getCustomerDetail } from '@/app/actions/finance'
import { auth } from '@/auth'
import CustomerDetailClient from './detail-client'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: customerId } = await params
  const customer = await getCustomerDetail(customerId)
  const session = await auth()
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  if (!customer) return <div className="p-10 text-center font-bold">Pelanggan tidak ditemukan</div>

  return <CustomerDetailClient customer={customer} isAdmin={isAdmin} />
}
