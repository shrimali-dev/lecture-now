'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const BATCHES = ['ALL', 'CP1', 'CP2', 'CP3']

type Entry = {
  id: number
  batch: string
  subject: string
  faculty: string | null
  classroom: string | null
  dayOfWeek: number
  startTime: string
  endTime: string
}

type Change = {
  id: number
  batch: string
  date: string
  startTime: string
  endTime: string
  subject: string | null
  faculty: string | null
  classroom: string | null
  isCancelled: boolean
}

type Student = {
  id: number
  enrollmentNumber: string
  name: string
  branch: string
  semester: number
  batch: string
}

type Tab = 'timetable' | 'changes' | 'students'

export default function AdminDashboardUI({
  entries: initialEntries,
  changes: initialChanges,
  students: initialStudents,
}: {
  entries: Entry[]
  changes: Change[]
  students: Student[]
}) {
  const [tab, setTab] = useState<Tab>('timetable')
  const [entries, setEntries] = useState(initialEntries)
  const [changes, setChanges] = useState(initialChanges)
  const [students, setStudents] = useState(initialStudents)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const [editingChange, setEditingChange] = useState<Change | null>(null)
  const [filterDay, setFilterDay] = useState(0) // 0 = all
  const [filterBatch, setFilterBatch] = useState('ALL')

  function showMessage(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  async function refreshData() {
    const res = await fetch('/api/admin/data')
    if (res.ok) {
      const data = await res.json()
      setEntries(data.entries)
      setChanges(data.changes)
      setStudents(data.students)
    }
  }

  // ─── TIMETABLE ENTRY CRUD ───
  async function handleSaveEntry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const body = {
      id: editingEntry?.id,
      batch: fd.get('batch') as string,
      subject: fd.get('subject') as string,
      faculty: (fd.get('faculty') as string) || null,
      classroom: (fd.get('classroom') as string) || null,
      dayOfWeek: parseInt(fd.get('dayOfWeek') as string),
      startTime: fd.get('startTime') as string,
      endTime: fd.get('endTime') as string,
    }

    const res = await fetch('/api/admin/entries', {
      method: editingEntry ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      showMessage(editingEntry ? '✅ Lecture updated!' : '✅ Lecture added!')
      setEditingEntry(null)
      await refreshData()
      ;(e.target as HTMLFormElement).reset()
    } else {
      showMessage('❌ Error saving entry')
    }
    setLoading(false)
  }

  async function handleDeleteEntry(id: number) {
    if (!confirm('Delete this timetable entry permanently?')) return
    setLoading(true)
    const res = await fetch('/api/admin/entries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      showMessage('🗑️ Entry deleted')
      await refreshData()
    }
    setLoading(false)
  }

  // ─── TIMETABLE CHANGE CRUD ───
  async function handleSaveChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const body = {
      id: editingChange?.id,
      batch: fd.get('batch') as string,
      date: fd.get('date') as string,
      startTime: fd.get('startTime') as string,
      endTime: fd.get('endTime') as string,
      subject: (fd.get('subject') as string) || null,
      faculty: (fd.get('faculty') as string) || null,
      classroom: (fd.get('classroom') as string) || null,
      isCancelled: fd.get('isCancelled') === 'on',
    }

    const res = await fetch('/api/admin/changes', {
      method: editingChange ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      showMessage(editingChange ? '✅ Change updated!' : '✅ Change posted!')
      setEditingChange(null)
      await refreshData()
      ;(e.target as HTMLFormElement).reset()
    } else {
      showMessage('❌ Error saving change')
    }
    setLoading(false)
  }

  async function handleDeleteChange(id: number) {
    if (!confirm('Delete this change?')) return
    setLoading(true)
    const res = await fetch('/api/admin/changes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      showMessage('🗑️ Change deleted')
      await refreshData()
    }
    setLoading(false)
  }

  // ─── FILTERED ENTRIES ───
  const filteredEntries = entries.filter(e => {
    if (filterDay !== 0 && e.dayOfWeek !== filterDay) return false
    if (filterBatch !== 'ALL' && e.batch !== filterBatch && e.batch !== 'ALL') return false
    return true
  })

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'timetable', label: 'Timetable', icon: '📅' },
    { key: 'changes', label: 'Changes', icon: '🔄' },
    { key: 'students', label: 'Students', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 border border-teal-100 text-teal-600 rounded-xl flex items-center justify-center font-bold text-lg">
              ⚙️
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
              <p className="text-xs text-slate-500">LectureNow Management</p>
            </div>
          </div>
          <a
            href="/admin/logout"
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Logout →
          </a>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-medium"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.key
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════ TIMETABLE TAB ═══════════════ */}
        {tab === 'timetable' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Add/Edit Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                {editingEntry ? '✏️ Edit Lecture' : '➕ Add New Lecture'}
              </h2>
              <form onSubmit={handleSaveEntry} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Batch</label>
                  <select name="batch" defaultValue={editingEntry?.batch || 'CP1'} className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" required>
                    {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Day</label>
                  <select name="dayOfWeek" defaultValue={editingEntry?.dayOfWeek || 1} className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" required>
                    {[1,2,3,4,5,6].map(d => <option key={d} value={d}>{DAYS[d]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Start Time</label>
                  <input type="time" name="startTime" defaultValue={editingEntry?.startTime || ''} className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">End Time</label>
                  <input type="time" name="endTime" defaultValue={editingEntry?.endTime || ''} className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Subject</label>
                  <input type="text" name="subject" defaultValue={editingEntry?.subject || ''} placeholder="e.g. DBMS" className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Faculty</label>
                  <input type="text" name="faculty" defaultValue={editingEntry?.faculty || ''} placeholder="e.g. Prof. Shah" className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Classroom</label>
                  <input type="text" name="classroom" defaultValue={editingEntry?.classroom || ''} placeholder="e.g. 301" className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" />
                </div>
                <div className="flex items-end gap-2">
                  <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50">
                    {editingEntry ? 'Update' : 'Add'}
                  </button>
                  {editingEntry && (
                    <button type="button" onClick={() => setEditingEntry(null)} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-4">
              <select value={filterDay} onChange={e => setFilterDay(parseInt(e.target.value))} className="border-2 border-slate-200 px-3 py-2 rounded-xl text-sm font-medium text-slate-700">
                <option value={0}>All Days</option>
                {[1,2,3,4,5,6].map(d => <option key={d} value={d}>{DAYS[d]}</option>)}
              </select>
              <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="border-2 border-slate-200 px-3 py-2 rounded-xl text-sm font-medium text-slate-700">
                {BATCHES.map(b => <option key={b} value={b}>{b === 'ALL' ? 'All Batches' : b}</option>)}
              </select>
              <span className="self-center text-sm text-slate-500 font-medium">
                {filteredEntries.length} entries
              </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Day</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Time</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Subject</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Faculty</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Room</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Batch</th>
                    <th className="text-right px-4 py-3 font-bold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map(entry => (
                    <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700">{DAYS[entry.dayOfWeek]}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.startTime} – {entry.endTime}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{entry.subject}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.faculty || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.classroom || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2 py-1 rounded-lg">{entry.batch}</span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => setEditingEntry(entry)} className="text-teal-600 hover:text-teal-800 text-xs font-bold">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ CHANGES TAB ═══════════════ */}
        {tab === 'changes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                {editingChange ? '✏️ Edit Change' : '🔄 Post a Change'}
              </h2>
              <p className="text-sm text-slate-500 mb-4">Cancel a lecture, shift time/location, or exchange subjects for a specific date</p>
              <form onSubmit={handleSaveChange} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Batch</label>
                  <select name="batch" defaultValue={editingChange?.batch || 'ALL'} className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" required>
                    {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
                  <input type="date" name="date" defaultValue={editingChange?.date || ''} className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Start Time</label>
                  <input type="time" name="startTime" defaultValue={editingChange?.startTime || ''} className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">End Time</label>
                  <input type="time" name="endTime" defaultValue={editingChange?.endTime || ''} className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">New Subject (optional)</label>
                  <input type="text" name="subject" defaultValue={editingChange?.subject || ''} placeholder="Leave blank to keep original" className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">New Faculty (optional)</label>
                  <input type="text" name="faculty" defaultValue={editingChange?.faculty || ''} placeholder="Leave blank to keep original" className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">New Room (optional)</label>
                  <input type="text" name="classroom" defaultValue={editingChange?.classroom || ''} placeholder="Leave blank to keep original" className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-sm font-medium text-slate-800 focus:border-teal-500 outline-none" />
                </div>
                <div className="flex items-end gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isCancelled" defaultChecked={editingChange?.isCancelled || false} className="w-4 h-4 rounded accent-red-500" />
                    <span className="text-sm font-bold text-red-600">Cancel Lecture</span>
                  </label>
                </div>
                <div className="col-span-2 md:col-span-4 flex gap-2">
                  <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50">
                    {editingChange ? 'Update Change' : 'Post Change'}
                  </button>
                  {editingChange && (
                    <button type="button" onClick={() => setEditingChange(null)} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Recent Changes */}
            <h3 className="text-lg font-bold text-slate-800 mb-3">Recent Changes</h3>
            <div className="space-y-3">
              {changes.length === 0 && <p className="text-slate-500 text-sm">No changes posted yet.</p>}
              {changes.map(c => (
                <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-lg">{c.batch}</span>
                      <span className="text-sm font-bold text-slate-800">{c.date}</span>
                      <span className="text-sm text-slate-500">{c.startTime} – {c.endTime}</span>
                    </div>
                    {c.isCancelled ? (
                      <span className="text-red-600 font-bold text-sm">🚫 LECTURE CANCELLED</span>
                    ) : (
                      <div className="text-sm text-slate-600">
                        {c.subject && <span className="mr-3">Subject → <b>{c.subject}</b></span>}
                        {c.faculty && <span className="mr-3">Faculty → <b>{c.faculty}</b></span>}
                        {c.classroom && <span>Room → <b>{c.classroom}</b></span>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingChange(c)} className="text-teal-600 hover:text-teal-800 text-xs font-bold">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteChange(c.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════════ STUDENTS TAB ═══════════════ */}
        {tab === 'students' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">👥 Enrolled Students</h2>
                <span className="text-sm text-slate-500 font-medium">{students.length} total</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Enrollment No.</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Name</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Branch</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Sem</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-600">Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-slate-800">{s.enrollmentNumber}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{s.name}</td>
                      <td className="px-4 py-3 text-slate-600">{s.branch}</td>
                      <td className="px-4 py-3 text-slate-600">{s.semester}</td>
                      <td className="px-4 py-3">
                        <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2 py-1 rounded-lg">{s.batch}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer padding */}
      <div className="h-20" />
    </div>
  )
}
