'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin/services', label: 'Услуги' },
  { href: '/admin/schedule', label: 'Расписание' },
  { href: '/admin/events', label: 'События' },
  { href: '/admin/paintings', label: 'Картины' },
  { href: '/admin/gallery', label: 'Галерея' },
  { href: '/admin/contact-requests', label: 'Заявки' },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin/login') return null

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-52 shrink-0 flex flex-col bg-gray-900 text-white">
      <div className="px-5 py-5 border-b border-white/10">
        <p className="font-semibold text-sm">Арт Хаус</p>
        <p className="text-white/40 text-xs mt-0.5">Администрирование</p>
      </div>
      <nav className="flex-1 py-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-5 py-2.5 text-sm transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="w-full py-2 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
        >
          Выйти
        </button>
      </div>
    </aside>
  )
}
