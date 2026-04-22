'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const navItems = [
  { href: '/admin/services', label: 'Услуги' },
  { href: '/admin/schedule', label: 'Расписание' },
  { href: '/admin/events', label: 'Анонсы мероприятий' },
  { href: '/admin/paintings', label: 'Картины' },
  { href: '/admin/gallery', label: 'Галерея' },
  { href: '/admin/bookings', label: 'Записи на занятия' },
  { href: '/admin/event-bookings', label: 'Записи на мероприятия' },
  { href: '/admin/contact-requests', label: 'Заявки (контакты)' },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Закрываем при смене страницы
  useEffect(() => { setOpen(false) }, [pathname])

  // Блокируем скролл когда открыто на мобильном
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (pathname === '/admin/login') return null

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const NavContent = () => (
    <>
      <div className="px-5 py-5 border-b border-white/10">
        <p className="font-semibold text-sm">Арт Хаус</p>
        <p className="text-white/40 text-xs mt-0.5">Администрирование</p>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-5 py-3 text-sm transition-colors ${
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
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 flex-col bg-gray-900 text-white h-full">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-gray-900 text-white px-4 py-3 border-b border-white/10">
        <div>
          <p className="font-semibold text-sm">Арт Хаус</p>
        </div>
        <button
          onClick={() => setOpen(v => !v)}
          className="p-1.5 text-white/70 hover:text-white transition-colors"
          aria-label="Меню"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-40 h-full w-64 flex flex-col bg-gray-900 text-white transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </aside>
    </>
  )
}
