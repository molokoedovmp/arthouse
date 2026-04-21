import Image from "next/image";
import Link from "next/link";
import { Container } from "../../components/Container";
import pool from "../../lib/db";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Занятия",
  description: "Направления для детей, взрослых и коворкинг в художественной мастерской.",
};

export default async function ClassesPage() {
  const lang = await getLang();
  const t = getT(lang);
  const c = t.classes;

  const res = await pool.query<{
    id: number;
    title: string;
    description: string;
    age_group: string;
    price: string;
    duration_minutes: string;
    type: string;
    image: string | null;
  }>(
    `SELECT id, title, description, age_group, price, duration_minutes, type, image FROM services ORDER BY id`
  );
  const classes = res.rows;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0 bg-stone">
          <Image
            src="/images/25.jpg"
            alt={c.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

        <Container>
          <div className="relative flex min-h-[62vh] flex-col justify-between py-12 lg:min-h-[74vh] lg:py-16">
            <div>
              <h1 className="font-display text-[56px] leading-tight text-white md:text-[80px] lg:text-[96px]">
                {lang === "en" ? <>Classes<br />&amp; Formats</> : <>Занятия<br />и форматы</>}
              </h1>
              <p className="mt-4 max-w-lg text-[17px] text-white/65">{c.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="bg-white px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink transition hover:bg-white/90"
                >
                  {t.common.register}
                </Link>
                <Link
                  href="/schedule"
                  className="border border-white/40 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:border-white"
                >
                  {c.scheduleLink}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Список занятий */}
      <section className="py-16 lg:py-24">
        <Container>
          {classes.length === 0 ? (
            <p className="font-display text-[22px] text-ink/30">{c.noItems}</p>
          ) : (
            <div className="divide-y divide-ink/10">
              {classes.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={item.id}
                    className="group grid gap-0 py-12 lg:grid-cols-2 lg:py-16"
                  >
                    {/* Изображение */}
                    {item.image && (
                      <div
                        className={`mb-8 overflow-hidden lg:mb-0 ${
                          isEven ? "lg:order-1 lg:pr-14" : "lg:order-2 lg:pl-14"
                        }`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Текст */}
                    <div
                      className={`flex flex-col justify-center ${
                        item.image
                          ? isEven
                            ? "lg:order-2"
                            : "lg:order-1"
                          : "lg:col-span-2"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="caps text-accent">{item.type}</p>
                        <span className="font-display text-[48px] leading-none text-ink/8">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h2 className="mt-4 font-display text-[30px] leading-tight md:text-[36px] lg:text-[40px]">
                        {item.title}
                      </h2>

                      {item.description && (
                        <p className="mt-4 text-[15px] leading-relaxed text-ink/60">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-6">
                        {item.age_group && (
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-ink/35">{c.age}</p>
                            <p className="mt-1 text-sm text-ink/70">{item.age_group}</p>
                          </div>
                        )}
                        {item.duration_minutes && (
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-ink/35">{c.duration}</p>
                            <p className="mt-1 text-sm text-ink/70">{item.duration_minutes}</p>
                          </div>
                        )}
                        {item.price && (
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-ink/35">{c.price}</p>
                            <p className="mt-1 text-sm text-ink/70">{item.price}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-ink/10 py-16">
        <Container>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-[22px] leading-snug text-ink/40 max-w-sm">{c.ctaText}</p>
            <Link
              href="/contact"
              className="shrink-0 bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80"
            >
              {t.common.writeUs}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
