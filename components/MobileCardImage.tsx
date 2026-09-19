"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageLightbox } from "./ImageLightbox";

interface MobileCardImageProps {
  src: string;
  alt: string;
}

export function MobileCardImage({ src, alt }: MobileCardImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative h-full w-full cursor-zoom-in overflow-hidden bg-stone text-left"
        aria-label={`Увеличить изображение: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 767px) 50vw, 1px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center bg-black/55 text-white backdrop-blur-sm">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4M11 8v6M8 11h6" />
          </svg>
        </span>
      </button>

      {open && <ImageLightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
