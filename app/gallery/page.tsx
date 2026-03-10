import { Container } from "../../components/Container";
import { SectionTitle } from "../../components/SectionTitle";
import { GalleryFilter } from "../../components/GalleryFilter";
import pool from "../../lib/db";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Галерея",
  description: "Работы учеников и фотографии мероприятий художественной мастерской.",
};

export default async function GalleryPage() {
  const lang = await getLang();
  const t = getT(lang);

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
        <SectionTitle subtitle={t.gallery.subtitle}>{t.gallery.title}</SectionTitle>
        <GalleryFilter items={res.rows} />
      </Container>
    </section>
  );
}
