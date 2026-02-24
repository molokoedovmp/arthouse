"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "О проекте", href: "/about" },
  { label: "Занятия", href: "/classes" },
  { label: "Расписание", href: "/schedule" },
  { label: "Галерея", href: "/gallery" },
  { label: "Картины", href: "/paintings" },
];

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/paintings") {
      return pathname.startsWith("/paintings");
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-paper/80 backdrop-blur">
      <div className="w-full px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/l.png" alt="Арт Хаус" width={300} height={300} className="h-[60px] w-auto object-contain" />
            <div className="flex flex-col gap-1">
              <span className="font-display text-lg tracking-tight md:text-xl">
                Арт Хаус — территория творчества
              </span>
              <span className="caps text-ink/60">Ольга Смирнова</span>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`caps link-underline ${isActive(link.href) ? "text-ink" : "text-ink/60"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
