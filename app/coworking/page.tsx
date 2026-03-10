import Link from "next/link";
import { Container } from "../../components/Container";
import { ZoomableImage } from "../../components/ZoomableImage";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";

export const metadata = {
  title: "Творческий коворкинг",
  description: "Арендуйте рабочее место в творческой мастерской Арт Хаус — для любителей и профессиональных художников.",
};

const photos: string[] = [
  "/event/1.JPG",
  "/event/2.JPG",
  "/event/3.JPG",
  "/event/4.JPG",
  "/event/5.JPG",
  "/event/6.JPG",
  "/event/7.JPG",
  "/event/8.JPG",
];

export default async function CoworkingPage() {
  const lang = await getLang();
  const t = getT(lang);
  const c = t.coworking;

  return (
    <div>
      <Container>

        {/* Заголовок */}
        <div className="border-b border-ink/10 py-10">
          <h1 className="font-display text-[32px]">{c.title}</h1>
          <p className="mt-2 max-w-xl text-[15px] text-ink/50">{c.subtitle}</p>
        </div>

        {/* Два раздела */}
        <div className="grid gap-0 border-b border-ink/10 md:grid-cols-2 md:divide-x md:divide-ink/10">

          {/* Для любителей */}
          <div className="py-10 md:pr-10">
            <p className="caps text-xs text-ink/40 mb-6">{c.forAmateurs}</p>
            <ul className="divide-y divide-ink/8">
              {c.forAmateursList.map((item, i) => (
                <li key={i} className="flex items-baseline gap-5 py-4">
                  <span className="shrink-0 font-display text-[22px] leading-none text-ink/50 w-8 text-right pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] leading-snug text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Для профессиональных художников */}
          <div className="border-t border-ink/10 py-10 md:border-t-0 md:pl-10">
            <p className="caps text-xs text-ink/40 mb-6">{c.forPros}</p>
            <ul className="divide-y divide-ink/8">
              {c.forProsList.map((item, i) => (
                <li key={i} className="flex items-baseline gap-5 py-4">
                  <span className="shrink-0 font-display text-[22px] leading-none text-ink/50 w-8 text-right pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] leading-snug text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Фотоальбом */}
        <div className="border-b border-ink/10 py-10">
          <p className="caps text-xs text-ink/40 mb-6">{c.atmosphere}</p>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden bg-stone">
                  <ZoomableImage
                    src={src}
                    alt={`${c.title} ${i + 1}`}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square border border-ink/15 bg-stone/40 flex flex-col items-center justify-center gap-1"
                >
                  <span className="font-display text-[36px] leading-none text-ink/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-ink/25">{c.photo}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between py-8">
          <p className="text-sm text-ink/40">{c.ctaText}</p>
          <Link
            href="/contact"
            className="text-xs uppercase tracking-[0.15em] text-ink/50 underline-offset-4 hover:underline hover:text-ink transition"
          >
            {t.common.writeUs}
          </Link>
        </div>

      </Container>
    </div>
  );
}
