'use client'

import { useState, useEffect, useCallback } from 'react'

interface EventBooking {
  id: number
  name: string
  phone: string
  email: string
  status: string
  created_at: string
  event_title: string
  event_date: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждена',
  cancelled: 'Отменена',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-500',
}

function fmtDate(s: string) {
  if (!s) return '—'
  return new Date(s).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function EventBookingsPage() {
  const [rows, setRows] = useState<EventBooking[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/event-bookings?page=${page}`)
    const data = await res.json()
    setRows(data.rows ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id)
    await fetch(`/api/admin/event-bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await fetchData()
    setUpdatingId(null)
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить заявку?')) return
    await fetch(`/api/admin/event-bookings/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Записи на события</h1>
        <p className="text-sm text-gray-500 mt-0.5">{total} записей</p>
      </div>

      <div className="bg-white border border-gray-200">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Загрузка...</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">Нет записей</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Имя</th>
                <th className="px-4 py-3 font-medium text-gray-600">Телефон</th>
                <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 font-medium text-gray-600">Мероприятие</th>
                <th className="px-4 py-3 font-medium text-gray-600">Дата события</th>
                <th className="px-4 py-3 font-medium text-gray-600">Заявка</th>
                <th className="px-4 py-3 font-medium text-gray-600">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    <a href={`tel:${row.phone}`} className="hover:underline">{row.phone || '—'}</a>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{row.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[180px]">
                    <span className="block truncate">{row.event_title}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(row.event_date)}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">{fmtDate(row.created_at)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status}
                      disabled={updatingId === row.id}
                      onChange={(e) => updateStatus(row.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[row.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 mt-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-sm border border-gray-300 hover:border-gray-500 disabled:opacity-40">←</button>
          <span className="px-3 py-1 text-sm text-gray-600">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-sm border border-gray-300 hover:border-gray-500 disabled:opacity-40">→</button>
        </div>
      )}
    </div>
  )
}
