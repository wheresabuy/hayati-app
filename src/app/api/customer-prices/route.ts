import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')

  if (!customerId) {
    return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
  }

  const prices = await prisma.customerPrice.findMany({
    where: { customerId },
  })

  return NextResponse.json(prices)
}
