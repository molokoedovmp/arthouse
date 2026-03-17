"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "./LangProvider";
import { getT } from "../lib/i18n";

const navKeys = [
  { key: "about" as const, href: "/about" },
  { key: "classes" as const, href: "/classes" },
  { key: "coworking" as const, href: "/coworking" },
  { key: "schedule" as const, href: "/schedule" },
  { key: "events" as const, href: "/events" },
  { key: "gallery" as const, href: "/gallery" },
  { key: "artist" as const, href: "/artist" },
  { key: "paintings" as const, href: "/paintings" },
  { key: "contact" as const, href: "/contact" },
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
  const { lang, setLang } = useLanguage();
  const t = getT(lang);

  useEffect(() => setMounted(true), []);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top bar: logo + close */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <Link href="/" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "#000" }}>
          <Image src="/ARTHOUSE.png" alt="Арт Хаус" width={300} height={300} style={{ height: "50px", width: "auto", objectFit: "contain" }} />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => setLang(lang === "ru" ? "en" : "ru")}
            style={{ fontSize: "11px", letterSpacing: "0.12em", color: "rgba(0,0,0,0.5)", background: "none", border: "1px solid rgba(0,0,0,0.15)", padding: "4px 8px", cursor: "pointer" }}
          >
            {lang === "ru" ? "EN" : "RU"}
          </button>
          <button onClick={onClose} style={{ fontSize: "24px", color: "#333", background: "none", border: "none", cursor: "pointer" }} aria-label="Закрыть">
            ✕
          </button>
        </div>
      </div>

      {/* Links */}
      <nav style={{ display: "flex", flexDirection: "column", padding: "0 24px", overflowY: "auto", flex: 1 }}>
        {navKeys.map((link) => (
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
            {t.nav[link.key]}
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
  const { lang, setLang } = useLanguage();
  const t = getT(lang);

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
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <Image src="/ARTHOUSE.png" alt="Арт Хаус" width={300} height={300} className="h-14 w-auto object-contain lg:h-[80px]" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
              {navKeys.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`caps link-underline text-center leading-tight max-w-[90px] xl:max-w-[100px] text-[10px] xl:text-[11px] ${isActive(link.href) ? "text-ink" : "text-ink/60"}`}
                >
                  {t.nav[link.key]}
                </Link>
              ))}
              {/* Language toggle */}
              <button
                onClick={() => setLang(lang === "ru" ? "en" : "ru")}
                className="caps ml-1 border border-ink/20 px-2 py-1 text-[10px] text-ink/50 transition hover:border-ink/50 hover:text-ink xl:text-[11px]"
              >
                {lang === "ru" ? "EN" : "RU"}
              </button>
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
