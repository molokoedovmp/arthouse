'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageLightbox } from './ImageLightbox'

interface Props {
  src: string
  alt: string
}

export function ScheduleImage({ src, alt }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className="cursor-zoom-in overflow-hidden border border-ink/10 bg-stone"
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={420}
          height={280}
          className="h-full min-h-[180px] w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {open && <ImageLightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}
