import Image from "next/image";
import Link from "next/link";
import { readdir } from "fs/promises";
import pool from "../lib/db";
import { PaintingsShowcase } from "@/components/PaintingsShowcase";
import { HeroCarousel } from "@/components/HeroCarousel";
import { getLang } from "../lib/get-lang";
import { getT } from "../lib/i18n";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Главная",
  description: "АртХаус — территория творчества, занятия и авторские картины.",
};

const TZ = "Europe/Moscow";

function fmtTime(dt: Date) {
  return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(dt);
}

export default async function HomePage() {
  const lang = await getLang();
  const t = getT(lang);
  const h = t.home;
  const isRu = lang === "ru";

  // Upcoming schedule with images
  const scheduleRes = await pool.query<{
    id: number;
    start_datetime: Date;
    title: string;
    age_group: string | null;
    duration_minutes: string | null;
    price: string | null;
    image: string | null;
    max_participants: number | null;
    booked: string;
  }>(
    `SELECT s.id, s.start_datetime, s.title, s.age_group, s.duration_minutes, s.price, s.image,
            s.max_participants, COUNT(b.id) FILTER (WHERE b.status != 'cancelled') AS booked
     FROM schedule s
     LEFT JOIN bookings b ON b.schedule_id = s.id
     WHERE s.start_datetime >= NOW() AND s.status = 'active'
     GROUP BY s.id
     ORDER BY s.start_datetime
     LIMIT 6`
  );
  const scheduleItems = scheduleRes.rows;

  // Services catalog with images
  const servicesRes = await pool.query<{
    id: number;
    title: string;
    description: string;
    type: string;
    image: string | null;
    age_group: string | null;
    price: string | null;
  }>(
    `SELECT id, title, description, type, image, age_group, price FROM services ORDER BY id LIMIT 4`
  );
  const services = servicesRes.rows;

  const paintingsRes = await pool.query<{
    id: number;
    title: string;
    year: number;
    technique: string;
    size: string;
    image: string;
  }>(
    `SELECT id, title, year, technique, size, image FROM paintings ORDER BY id DESC LIMIT 5`
  );
  const paintings = paintingsRes.rows;

  const heroDir = `${process.cwd()}/public/hero`;
  const heroFiles = await readdir(heroDir);
  const imageNames = heroFiles
    .filter((file) => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
    .sort((a, b) => {
      if (a === "11.JPG") return -1;
      if (b === "11.JPG") return 1;
      return a.localeCompare(b, "ru", { sensitivity: "base" });
    });
  const heroImages = imageNames.map((file) => `/hero/${encodeURIComponent(file)}`);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="border-b border-ink/10">
        <div className="grid md:grid-cols-2 md:items-center" style={{ minHeight: "calc(100vh - 84px)" }}>
          <div className="flex flex-col justify-center px-6 py-14 md:px-12 lg:px-20">
            <p className="caps text-sm text-ink/40">{h.heroLink}</p>
            <h1 className="mt-4 font-display text-[34px] leading-[1.1] md:text-[46px] lg:text-[56px]">
              {isRu ? <>Территория творчества<br />Ольги Смирновой</> : <>Creative Territory<br />of Olga Smirnova</>}
            </h1>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink/50">{h.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/schedule" className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80">
                {t.common.register}
              </Link>
              <Link href="/about" className="border border-ink/20 px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink transition hover:border-ink">
                {isRu ? "О проекте" : "About"}
              </Link>
            </div>
          </div>
          <div className="relative h-[60vw] md:h-full" style={{ minHeight: "400px" }}>
            <HeroCarousel images={heroImages} alt="Арт Хаус" />
          </div>
        </div>
      </section>

      {/* ── Promo banner ── */}
      <section className="border-b border-ink/10">
        <div className="px-4 py-6 text-center">
          <p className="font-display whitespace-nowrap text-[clamp(18px,4.5vw,34px)] leading-none text-ink">
            {isRu ? "Весенняя акция -20% на все занятия." : "Spring offer -20% on all classes."}
          </p>
        </div>
      </section>

      {/* ── Ближайшие занятия ── */}
      <section className="border-b border-ink/10 py-12 md:py-16">
        <div className="px-6 md:px-8 lg:px-12">
          <div className="mb-8 flex items-baseline justify-between">
            <p className="caps text-ink/40">{isRu ? "Ближайшие занятия" : "Upcoming classes"}</p>
            <Link href="/schedule" className="caps text-xs text-ink/40 transition hover:text-ink">
              {isRu ? "Всё расписание →" : "Full schedule →"}
            </Link>
          </div>

          {scheduleItems.length === 0 ? (
            <p className="py-8 text-sm text-ink/40">
              {isRu ? "Нет предстоящих занятий" : "No upcoming classes"}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {scheduleItems.map((item) => {
                const dt = new Date(item.start_datetime);
                const booked = Number(item.booked);
                const available = item.max_participants !== null ? item.max_participants - booked : null;
                const full = available !== null && available <= 0;

                return (
                  <article key={item.id} className="group flex flex-col border border-ink/10 bg-paper overflow-hidden">
                    {/* Image with date badge */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-stone to-ink/8" />
                      )}
                      {/* Date badge */}
                      <div className="absolute left-0 top-0 bg-ink px-3 py-2 text-center text-white">
                        <p className="font-display text-[26px] leading-none">
                          {new Intl.DateTimeFormat("ru-RU", { day: "2-digit", timeZone: TZ }).format(dt)}
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-white/65">
                          {new Intl.DateTimeFormat(isRu ? "ru-RU" : "en-US", { month: "short", timeZone: TZ }).format(dt)}
                        </p>
                      </div>
                      {/* Full badge */}
                      {full && (
                        <div className="absolute right-0 top-0 bg-ink/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] text-white/80">
                          {isRu ? "Мест нет" : "Full"}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-ink/35">
                        {new Intl.DateTimeFormat(isRu ? "ru-RU" : "en-US", { weekday: "long", timeZone: TZ }).format(dt)}
                        {" · "}
                        {fmtTime(dt)}
                      </p>
                      <h3 className="mt-2 font-display text-[20px] leading-snug">{item.title}</h3>
                      <div className="mt-auto flex items-end justify-between pt-4">
                        <div className="flex gap-3">
                          {item.price && <p className="text-xs text-ink/50">{item.price}</p>}
                          {item.age_group && <p className="text-xs text-ink/40">{item.age_group}</p>}
                        </div>
                        {available !== null && !full && (
                          <p className="text-xs text-ink/35">
                            {isRu ? `${available} св. мест` : `${available} left`}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Наши занятия (услуги с фото) ── */}
      <section className="border-b border-ink/10 py-12 md:py-16">
        <div className="px-6 md:px-8 lg:px-12">
          <div className="mb-8 flex items-baseline justify-between">
            <p className="caps text-ink/40">{h.classesLabel}</p>
            <Link href="/classes" className="caps text-xs text-ink/40 transition hover:text-ink">
              {h.classesAll}
            </Link>
          </div>

          {services.length === 0 ? (
            <p className="py-8 text-sm text-ink/40">{h.classesEmpty}</p>
          ) : (
            <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((item, index) => (
                <Link
                  key={item.id}
                  href="/classes"
                  className="group flex flex-col bg-paper overflow-hidden"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-stone">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-[52px] text-ink/8">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {item.type && <p className="caps text-[10px] text-accent">{item.type}</p>}
                    <h3 className="mt-2 font-display text-[18px] leading-tight">{item.title}</h3>
                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-ink/50">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-auto flex gap-4 pt-4">
                      {item.price && <p className="text-xs text-ink/40">{item.price}</p>}
                      {item.age_group && <p className="text-xs text-ink/40">{item.age_group}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Галерея учеников ── */}
      <section className="border-t border-ink/10">
        <div className="grid lg:grid-cols-2 lg:items-stretch">
          <div className="relative aspect-square overflow-hidden bg-stone">
            <Image src="/images/gaallery.jpg" alt="Галерея работ" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center px-8 py-16 md:px-16 lg:px-20 lg:py-24">
            <p className="caps text-ink/40">{h.galleryLabel}</p>
            <h2 className="mt-3 font-display text-3xl italic leading-tight lg:text-4xl">{h.galleryTitle}</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/60">{h.galleryText}</p>
            <Link href="/gallery" className="mt-6 w-fit text-xs uppercase tracking-[0.2em] text-ink/50 transition hover:text-ink">
              {h.galleryLink}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Каталог картин ── */}
      <section className="border-t border-ink/10">
        <div className="grid lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col justify-center px-8 py-16 md:px-16 lg:px-20 lg:py-24 lg:order-first">
            <p className="caps text-ink/40">{h.catalogLabel}</p>
            <h2 className="mt-3 font-display text-3xl italic leading-tight lg:text-4xl">{h.catalogTitle}</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/60">{h.catalogText}</p>
            <Link href="/paintings" className="mt-6 w-fit text-xs uppercase tracking-[0.2em] text-ink/50 transition hover:text-ink">
              {h.catalogLink}
            </Link>
          </div>
          <div className="relative aspect-square overflow-hidden bg-stone">
            <Image src="/images/IMG_8891.jpg" alt="Арт Хаус студия" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── Картины ── */}
      <section className="border-t border-ink/10">
        <PaintingsShowcase paintings={paintings} />
      </section>

      {/* ── Связаться ── */}
      <section className="border-t border-ink/10 bg-[#f5f3f0]">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center lg:py-20">
          <h2 className="font-display text-[32px] leading-tight md:text-[40px]">{t.contact.heading}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/50">
            {isRu
              ? "Напишите нам, если хотите записаться на занятие, узнать о мероприятиях или задать вопрос."
              : "Get in touch to book a class, learn about upcoming events or ask a question."}
          </p>
          <Link href="/contact" className="mt-8 bg-ink px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80">
            {t.common.writeUs}
          </Link>
        </div>
      </section>
    </div>
  );
}
