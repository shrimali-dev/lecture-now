import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const entries = await prisma.timetableEntry.findMany({
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
  })
  const changes = await prisma.timetableChange.findMany({
    orderBy: { id: 'desc' }
  })
  const students = await prisma.student.findMany({
    orderBy: { enrollmentNumber: 'asc' }
  })

  return NextResponse.json({ entries, changes, students })
}
