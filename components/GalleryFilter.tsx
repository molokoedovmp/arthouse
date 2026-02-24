"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export interface GalleryItem {
  id: number;
  image: string;
  category: string;
  description: string;
}

export function GalleryFilter({ items }: { items: GalleryItem[] }) {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of items) {
      if (item.category && !seen.has(item.category)) {
        seen.add(item.category);
        result.push(item.category);
      }
    }
    return result;
  }, [items]);

  const [filter, setFilter] = useState<string>("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.category === filter)),
    [items, filter]
  );

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-5 py-2 text-xs uppercase tracking-[0.2em] transition ${
            filter === "all" ? "bg-ink text-white" : "border border-ink/20 text-ink/70 hover:text-ink"
          }`}
        >
          Все
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 text-xs uppercase tracking-[0.2em] transition ${
              filter === cat ? "bg-ink text-white" : "border border-ink/20 text-ink/70 hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-ink/40">Нет фотографий в этой категории</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="space-y-3">
              <button
                type="button"
                onClick={() => setLightbox(item)}
                className="group block w-full overflow-hidden bg-stone focus:outline-none"
              >
                <Image
                  src={item.image}
                  alt={item.description || ""}
                  width={900}
                  height={700}
                  className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </button>
              {item.description && <p className="text-sm text-ink/70">{item.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center text-white/60 transition hover:text-white"
            aria-label="Закрыть"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.image}
              alt={lightbox.description || ""}
              width={1600}
              height={1200}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            {lightbox.description && (
              <p className="mt-3 text-center text-sm text-white/60">{lightbox.description}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
