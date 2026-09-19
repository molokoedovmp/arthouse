import { Container } from "../../components/Container";
import { ArtistsList } from "../../components/ArtistsList";
import { artists } from "../../data/content";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Художник и педагог Ольга Смирнова",
  description: "Биография художницы, иконописца и педагога Ольги Смирновой — основателя творческой мастерской АртХаус.",
  path: "/artist",
  image: "/images/img_adout.jpg",
  keywords: ["художник Ольга Смирнова", "педагог по живописи"],
});

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
