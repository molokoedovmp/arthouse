"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type HeroCarouselProps = {
  images: string[];
  alt: string;
};

export function HeroCarousel({ images, alt }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const clearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((cur) => {
        const next = (cur + 1) % images.length;
        setPrev(cur);
        if (clearRef.current) clearTimeout(clearRef.current);
        clearRef.current = setTimeout(() => setPrev(null), 800);
        return next;
      });
    }, 4500);
    return () => {
      window.clearInterval(timer);
      if (clearRef.current) clearTimeout(clearRef.current);
    };
  }, [images.length]);

  if (images.length === 0) return null;

  // Рендерим только текущий слайд + предыдущий (для плавного перехода)
  const toRender = new Set<number>([index]);
  if (prev !== null) toRender.add(prev);

  return (
    <div className="relative h-full w-full">
      {images.map((src, i) => {
        if (!toRender.has(i)) return null;
        return (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover object-center transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        );
      })}

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((src, i) => (
            <button
              key={`${src}-dot`}
              type="button"
              onClick={() => {
                setPrev(index);
                setIndex(i);
              }}
              className={`h-2.5 w-2.5 rounded-full border border-white/70 transition ${
                i === index ? "bg-white" : "bg-white/30"
              }`}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
