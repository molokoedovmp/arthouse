"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroCarouselProps = {
  images: string[];
  alt: string;
};

export function HeroCarousel({ images, alt }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative h-full w-full">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={i === 0}
          className={`object-cover object-center transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((src, i) => (
            <button
              key={`${src}-dot`}
              type="button"
              onClick={() => setIndex(i)}
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
