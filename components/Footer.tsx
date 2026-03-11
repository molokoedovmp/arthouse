import Image from "next/image";
import Link from "next/link";

const nav = [
  { label: "О проекте", href: "/about" },
  { label: "Занятия", href: "/classes" },
  { label: "Расписание", href: "/schedule" },
  { label: "Галерея", href: "/gallery" },
  { label: "Картины", href: "/paintings" },
];

const contacts = [
  { label: "Написать нам", href: "/contact" },
  { label: "ВКонтакте", href: "https://vk.com", external: true },
  { label: "Telegram", href: "https://t.me", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-stone">
      {/* Main */}
      <div className="px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-[1fr_auto_auto_1fr] md:gap-16">

          {/* Logo + tagline */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/ARTHOUSE.png"
                alt="Арт Хаус"
                width={300}
                height={300}
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 font-display text-lg leading-snug text-ink">
              Арт Хаус — территория творчества
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-ink/40">
              Ольга Смирнова · Москва
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/35">
              Навигация
            </p>
            <ul className="flex flex-col gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-ink/50 transition hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/35">
              Контакт
            </p>
            <ul className="flex flex-col gap-3">
              {contacts.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ink/50 transition hover:text-ink"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-sm text-ink/50 transition hover:text-ink">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="md:text-right">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/35">
              Связаться
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:+70000000000" className="text-ink/50 transition hover:text-ink">
                +7 (000) 000-00-00
              </a>
              <a href="mailto:arthouse@example.com" className="text-ink/50 transition hover:text-ink">
                arthouse@example.com
              </a>
              <p className="text-ink/35">Москва</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink/10">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-8">
          <p className="text-xs text-ink/30">
            © {new Date().getFullYear()} Арт Хаус
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-ink/30 transition hover:text-ink">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="text-xs text-ink/30 transition hover:text-ink">
              Условия пользования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
