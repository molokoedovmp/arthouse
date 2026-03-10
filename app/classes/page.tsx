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
    price: number;
    duration_minutes: number;
    type: string;
  }>(
    `SELECT id, title, description, age_group, price, duration_minutes, type FROM services ORDER BY id`
  );
  const classes = res.rows;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="absolute inset-0 bg-stone">
          <Image
            src="/images/IMG_8390.jpg"
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

      {/* Сетка занятий */}
      <section className="border-b border-ink/10">
        <Container className="!px-0 lg:!px-0">
          <div className="grid border-l border-ink/10 md:grid-cols-2">
            {classes.length === 0 ? (
              <div className="col-span-2 border-b border-r border-ink/10 p-10 text-center">
                <p className="font-display text-[22px] text-ink/30">{c.noItems}</p>
              </div>
            ) : (
              classes.map((item, index) => (
                <div
                  key={item.id}
                  className="group border-b border-r border-ink/10 p-8 transition-colors duration-300 hover:bg-stone/60 lg:p-10"
                >
                  <div className="flex items-start justify-between">
                    <p className="caps text-accent">{item.type}</p>
                    <span className="font-display text-[40px] leading-none text-ink/10">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-[26px] leading-tight md:text-[30px]">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="mt-3 text-sm leading-relaxed text-ink/60">{item.description}</p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-5">
                    {item.age_group && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-ink/35">{c.age}</p>
                        <p className="mt-0.5 text-sm text-ink/70">{item.age_group}</p>
                      </div>
                    )}
                    {item.duration_minutes && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-ink/35">{c.duration}</p>
                        <p className="mt-0.5 text-sm text-ink/70">{item.duration_minutes} {t.common.minutes}</p>
                      </div>
                    )}
                    {item.price && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-ink/35">{c.price}</p>
                        <p className="mt-0.5 text-sm text-ink/70">
                          {Number(item.price).toLocaleString("ru-RU")} ₽
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* CTA ячейка */}
            <div className="border-b border-r border-ink/10 p-8 lg:p-10 flex flex-col justify-between">
              <p className="font-display text-[22px] leading-snug text-ink/40">{c.ctaText}</p>
              <Link
                href="/contact"
                className="mt-6 w-fit bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80"
              >
                {t.common.writeUs}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
