import { Container } from "../../components/Container";
import { SectionTitle } from "../../components/SectionTitle";
import { PaintingCard } from "../../components/PaintingCard";
import pool from "../../lib/db";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";
import { createPageMetadata } from "../../lib/seo";

export const dynamic = 'force-dynamic';

export const metadata = createPageMetadata({
  title: "Картины Ольги Смирновой",
  description: "Каталог авторских картин художницы Ольги Смирновой: пейзажи и живописные работы с описанием, размером, техникой и стоимостью.",
  path: "/paintings",
  image: "/images/IMG_8891.jpg",
  keywords: ["картины Ольги Смирновой", "купить картину", "современная живопись"],
});

export default async function PaintingsPage() {
  const lang = await getLang();
  const t = getT(lang);

  const res = await pool.query<{
    id: number;
    title: string;
    year: number;
    size: string;
    technique: string;
    image: string;
  }>(
    `SELECT id, title, year, size, technique, image FROM paintings ORDER BY id DESC`
  );

  return (
    <section className="py-16">
      <Container>
        <SectionTitle subtitle={t.paintings.subtitle}>{t.paintings.title}</SectionTitle>
        {res.rows.length === 0 ? (
          <p className="mt-12 text-center font-display text-[22px] text-ink/30">
            {t.paintings.noItems}
          </p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {res.rows.map((painting) => (
              <PaintingCard key={painting.id} painting={painting} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
