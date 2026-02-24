import type { ReactNode } from 'react'
import { AdminNav } from '../../components/admin/AdminNav'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      <AdminNav />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
