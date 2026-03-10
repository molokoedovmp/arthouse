"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function ZoomableImage({ src, alt, width, height, className }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className="cursor-zoom-in"
        onClick={() => setOpen(true)}
        title="Нажмите для увеличения"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      </div>

      {mounted && open && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90"
          onClick={() => setOpen(false)}
        >
          {/* Кнопка закрытия */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-white/80 hover:text-white"
            aria-label="Закрыть"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Картина */}
          <div
            className="relative max-h-[90vh] max-w-[90vw] cursor-zoom-out"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
