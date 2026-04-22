'use client'

import { useState, useEffect, useCallback } from 'react'
import { ImageUpload } from '../../../components/admin/ImageUpload'

interface PaintingRow {
  id: number
  title: string
  description: string
  year: number
  size: string
  technique: string
  price: number
  status: string
  image: string
}

const EMPTY: Omit<PaintingRow, 'id'> = {
  title: '', description: '', year: new Date().getFullYear(), size: '', technique: '', price: 0, status: 'available', image: '',
}

export default function PaintingsPage() {
  const [rows, setRows] = useState<PaintingRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<PaintingRow | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/paintings?page=${page}`)
    const data = await res.json()
    setRows(data.rows ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  function openCreate() { setEditing(null); setForm(EMPTY); setModal(true) }

  function openEdit(row: PaintingRow) {
    setEditing(row)
    setForm({ title: row.title, description: row.description ?? '', year: row.year ?? new Date().getFullYear(), size: row.size ?? '', technique: row.technique ?? '', price: row.price ?? 0, status: row.status ?? 'available', image: row.image ?? '' })
    setModal(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить картину?')) return
    await fetch(`/api/admin/paintings/${id}`, { method: 'DELETE' })
    fetchData()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/admin/paintings/${editing.id}` : '/api/admin/paintings'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    setModal(false)
    fetchData()
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Картины</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} записей</p>
        </div>
        <button onClick={openCreate} className="bg-gray-900 text-white text-sm px-4 py-2 hover:bg-gray-700 transition-colors">
          + Добавить
        </button>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Загрузка...</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">Нет записей</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Фото</th>
                <th className="px-4 py-3 font-medium text-gray-600">Название</th>
                <th className="px-4 py-3 font-medium text-gray-600">Год</th>
                <th className="px-4 py-3 font-medium text-gray-600">Техника</th>
                <th className="px-4 py-3 font-medium text-gray-600">Цена</th>
                <th className="px-4 py-3 font-medium text-gray-600">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {row.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={row.image} alt="" className="h-10 w-10 object-cover border border-gray-200" />
                      : <div className="h-10 w-10 bg-gray-100 border border-gray-200" />}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.title}</td>
                  <td className="px-4 py-3 text-gray-500">{row.year}</td>
                  <td className="px-4 py-3 text-gray-500">{row.technique}</td>
                  <td className="px-4 py-3 text-gray-500">{row.price ? `${row.price} ₽` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${row.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {row.status === 'available' ? 'В наличии' : 'Продана'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(row)} className="text-xs text-blue-600 hover:underline mr-3">Ред.</button>
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

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">{editing ? 'Редактировать картину' : 'Новая картина'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Название *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Описание</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Год</label>
                  <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || 2024 }))} min="1900" max="2100" className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Размер</label>
                  <input type="text" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="80 × 60 см" className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Техника</label>
                  <input type="text" value={form.technique} onChange={e => setForm(f => ({ ...f, technique: e.target.value }))} placeholder="масло, холст" className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Цена (₽)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} min="0" step="0.01" className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Статус</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none bg-white">
                  <option value="available">В наличии</option>
                  <option value="sold">Продана</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Изображение</label>
                <ImageUpload value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} table="paintings" />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-gray-300 hover:border-gray-500 transition-colors">Отмена</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors">{saving ? 'Сохранение...' : 'Сохранить'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
