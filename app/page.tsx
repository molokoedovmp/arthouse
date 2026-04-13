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

const daysOrder = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
const DAYS_RU = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

function fmtTime(dt: Date, durationMin: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const end = new Date(dt.getTime() + durationMin * 60000);
  return `${pad(dt.getHours())}:${pad(dt.getMinutes())} – ${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

export default async function HomePage() {
  const lang = await getLang();
  const t = getT(lang);
  const h = t.home;

  const scheduleRes = await pool.query<{
    start_datetime: Date;
    service_title: string;
    age_group: string;
    duration_minutes: number;
  }>(
    `SELECT s.start_datetime, sv.title AS service_title, sv.age_group, sv.duration_minutes
     FROM schedule s
     JOIN services sv ON s.service_id = sv.id
     WHERE s.start_datetime >= NOW() AND s.status = 'active'
     ORDER BY s.start_datetime
     LIMIT 50`
  );

  const scheduleByDay: Record<string, Array<{ title: string; time: string; age: string }>> = {};
  const seenSlots = new Set<string>();
  for (const row of scheduleRes.rows) {
    const dt = new Date(row.start_datetime);
    const dayName = DAYS_RU[dt.getDay()];
    const slotKey = `${dt.getDay()}-${dt.getHours()}-${dt.getMinutes()}-${row.service_title}`;
    if (seenSlots.has(slotKey)) continue;
    seenSlots.add(slotKey);
    if (!scheduleByDay[dayName]) scheduleByDay[dayName] = [];
    scheduleByDay[dayName].push({
      title: row.service_title,
      time: fmtTime(dt, row.duration_minutes ?? 90),
      age: row.age_group ?? "",
    });
  }

  type ScheduleEntry = { day: string; title: string; time: string; age: string };
  const scheduleItems: ScheduleEntry[] = [];
  for (const day of daysOrder) {
    const slots = scheduleByDay[day];
    if (slots) {
      for (const slot of slots) {
        scheduleItems.push({ day, ...slot });
      }
    }
  }

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

  const servicesRes = await pool.query<{
    id: number;
    title: string;
    description: string;
    type: string;
  }>(
    `SELECT id, title, description, type FROM services ORDER BY id LIMIT 4`
  );
  const services = servicesRes.rows;

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
          {/* Text */}
          <div className="flex flex-col justify-center px-6 py-14 md:px-12 lg:px-20">
            <p className="caps text-sm text-ink/40">{h.heroLink}</p>
            <h1 className="mt-4 font-display text-[40px] leading-[1.1] md:text-[52px] lg:text-[64px]">
              {lang === "en" ? (
                <>ArtHouse<br />Creative Territory<br />of Olga Smirnova</>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-[#ef4444] via-[#f59e0b] to-[#3b82f6] bg-clip-text text-transparent">
                    АртХаус
                  </span>
                  <br />
                  Территория творчества<br />Ольги Смирновой
                </>
              )}
            </h1>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink/50">{h.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/classes"
                className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80"
              >
                {t.common.register}
              </Link>
              <Link
                href="/about"
                className="border border-ink/20 px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink transition hover:border-ink"
              >
                {lang === "ru" ? "О проекте" : "About"}
              </Link>
            </div>
          </div>
          {/* Photo */}
          <div className="relative h-[60vw] md:h-full" style={{ minHeight: "400px" }}>
            <HeroCarousel images={heroImages} alt="Арт Хаус" />
          </div>
        </div>
      </section>

      {/* ── Занятия + Расписание ── */}
      <section className="border-t border-ink/10">
        <div className="w-full">
          <div className="border-b border-ink/10">
            <div className="grid gap-6 px-6 py-7 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
              <div className="max-w-3xl">
                <p className="caps text-[#2c6f84]">
                  {lang === "ru" ? "Весенняя акция" : "Spring Offer"}
                </p>

                <h2 className="mt-3 font-display text-[34px] leading-[1.05] text-ink sm:text-[42px]">
                  {lang === "ru" ? (
                    <>
                      Рисование и живопись
                      <br />
                      со скидкой 20%
                    </>
                  ) : (
                    <>
                      Drawing and painting
                      <br />
                      with 20% off
                    </>
                  )}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
                  {lang === "ru"
                    ? "Для детей и взрослых: мастер-классы, групповые занятия и творческий коворкинг в атмосфере уютной мастерской."
                    : "For children and adults: workshops, group classes and creative coworking in a warm studio atmosphere."}
                </p>
                <p className="mt-3 text-sm font-medium text-ink">
                  {lang === "ru" ? "Скидка действует на все занятия." : "The discount applies to all classes."}
                </p>
              </div>

              <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-[44%_56%_63%_37%/43%_41%_59%_57%] bg-[#c93131] shadow-soft md:mx-0 md:h-36 md:w-36">
                <span className="font-display text-[46px] leading-none text-white">20%</span>
                <span className="absolute -right-3 bottom-5 h-4 w-4 rounded-full bg-[#c93131]" />
                <span className="absolute left-3 -top-3 h-5 w-5 rounded-full bg-[#c93131]" />
                <span className="absolute -bottom-4 left-5 h-6 w-6 rounded-full bg-[#c93131]" />
                <span className="absolute -top-7 right-1 rotate-[-9deg] text-[12px] uppercase tracking-[0.18em] text-ink/70">
                  {lang === "ru" ? "скидка" : "offer"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid border-b border-ink/10 lg:grid-cols-[1fr_320px] lg:items-stretch">

            {/* Занятия — левая колонка */}
            <div className="flex flex-col border-b border-ink/10 lg:border-b-0 lg:border-r lg:border-ink/10">
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5 lg:px-8">
                <p className="caps text-ink/40">{h.classesLabel}</p>
                <Link href="/classes" className="caps text-ink/40 transition hover:text-ink">
                  {h.classesAll}
                </Link>
              </div>
              <div className="grid flex-1 md:grid-cols-2">
                {services.length === 0 ? (
                  <div className="col-span-2 p-8 text-sm text-ink/40">{h.classesEmpty}</div>
                ) : (
                  services.map((item, index) => (
                    <Link
                      key={item.id}
                      href="/classes"
                      className="group border-b border-r border-ink/10 p-8 transition-colors hover:bg-stone/50 lg:p-10"
                    >
                      <div className="flex items-start justify-between">
                        <p className="caps text-accent">{item.type}</p>
                        <span className="font-display text-[36px] leading-none text-ink/10 transition group-hover:text-ink/20">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-[24px] leading-tight">{item.title}</h3>
                      {item.description && <p className="mt-2 text-sm text-ink/60">{item.description}</p>}
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Расписание — правая колонка */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
                <p className="caps text-ink/40">{h.scheduleLabel}</p>
                <Link href="/schedule" className="caps text-ink/40 transition hover:text-ink">
                  {h.scheduleFull}
                </Link>
              </div>
              <div className="flex-1 divide-y divide-ink/10">
                {scheduleItems.length > 0 ? scheduleItems.map((item, index) => (
                  <div key={index} className="px-6 py-4">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-ink/35">
                      {t.schedule.daysLong[item.day] ?? item.day}
                    </p>
                    <p className="mt-1 font-display text-[17px] leading-snug">{item.title}</p>
                    <p className="mt-0.5 text-xs text-ink/50">{item.time}{item.age ? ` · ${item.age}` : ""}</p>
                  </div>
                )) : (
                  <div className="px-6 py-8 text-sm text-ink/40">
                    {h.scheduleEmpty}
                  </div>
                )}
              </div>
              <div className="border-t border-ink/10 p-6">
                <Link
                  href="/schedule"
                  className="block w-full bg-ink py-3 text-center text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80"
                >
                  {t.common.register}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Каталог картин ── */}
      <section className="border-t border-ink/10">
        <div className="grid lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <div className="flex flex-col justify-center px-8 py-16 md:px-16 lg:px-20 lg:py-24">
            <p className="caps text-ink/40">{h.catalogLabel}</p>
            <h2 className="mt-3 font-display text-3xl italic leading-tight lg:text-4xl">
              {h.catalogTitle}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/60">{h.catalogText}</p>
            <Link
              href="/paintings"
              className="mt-6 w-fit text-xs uppercase tracking-[0.2em] text-ink/50 transition hover:text-ink"
            >
              {h.catalogLink}
            </Link>
          </div>
          <div className="relative aspect-square overflow-hidden bg-stone">
            <Image src="/images/IMG_8891.jpg" alt="Арт Хаус студия" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── Галерея учеников ── */}
      <section className="border-t border-ink/10">
        <div className="grid lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <div className="relative aspect-square overflow-hidden bg-stone lg:order-first">
            <Image src="/images/gaallery.jpg" alt="Галерея работ" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center px-8 py-16 md:px-16 lg:px-20 lg:py-24">
            <p className="caps text-ink/40">{h.galleryLabel}</p>
            <h2 className="mt-3 font-display text-3xl italic leading-tight lg:text-4xl">
              {h.galleryTitle}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/60">{h.galleryText}</p>
            <Link
              href="/gallery"
              className="mt-6 w-fit text-xs uppercase tracking-[0.2em] text-ink/50 transition hover:text-ink"
            >
              {h.galleryLink}
            </Link>
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
          <h2 className="font-display text-[32px] leading-tight md:text-[40px]">
            {t.contact.heading}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/50">
            {lang === "ru"
              ? "Напишите нам, если хотите записаться на занятие, узнать о мероприятиях или задать вопрос."
              : "Get in touch to book a class, learn about upcoming events or ask a question."}
          </p>
          <Link
            href="/contact"
            className="mt-8 bg-ink px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80"
          >
            {t.common.writeUs}
          </Link>
        </div>
      </section>

    </div>
  );
}
