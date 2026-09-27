import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'

// CREATE
export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const entry = await prisma.timetableEntry.create({
    data: {
      batch: body.batch,
      subject: body.subject,
      faculty: body.faculty,
      classroom: body.classroom,
      dayOfWeek: body.dayOfWeek,
      startTime: body.startTime,
      endTime: body.endTime,
    }
  })
  return NextResponse.json(entry)
}

// UPDATE
export async function PUT(request: Request) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const entry = await prisma.timetableEntry.update({
    where: { id: body.id },
    data: {
      batch: body.batch,
      subject: body.subject,
      faculty: body.faculty,
      classroom: body.classroom,
      dayOfWeek: body.dayOfWeek,
      startTime: body.startTime,
      endTime: body.endTime,
    }
  })
  return NextResponse.json(entry)
}

// DELETE
export async function DELETE(request: Request) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  await prisma.timetableEntry.delete({ where: { id: body.id } })
  return NextResponse.json({ success: true })
}
