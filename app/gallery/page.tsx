import { Container } from "../../components/Container";
import { SectionTitle } from "../../components/SectionTitle";
import { GalleryFilter } from "../../components/GalleryFilter";
import pool from "../../lib/db";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Галерея",
  description: "Работы учеников и фотографии мероприятий художественной мастерской.",
};

export default async function GalleryPage() {
  const res = await pool.query<{
    id: number;
    image: string;
    category: string;
    description: string;
  }>(
    `SELECT id, image, category, description FROM gallery ORDER BY id DESC`
  );

  return (
    <section className="py-16">
      <Container>
        <SectionTitle subtitle="Галерея">Работы учеников и атмосфера студии</SectionTitle>
        <GalleryFilter items={res.rows} />
      </Container>
    </section>
  );
}
