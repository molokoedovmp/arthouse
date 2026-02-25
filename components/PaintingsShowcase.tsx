"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Painting {
  id: number;
  title: string;
  year: number;
  technique: string;
  image: string;
}

export function PaintingsShowcase({ paintings }: { paintings: Painting[] }) {
  const mobileRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = paintings.length;

  useEffect(() => {
    function onScroll() {
      const el = mobileRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      setIndex(Math.min(Math.floor(progress * count), count - 1));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [count]);

  return (
    <>
      {/* ===== Desktop: simple static grid, no animation ===== */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5 lg:px-8">
          <p className="caps text-ink/40">Картины</p>
          <Link href="/paintings" className="caps text-ink/40 transition hover:text-ink">
            Весь каталог →
          </Link>
        </div>
        <div className="flex items-stretch" style={{ height: "calc(100vh - 84px - 52px)" }}>
          {paintings.map((painting) => (
            <div key={painting.id} className="relative flex-1 border-r border-ink/10 last:border-r-0">
              <Link
                href={`/paintings/${painting.id}`}
                className="group flex h-full flex-col items-center justify-center p-6"
              >
                <div className="relative flex-1 w-full">
                  <Image
                    src={painting.image || "/images/painting-placeholder.svg"}
                    alt={painting.title}
                    fill
                    className="object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
                    sizes={`${Math.round(100 / count)}vw`}
                    priority
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="font-display text-lg italic leading-snug">{painting.title}</p>
                  <p className="mt-1 text-[11px] text-ink/30">
                    {[painting.year, painting.technique].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Mobile: scroll-driven crossfade animation ===== */}
      <div ref={mobileRef} className="lg:hidden" style={{ height: `${count * 100}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
            <p className="caps text-ink/40">Картины</p>
            <Link href="/paintings" className="caps text-ink/40 transition hover:text-ink">
              Весь каталог →
            </Link>
          </div>

          <div className="relative flex-1">
            {paintings.map((painting, i) => (
              <div
                key={painting.id}
                className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8"
                style={{
                  opacity: i === index ? 1 : 0,
                  transition: "opacity 0.5s ease",
                  pointerEvents: i === index ? "auto" : "none",
                }}
              >
                <Link href={`/paintings/${painting.id}`} className="group flex flex-col items-center">
                  <div className="relative h-[55vh] w-[80vw]">
                    <Image
                      src={painting.image || "/images/painting-placeholder.svg"}
                      alt={painting.title}
                      fill
                      className="object-contain"
                      sizes="80vw"
                      priority={i === 0}
                    />
                  </div>
                  <div className="mt-5 text-center">
                    <p className="font-display text-xl italic">{painting.title}</p>
                    <p className="mt-1.5 text-sm text-ink/40">
                      {[painting.year, painting.technique].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </Link>
              </div>
            ))}

            {/* Progress dots */}
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
              {paintings.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: "3px",
                    height: i === index ? "24px" : "6px",
                    backgroundColor:
                      i === index
                        ? "var(--color-ink)"
                        : "color-mix(in srgb, var(--color-ink) 18%, transparent)",
                  }}
                />
              ))}
            </div>

            {/* Counter */}
            <p className="absolute bottom-5 left-6 text-xs text-ink/25">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
