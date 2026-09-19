'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'

interface Props {
  src: string
  alt: string
  onClose: () => void
}

export function ImageLightbox({ src, alt, onClose }: Props) {
  const [zoom, setZoom] = useState(1)
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center overflow-auto bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 text-white/60 transition hover:text-white"
        aria-label="Закрыть"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="fixed bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center bg-black/65 text-white backdrop-blur-sm">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setZoom((value) => Math.max(1, value - 0.5)) }}
          className="flex h-11 w-12 items-center justify-center text-xl disabled:opacity-30"
          disabled={zoom === 1}
          aria-label="Уменьшить"
        >
          −
        </button>
        <span className="min-w-14 text-center text-xs">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setZoom((value) => Math.min(3, value + 0.5)) }}
          className="flex h-11 w-12 items-center justify-center text-xl disabled:opacity-30"
          disabled={zoom === 3}
          aria-label="Увеличить"
        >
          +
        </button>
      </div>

      <div
        className="relative max-h-[82vh] max-w-[90vw] transition-transform duration-200"
        style={{ transform: `scale(${zoom})` }}
        onClick={e => e.stopPropagation()}
        onDoubleClick={() => setZoom((value) => value === 1 ? 2 : 1)}
      >
        <Image
          src={src}
          alt={alt}
          width={1400}
          height={900}
          className="max-h-[82vh] max-w-[90vw] object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
    </div>,
    document.body
  )
}
