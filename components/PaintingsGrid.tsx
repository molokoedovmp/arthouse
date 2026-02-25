"use client";

import { useEffect, useRef, useState } from "react";
import { PaintingCard, PaintingCardItem } from "./PaintingCard";

function AnimatedItem({ painting }: { painting: PaintingCardItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      <PaintingCard painting={painting} />
    </div>
  );
}

export function PaintingsGrid({ paintings }: { paintings: PaintingCardItem[] }) {
  return (
    <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
      {paintings.map((painting) => (
        <AnimatedItem key={painting.id} painting={painting} />
      ))}
    </div>
  );
}
