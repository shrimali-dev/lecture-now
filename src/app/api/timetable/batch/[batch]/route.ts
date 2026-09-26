import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { batch: string } }) {
  const batch = params.batch

  const entries = await prisma.timetableEntry.findMany({
    where: { batch: { in: [batch, 'ALL'] } },
    orderBy: [
      { dayOfWeek: 'asc' },
      { startTime: 'asc' }
    ]
  })

  return NextResponse.json({ entries })
}
