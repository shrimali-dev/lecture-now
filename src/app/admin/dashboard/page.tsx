import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'
import AdminDashboardUI from '@/components/AdminDashboardUI'

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) redirect('/admin')

  const entries = await prisma.timetableEntry.findMany({
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
  })

  const changes = await prisma.timetableChange.findMany({
    orderBy: { id: 'desc' }
  })

  const students = await prisma.student.findMany({
    orderBy: { enrollmentNumber: 'asc' }
  })

  return (
    <AdminDashboardUI
      entries={entries}
      changes={changes}
      students={students}
    />
  )
}
