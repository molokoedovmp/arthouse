import Image from "next/image";
import Link from "next/link";

const pages = [
  { label: "О проекте", href: "/about" },
  { label: "Занятия", href: "/classes" },
  { label: "Расписание", href: "/schedule" },
  { label: "События", href: "/events" },
  { label: "Галерея", href: "/gallery" },
  { label: "Картины", href: "/paintings" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10">
      {/* Main section */}
      <div className="w-full px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-16">

          {/* Логотип */}
          <Link href="/" className="block shrink-0">
            <Image
              src="/logo.png"
              alt="Арт Хаус"
              width={400}
              height={400}
              className="h-[180px] w-auto object-contain"
            />
          </Link>

          {/* Навигация — центр */}
          <div className="flex flex-wrap items-start gap-x-16 gap-y-8 md:pt-3">
            <div>
              <p className="caps mb-4 text-[10px] text-ink/35">Разделы</p>
              <ul className="flex flex-col gap-2.5">
                {pages.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="text-sm text-ink/60 transition hover:text-ink">
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="caps mb-4 text-[10px] text-ink/35">Контакт</p>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <Link href="/contact" className="text-sm text-ink/60 transition hover:text-ink">
                    Написать нам
                  </Link>
                </li>
                <li>
                  <a href="https://vk.com" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-ink/60 transition hover:text-ink">
                    ВКонтакте
                  </a>
                </li>
                <li>
                  <a href="https://t.me" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-ink/60 transition hover:text-ink">
                    Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Контакты — правый край */}
          <div className="md:pt-3 md:text-right">
            <p className="font-display text-xl leading-tight">Арт Хаус</p>
            <p className="caps mt-1 text-[10px] text-ink/50">Ольга Смирнова</p>
            <div className="mt-5 space-y-1.5 text-sm text-ink/50">
              <p>Дзержинск</p>
              <p>Нижегородская область</p>
              <a href="tel:+70000000000" className="block transition hover:text-ink">
                +7 (000) 000-00-00
              </a>
              <a href="mailto:arthouse@example.com" className="block transition hover:text-ink">
                arthouse@example.com
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink/10">
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <p className="text-xs text-ink/35">
              © {new Date().getFullYear()} Арт Хаус — территория творчества
            </p>
            <Link
              href="/contact"
              className="text-xs uppercase tracking-[0.15em] text-ink/40 transition hover:text-ink"
            >
              Записаться →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
