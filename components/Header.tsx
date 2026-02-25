"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const navLinks = [
  { label: "О проекте", href: "/about" },
  { label: "Занятия", href: "/classes" },
  { label: "Расписание", href: "/schedule" },
  { label: "Галерея", href: "/gallery" },
  { label: "Картины", href: "/paintings" },
  { label: "Связаться", href: "/contact" },
];

function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "#ffffff",
      }}
    >
      {/* Top bar: logo + close */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <Link href="/" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "#000" }}>
          <Image src="/l.png" alt="Арт Хаус" width={300} height={300} style={{ height: "40px", width: "auto", objectFit: "contain" }} />
          <span className="font-display" style={{ fontSize: "14px" }}>Арт Хаус</span>
        </Link>
        <button onClick={onClose} style={{ fontSize: "24px", color: "#333", background: "none", border: "none", cursor: "pointer" }} aria-label="Закрыть">
          ✕
        </button>
      </div>

      {/* Links */}
      <nav style={{ display: "flex", flexDirection: "column", padding: "0 24px" }}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            style={{
              padding: "16px 0",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              fontSize: "24px",
              fontStyle: "italic",
              color: isActive(link.href) ? "#000" : "rgba(0,0,0,0.5)",
              textDecoration: "none",
            }}
            className="font-display"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>,
    document.body
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/paintings") return pathname.startsWith("/paintings");
    return pathname === href;
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-paper/80 backdrop-blur">
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <Image src="/l.png" alt="Арт Хаус" width={300} height={300} className="h-10 w-auto object-contain lg:h-[60px]" />
              <div className="flex flex-col">
                <span className="font-display text-sm tracking-tight lg:text-xl">
                  Арт Хаус
                </span>
                <span className="caps hidden text-ink/60 lg:block">Ольга Смирнова</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden gap-6 lg:flex">
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

            {/* Mobile burger */}
            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center lg:hidden"
              aria-label="Открыть меню"
            >
              <div className="relative h-4 w-5">
                <span className="absolute left-0 top-0 h-[1.5px] w-full bg-ink" />
                <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-ink" />
                <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-ink" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Portal-rendered mobile menu — outside header stacking context */}
      <MobileMenu open={open} onClose={() => setOpen(false)} isActive={isActive} />
    </>
  );
}
