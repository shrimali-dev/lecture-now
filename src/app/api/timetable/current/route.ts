import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { getCurrentLecture } from '@/lib/timetable'

export async function GET() {
  const enrollmentNumber = await getSession()
  if (!enrollmentNumber) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const student = await prisma.student.findUnique({ where: { enrollmentNumber } })
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

  const { current } = await getCurrentLecture(student.batch, new Date())
  
  if (!current) {
    return NextResponse.json({ message: 'No current lecture' }, { status: 404 })
  }

  return NextResponse.json({ current })
}
