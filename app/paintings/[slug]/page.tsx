import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../../components/Container";
import { SectionTitle } from "../../../components/SectionTitle";
import { ZoomableImage } from "../../../components/ZoomableImage";
import pool from "../../../lib/db";

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const res = await pool.query<{ title: string; technique: string; size: string }>(
    `SELECT title, technique, size FROM paintings WHERE id = $1`,
    [params.slug]
  );
  const p = res.rows[0];
  if (!p) return { title: "Картина" };
  return {
    title: p.title,
    description: `${p.title} — ${p.technique}, ${p.size}.`,
  };
}

export default async function PaintingPage({ params }: Props) {
  const res = await pool.query<{
    id: number;
    title: string;
    description: string;
    year: number;
    size: string;
    technique: string;
    price: number;
    status: string;
    image: string;
  }>(
    `SELECT id, title, description, year, size, technique, price, status, image FROM paintings WHERE id = $1`,
    [params.slug]
  );

  const painting = res.rows[0];
  if (!painting) notFound();

  const othersRes = await pool.query<{
    id: number;
    title: string;
    year: number;
    technique: string;
    size: string;
    image: string;
  }>(
    `SELECT id, title, year, technique, size, image FROM paintings WHERE id != $1 ORDER BY id DESC LIMIT 4`,
    [painting.id]
  );

  return (
    <section className="py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden bg-stone">
            <ZoomableImage
              src={painting.image || "/images/painting-placeholder.svg"}
              alt={painting.title}
              width={1000}
              height={1200}
              className="h-[520px] w-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <p className="caps text-accent">Ольга Смирнова</p>
            <h1 className="text-[36px] leading-tight md:text-[44px]">{painting.title}</h1>
            {painting.description && (
              <p className="text-ink/70">{painting.description}</p>
            )}
            <div className="space-y-2 text-sm text-ink/70">
              {painting.year && <p>Год: {painting.year}</p>}
              {painting.technique && <p>Техника: {painting.technique}</p>}
              {painting.size && <p>Размер: {painting.size}</p>}
              <p>Статус: {painting.status === "available" ? "В наличии" : "Продано"}</p>
              {painting.price && <p>Стоимость: {Number(painting.price).toLocaleString("ru-RU")} ₽</p>}
            </div>
            <Link
              href="/contact"
              className="inline-flex bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/90"
            >
              Уточнить цену / купить
            </Link>
          </div>
        </div>

        {othersRes.rows.length > 0 && (
          <>
            <div className="section-divider my-12" />
            <SectionTitle subtitle="Другие работы">Ещё картины</SectionTitle>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {othersRes.rows.map((item) => (
                <Link key={item.id} href={`/paintings/${item.id}`} className="group">
                  <div className="overflow-hidden bg-stone">
                    <Image
                      src={item.image || "/images/painting-placeholder.svg"}
                      alt={item.title}
                      width={600}
                      height={800}
                      className="h-52 w-full object-cover"
                    />
                  </div>
                  <div className="mt-3">
                    <p className="font-display text-base italic">{item.title}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{item.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
