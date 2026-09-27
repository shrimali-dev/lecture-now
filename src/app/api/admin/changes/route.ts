import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'

// CREATE
export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const change = await prisma.timetableChange.create({
    data: {
      batch: body.batch,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      subject: body.subject,
      faculty: body.faculty,
      classroom: body.classroom,
      isCancelled: body.isCancelled || false,
    }
  })
  return NextResponse.json(change)
}

// UPDATE
export async function PUT(request: Request) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const change = await prisma.timetableChange.update({
    where: { id: body.id },
    data: {
      batch: body.batch,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      subject: body.subject,
      faculty: body.faculty,
      classroom: body.classroom,
      isCancelled: body.isCancelled || false,
    }
  })
  return NextResponse.json(change)
}

// DELETE
export async function DELETE(request: Request) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  await prisma.timetableChange.delete({ where: { id: body.id } })
  return NextResponse.json({ success: true })
}
