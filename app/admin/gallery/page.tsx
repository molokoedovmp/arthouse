'use client'

import { useState, useEffect, useCallback } from 'react'
import { ImageUpload } from '../../../components/admin/ImageUpload'

interface GalleryRow {
  id: number
  image: string
  category: string
  description: string
}

const EMPTY: Omit<GalleryRow, 'id'> = { image: '', category: '', description: '' }

export default function GalleryPage() {
  const [rows, setRows] = useState<GalleryRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<GalleryRow | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/gallery?page=${page}`)
    const data = await res.json()
    setRows(data.rows ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  function openCreate() { setEditing(null); setForm(EMPTY); setModal(true) }

  function openEdit(row: GalleryRow) {
    setEditing(row)
    setForm({ image: row.image ?? '', category: row.category ?? '', description: row.description ?? '' })
    setModal(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить фото?')) return
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
    fetchData()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/admin/gallery/${editing.id}` : '/api/admin/gallery'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    setModal(false)
    fetchData()
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Галерея</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} записей</p>
        </div>
        <button onClick={openCreate} className="bg-gray-900 text-white text-sm px-4 py-2 hover:bg-gray-700 transition-colors">
          + Добавить
        </button>
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
                <th className="px-4 py-3 font-medium text-gray-600">Фото</th>
                <th className="px-4 py-3 font-medium text-gray-600">Категория</th>
                <th className="px-4 py-3 font-medium text-gray-600">Описание</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {row.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={row.image} alt="" className="h-12 w-12 object-cover border border-gray-200" />
                      : <div className="h-12 w-12 bg-gray-100 border border-gray-200" />}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.category || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{row.description || '—'}</td>
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
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">{editing ? 'Редактировать фото' : 'Новое фото'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Изображение</label>
                <ImageUpload value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} table="gallery" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Категория</label>
                <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Описание</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none resize-none" />
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
