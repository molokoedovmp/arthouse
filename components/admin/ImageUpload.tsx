'use client'

import { useState } from 'react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  table: string
}

export function ImageUpload({ value, onChange, table }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('table', table)

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) onChange(data.url)
    } catch {
      alert('Ошибка загрузки файла')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {value && (
        <div className="mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-24 w-auto object-cover border border-gray-200" />
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 border border-gray-300 px-3 py-1.5 text-xs hover:border-gray-500 transition-colors">
        {uploading ? 'Загрузка...' : value ? 'Заменить файл' : 'Выбрать файл'}
        <input type="file" accept="image/*" onChange={handleChange} className="hidden" disabled={uploading} />
      </label>
      {value && !uploading && (
        <p className="mt-1 text-xs text-gray-400 truncate max-w-xs">{value.split('/').pop()}</p>
      )}
    </div>
  )
}
