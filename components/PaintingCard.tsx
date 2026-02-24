import Image from "next/image";
import Link from "next/link";

export interface PaintingCardItem {
  id: number;
  title: string;
  year: number | string;
  size: string;
  technique: string;
  image: string;
}

export function PaintingCard({ painting }: { painting: PaintingCardItem }) {
  return (
    <Link href={`/paintings/${painting.id}`} className="group">
      <div className="overflow-hidden bg-stone">
        <Image
          src={painting.image || "/images/painting-placeholder.svg"}
          alt={painting.title}
          width={800}
          height={1000}
          className="h-[360px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Ольга Смирнова</p>
        <p className="font-display text-lg italic">{painting.title}</p>
        <div className="text-xs uppercase tracking-[0.2em] text-ink/50">
          {painting.year} · {painting.technique}
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-ink/50">{painting.size}</div>
      </div>
    </Link>
  );
}
