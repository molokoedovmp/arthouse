"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export type ServiceCard = {
  id: number;
  title: string;
  description: string | null;
  type: string | null;
  image: string | null;
  age_group: string | null;
  price: string | null;
};

export function ServicesCarousel({ items }: { items: ServiceCard[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!ref.current) return;
    const card = ref.current.querySelector("a");
    const w = card ? card.offsetWidth + 16 : 300;
    ref.current.scrollBy({ left: dir === "right" ? w : -w, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-1 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href="/classes"
            className="group flex-shrink-0 w-[260px] sm:w-[300px] flex flex-col border border-ink/10 overflow-hidden [scroll-snap-align:start]"
          >
            {item.image ? (
              /* С фото: картинка + текст внизу */
              <>
                <div className="relative aspect-[3/2] overflow-hidden bg-stone">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col bg-paper p-5">
                  {item.type && (
                    <p className="text-[10px] uppercase tracking-[0.15em] text-accent">{item.type}</p>
                  )}
                  <h3 className="mt-2 font-display text-[20px] leading-tight">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-ink/50">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-auto flex gap-4 pt-4">
                    {item.price && <p className="text-xs text-ink/40">{item.price}</p>}
                    {item.age_group && <p className="text-xs text-ink/40">{item.age_group}</p>}
                  </div>
                </div>
              </>
            ) : (
              /* Без фото: текст занимает весь квадрат */
              <div className="relative flex flex-col justify-between bg-stone/50 p-6 aspect-square group-hover:bg-stone/80 transition-colors">
                <div>
                  {item.type && (
                    <p className="text-[10px] uppercase tracking-[0.15em] text-accent">{item.type}</p>
                  )}
                  <h3 className="mt-3 font-display text-[26px] leading-tight text-ink">{item.title}</h3>
                  {item.description && (
                    <p className="mt-3 text-[13px] leading-relaxed text-ink/60 line-clamp-4">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-ink/10 pt-4">
                  {item.age_group && (
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-ink/35">Возраст</p>
                      <p className="mt-0.5 text-sm text-ink/70">{item.age_group}</p>
                    </div>
                  )}
                  {item.price && (
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-ink/35">Стоимость</p>
                      <p className="mt-0.5 text-sm text-ink/70">{item.price}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>

      {items.length > 2 && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink/50 transition hover:border-ink hover:text-ink"
            aria-label="Назад"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink/50 transition hover:border-ink hover:text-ink"
            aria-label="Вперёд"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
