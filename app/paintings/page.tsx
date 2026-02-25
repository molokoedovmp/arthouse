import { Container } from "../../components/Container";
import { SectionTitle } from "../../components/SectionTitle";
import { PaintingCard } from "../../components/PaintingCard";
import pool from "../../lib/db";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Картины",
  description: "Каталог авторских работ Ольги Смирновой.",
};

export default async function PaintingsPage() {
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
        <SectionTitle subtitle="Каталог">Авторские картины</SectionTitle>
        {res.rows.length === 0 ? (
          <p className="mt-12 text-center font-display text-[22px] text-ink/30">
            Картины скоро появятся
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
