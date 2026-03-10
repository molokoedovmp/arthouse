import Image from "next/image";
import { Container } from "../../components/Container";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";

export const metadata = {
  title: "О проекте",
  description: "О художественной мастерской Арт Хаус — территории творчества для взрослых и детей.",
};

export default async function AboutPage() {
  const lang = await getLang();
  const t = getT(lang);

  return (
    <Container>
      <div className="py-12 md:py-16">

        <div className="border-b border-ink/10 pb-8">
          <p className="caps text-sm text-ink/40">{t.about.subtitle}</p>
          <h1 className="mt-3 font-display text-[38px] leading-tight md:text-[52px]">
            {lang === "ru" ? "О проекте" : "About"}
          </h1>
        </div>

        {/* Section 1: text left, photo right */}
        <div className="mt-12 grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-4 text-[15px] leading-relaxed text-ink/65">
            {t.about.content.slice(0, 3).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="relative w-full overflow-hidden bg-stone" style={{ aspectRatio: '1 / 1' }}>
            <Image src="/event/2.JPG" alt="Арт Хаус" fill className="object-cover" priority />
          </div>
        </div>

        {/* Section 2: photo left, text right */}
        <div className="mt-12 grid items-center gap-10 border-t border-ink/10 pt-12 md:grid-cols-2 md:gap-16">
          <div className="relative w-full overflow-hidden bg-stone" style={{ aspectRatio: '1 / 1' }}>
            <Image src="/event/10.JPG" alt="Арт Хаус" fill className="object-cover" />
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-ink/65">
            {t.about.content.slice(3).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

      </div>
    </Container>
  );
}
