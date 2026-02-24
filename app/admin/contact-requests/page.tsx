'use client'

import { useState, useEffect, useCallback } from 'react'

interface ContactRequest {
  id: number
  name: string
  phone: string
  email: string
  message: string
  created_at: string
}

function fmtDatetime(s: string) {
  if (!s) return '—'
  return new Date(s).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ContactRequestsPage() {
  const [rows, setRows] = useState<ContactRequest[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState<ContactRequest | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/contact-requests?page=${page}`)
    const data = await res.json()
    setRows(data.rows ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleDelete(id: number) {
    if (!confirm('Удалить заявку?')) return
    await fetch(`/api/admin/contact-requests/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Заявки</h1>
        <p className="text-sm text-gray-500 mt-0.5">{total} записей</p>
      </div>

      <div className="bg-white border border-gray-200">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Загрузка...</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">Нет заявок</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Имя</th>
                <th className="px-4 py-3 font-medium text-gray-600">Телефон</th>
                <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 font-medium text-gray-600">Сообщение</th>
                <th className="px-4 py-3 font-medium text-gray-600">Дата</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-gray-500">{row.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{row.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs">
                    <span className="truncate block max-w-[200px]">{row.message || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDatetime(row.created_at)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => setViewing(row)} className="text-xs text-blue-600 hover:underline mr-3">Открыть</button>
                    <button onClick={() => handleDelete(row.id)} className="text-xs text-red-600 hover:underline">Удалить</button>
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

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Заявка #{viewing.id}</h2>
              <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Имя</p>
                  <p className="text-gray-900">{viewing.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Дата</p>
                  <p className="text-gray-900">{fmtDatetime(viewing.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Телефон</p>
                  <p className="text-gray-900">{viewing.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900">{viewing.email || '—'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Сообщение</p>
                <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded p-3">{viewing.message || '—'}</p>
              </div>
            </div>
            <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
              <button onClick={() => setViewing(null)} className="px-4 py-2 text-sm border border-gray-300 hover:border-gray-500 transition-colors">Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
