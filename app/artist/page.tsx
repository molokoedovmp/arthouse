import { Container } from "../../components/Container";
import { ArtistsList } from "../../components/ArtistsList";
import { artists } from "../../data/content";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";

export const metadata = {
  title: "Художники",
  description: "Художники и педагоги Арт Хаус — творческой мастерской Ольги Смирновой.",
};

const subtitleText = {
  ru: "Люди, которые создают атмосферу мастерской, ведут занятия и делятся своим взглядом на искусство.",
  en: "The people who create the studio atmosphere, lead classes and share their vision of art.",
};

export default async function ArtistsPage() {
  const lang = await getLang();
  const t = getT(lang);

  return (
    <section className="py-16">
      <Container>
        <div className="mb-12">
          <p className="caps text-accent">Арт Хаус</p>
          <h1 className="mt-2 font-display text-[36px] leading-tight md:text-[48px]">{t.artist.title}</h1>
          <p className="mt-4 max-w-xl text-ink/60">{subtitleText[lang]}</p>
        </div>

        <ArtistsList artists={artists} />
      </Container>
    </section>
  );
}
