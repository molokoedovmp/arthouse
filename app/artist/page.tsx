import { Container } from "../../components/Container";
import { SectionTitle } from "../../components/SectionTitle";
import { artistBio } from "../../data/content";

export const metadata = {
  title: "О художнике",
  description: "Биография и художественный путь Ольги Смирновой.",
};

export default function ArtistPage() {
  return (
    <section className="py-16">
      <Container>
        <SectionTitle subtitle="О художнике">Ольга Смирнова</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          {artistBio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-12 border border-ink/10 bg-stone p-8">
          <p className="caps text-accent">Авторские работы</p>
          <h3 className="mt-3 font-display text-2xl">Живопись как тихий диалог</h3>
          <p className="mt-4 text-sm text-ink/70">
            В картинах важен баланс между воздухом и цветом, между ясной формой и мягкой фактурой.
          </p>
        </div>
      </Container>
    </section>
  );
}
