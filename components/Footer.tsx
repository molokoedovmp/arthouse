import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";

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
    <footer className="border-t border-ink/10 bg-stone/30">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-[1fr_160px_160px]">
          {/* Бренд */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/l.png"
                alt="Арт Хаус"
                width={200}
                height={200}
                className="h-10 w-auto object-contain"
              />
              <div>
                <p className="font-display text-base leading-tight">Арт Хаус</p>
                <p className="caps text-[10px] text-ink/50">Ольга Смирнова</p>
              </div>
            </Link>
            <div className="mt-5 space-y-1.5 text-sm text-ink/55">
              <p>Дзержинск, Нижегородская область</p>
              <a href="tel:+70000000000" className="block transition hover:text-ink">
                +7 (000) 000-00-00
              </a>
              <a href="mailto:arthouse@example.com" className="block transition hover:text-ink">
                arthouse@example.com
              </a>
            </div>
          </div>

          {/* Разделы */}
          <div>
            <p className="caps text-[10px] text-ink/35 mb-4">Разделы</p>
            <ul className="flex flex-col gap-3">
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="text-sm text-ink/60 transition hover:text-ink">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Связаться */}
          <div>
            <p className="caps text-[10px] text-ink/35 mb-4">Контакт</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/contact" className="text-sm text-ink/60 transition hover:text-ink">
                  Написать нам
                </Link>
              </li>
              <li>
                <a
                  href="https://vk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink/60 transition hover:text-ink"
                >
                  ВКонтакте
                </a>
              </li>
              <li>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink/60 transition hover:text-ink"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-1 border-t border-ink/10 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink/35">
            © {new Date().getFullYear()} Арт Хаус — территория творчества
          </p>
          <p className="text-xs text-ink/25">Художественная мастерская</p>
        </div>
      </Container>
    </footer>
  );
}
