import Image from "next/image";
import Link from "next/link";
import { readdir } from "fs/promises";
import pool from "../lib/db";
import { PaintingsShowcase } from "@/components/PaintingsShowcase";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ServicesCarousel, type ServiceCard } from "@/components/ServicesCarousel";
import { getLang } from "../lib/get-lang";
import { getT } from "../lib/i18n";

export const revalidate = 60; // кеш 60 секунд, не пересобирает на каждый запрос

export const metadata = {
  title: "Главная",
  description: "АртХаус — территория творчества, занятия и авторские картины.",
};

const TZ = "Europe/Moscow";

function fmtDate(dt: Date, isRu: boolean) {
  return new Intl.DateTimeFormat(isRu ? "ru-RU" : "en-US", {
    day: "2-digit", month: "long", timeZone: TZ,
  }).format(dt);
}
function fmtWeekday(dt: Date, isRu: boolean) {
  return new Intl.DateTimeFormat(isRu ? "ru-RU" : "en-US", {
    weekday: "long", timeZone: TZ,
  }).format(dt);
}
function fmtTime(dt: Date) {
  return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(dt);
}

export default async function HomePage() {
  const lang = await getLang();
  const t = getT(lang);
  const h = t.home;
  const isRu = lang === "ru";

  // Все запросы к БД параллельно
  const [scheduleRes, eventsRes, servicesRes, paintingsRes, heroFiles] = await Promise.all([
    pool.query<{
      id: number; start_datetime: Date; title: string;
      age_group: string | null; price: string | null;
      max_participants: number | null; booked: string;
    }>(
      `SELECT s.id, s.start_datetime, s.title, s.age_group, s.price,
              s.max_participants, COUNT(b.id) FILTER (WHERE b.status != 'cancelled') AS booked
       FROM schedule s LEFT JOIN bookings b ON b.schedule_id = s.id
       WHERE s.start_datetime >= NOW() AND s.status = 'active'
       GROUP BY s.id ORDER BY s.start_datetime LIMIT 8`
    ),
    pool.query<{
      id: number; event_date: Date; title: string;
      age_group: string | null; price: string | null;
      max_participants: number | null; booked: string;
    }>(
      `SELECT e.id, e.event_date, e.title, e.age_group, e.price,
              e.max_participants, COUNT(eb.id) FILTER (WHERE eb.status != 'cancelled') AS booked
       FROM events e LEFT JOIN event_bookings eb ON eb.event_id = e.id
       WHERE e.event_date >= NOW()
       GROUP BY e.id ORDER BY e.event_date LIMIT 8`
    ),
    pool.query<ServiceCard>(
      `SELECT id, title, description, type, image, age_group, price FROM services ORDER BY id LIMIT 8`
    ),
    pool.query<{
      id: number; title: string; year: number; technique: string; size: string; image: string;
    }>(
      `SELECT id, title, year, technique, size, image FROM paintings ORDER BY id DESC LIMIT 5`
    ),
    readdir(`${process.cwd()}/public/hero`),
  ]);

  // Merge schedule + events, sort by date
  type TimelineItem = {
    key: string;
    kind: "class" | "event";
    date: Date;
    title: string;
    ageGroup: string | null;
    price: string | null;
    available: number | null;
    isFull: boolean;
  };

  const timeline: TimelineItem[] = [
    ...scheduleRes.rows.map((r) => {
      const booked = Number(r.booked);
      const available = r.max_participants !== null ? r.max_participants - booked : null;
      return {
        key: `class-${r.id}`,
        kind: "class" as const,
        date: new Date(r.start_datetime),
        title: r.title,
        ageGroup: r.age_group,
        price: r.price,
        available,
        isFull: available !== null && available <= 0,
      };
    }),
    ...eventsRes.rows.map((r) => {
      const booked = Number(r.booked);
      const available = r.max_participants !== null ? r.max_participants - booked : null;
      return {
        key: `event-${r.id}`,
        kind: "event" as const,
        date: new Date(r.event_date),
        title: r.title,
        ageGroup: r.age_group,
        price: r.price,
        available,
        isFull: available !== null && available <= 0,
      };
    }),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  const services = servicesRes.rows;
  const paintings = paintingsRes.rows;
  const imageNames = heroFiles
    .filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
    .sort((a, b) => {
      if (a === "11.JPG") return -1;
      if (b === "11.JPG") return 1;
      return a.localeCompare(b, "ru", { sensitivity: "base" });
    });
  const heroImages = imageNames.map((f) => `/hero/${encodeURIComponent(f)}`);

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

      {/* ── Расписание списком (только если есть события) ── */}
      {timeline.length > 0 && (
        <section className="border-b border-ink/10">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4 md:px-8">
            <p className="caps text-ink/40">{isRu ? "Ближайшие занятия и мероприятия" : "Upcoming"}</p>
            <Link href="/schedule" className="caps text-xs text-ink/40 transition hover:text-ink">
              {isRu ? "Всё расписание →" : "Full schedule →"}
            </Link>
          </div>
          <div className="divide-y divide-ink/10">
            {timeline.map((item) => (
              <div key={item.key} className="px-6 py-5 md:px-8">

                {/* Мобильная версия */}
                <div className="flex items-start justify-between gap-4 md:hidden">
                  <div className="min-w-0 flex-1">
                    <span className={`text-[9px] uppercase tracking-[0.14em] font-medium ${item.kind === "event" ? "text-accent" : "text-ink/30"}`}>
                      {item.kind === "event" ? (isRu ? "Анонс" : "Event") : (isRu ? "Занятие" : "Class")}
                    </span>
                    <p className="mt-0.5 text-[11px] text-ink/40">
                      {fmtDate(item.date, isRu)}, {fmtWeekday(item.date, isRu)}, {fmtTime(item.date)}
                    </p>
                    <p className="mt-1 font-display text-[18px] leading-snug text-ink">{item.title}</p>
                  </div>
                  <div className="shrink-0 flex gap-3 pt-0.5">
                    {item.price && (
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.1em] text-ink/30">{isRu ? "Цена" : "Price"}</p>
                        <p className="text-sm text-ink/70">{item.price}</p>
                      </div>
                    )}
                    {item.ageGroup && (
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.1em] text-ink/30">{isRu ? "Возраст" : "Age"}</p>
                        <p className="text-sm text-ink/70">{item.ageGroup}</p>
                      </div>
                    )}
                    {item.available !== null && (
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.1em] text-ink/30">{isRu ? "Мест" : "Spots"}</p>
                        <p className={`text-sm ${item.isFull ? "text-red-400" : "text-ink/70"}`}>
                          {item.isFull ? (isRu ? "Нет" : "Full") : item.available}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Десктопная версия — 4 колонки как было */}
                <div className="hidden md:grid md:grid-cols-[80px_180px_1fr_auto] md:items-center md:gap-x-8">
                  <span className={`text-[9px] uppercase tracking-[0.14em] font-medium ${item.kind === "event" ? "text-accent" : "text-ink/30"}`}>
                    {item.kind === "event" ? (isRu ? "Анонс" : "Event") : (isRu ? "Занятие" : "Class")}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-ink/80">{fmtDate(item.date, isRu)}</p>
                    <p className="text-[11px] text-ink/40">{fmtWeekday(item.date, isRu)}, {fmtTime(item.date)}</p>
                  </div>
                  <p className="font-display text-[19px] leading-snug text-ink">{item.title}</p>
                  <div className="flex items-center gap-5 justify-end">
                    {item.price && (
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.1em] text-ink/30">{isRu ? "Цена" : "Price"}</p>
                        <p className="text-sm text-ink/60">{item.price}</p>
                      </div>
                    )}
                    {item.ageGroup && (
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.1em] text-ink/30">{isRu ? "Возраст" : "Age"}</p>
                        <p className="text-sm text-ink/60">{item.ageGroup}</p>
                      </div>
                    )}
                    {item.available !== null && (
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.1em] text-ink/30">{isRu ? "Мест" : "Spots"}</p>
                        <p className={`text-sm ${item.isFull ? "text-red-400" : "text-ink/60"}`}>
                          {item.isFull ? (isRu ? "Нет" : "Full") : item.available}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Занятия — карусель ── */}
      {services.length > 0 && (
        <section className="border-b border-ink/10 py-12 md:py-16">
          <div className="px-6 md:px-8 lg:px-12">
            <div className="mb-8 flex items-baseline justify-between">
              <p className="caps text-ink/40">{h.classesLabel}</p>
              <Link href="/classes" className="caps text-xs text-ink/40 transition hover:text-ink">
                {h.classesAll}
              </Link>
            </div>
            <ServicesCarousel items={services} />
          </div>
        </section>
      )}

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
          <div className="flex flex-col justify-center px-8 py-16 md:px-16 lg:px-20 lg:py-24">
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
