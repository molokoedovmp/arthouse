"use client";

import Image from "next/image";
import { useState } from "react";
import type { Artist } from "../data/content";
import { useLanguage } from "./LangProvider";

export function ArtistsList({ artists }: { artists: Artist[] }) {
  const [selected, setSelected] = useState(artists[0]?.id ?? null);
  const active = artists.find((a) => a.id === selected) ?? artists[0];
  const { lang } = useLanguage();

  return (
    <div>
      {/* Сетка карточек — только если художников больше одного */}
      {artists.length > 1 && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {artists.map((artist) => {
            const isActive = artist.id === selected;
            return (
              <button
                key={artist.id}
                onClick={() => setSelected(artist.id)}
                className={`group text-left transition ${isActive ? "opacity-100" : "opacity-60 hover:opacity-90"}`}
              >
                <div className={`overflow-hidden bg-stone ${isActive ? "ring-2 ring-ink/20 ring-offset-2" : ""}`}>
                  <Image
                    src={artist.photo}
                    alt={artist.name}
                    width={400}
                    height={500}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3">
                  <p className="font-display text-base italic leading-tight">{artist.name}</p>
                  <p className="caps mt-1 text-xs text-ink/50">
                    {lang === "en" ? artist.roleEn : artist.role}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Биография выбранного художника */}
      {active && (
        <div className={artists.length > 1 ? "mt-16 border-t border-ink/10 pt-16" : ""}>
          <div className="grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-16 lg:items-start">
            {/* Портрет + имя */}
            <div className="flex flex-col items-center gap-4 text-center lg:sticky lg:top-28">
              <Image
                src={active.photo}
                alt={active.name}
                width={300}
                height={380}
                className="w-full max-w-[240px] object-cover"
              />
              <div>
                <p className="font-display text-xl">{active.name}</p>
                <p className="caps mt-1 text-ink/50">
                  {lang === "en" ? active.roleEn : active.role}
                </p>
              </div>
            </div>

            {/* Текст биографии */}
            <div className="space-y-5 text-[17px] leading-relaxed text-ink/80">
              {(lang === "en" ? active.bioEn : active.bio).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {(lang === "en" ? active.quoteEn : active.quote) && (
                <blockquote className="border-l-2 border-accent pl-5 text-ink/70 italic">
                  {lang === "en" ? active.quoteEn : active.quote}
                </blockquote>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
