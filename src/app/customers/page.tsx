import { getCustomers } from '@/app/actions/finance'
import CustomersClient from './customers-client'

export default async function CustomersPage() {
  const customers = await getCustomers()
  return <CustomersClient customers={customers} />
}
