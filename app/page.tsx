import Image from "next/image";
import Link from "next/link";
import pool from "../lib/db";
import { PaintingsShowcase } from "@/components/PaintingsShowcase";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Главная",
  description: "Художественная мастерская, занятия и авторские картины.",
};

const daysOrder = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
const DAYS_RU = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

function fmtTime(dt: Date, durationMin: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const end = new Date(dt.getTime() + durationMin * 60000);
  return `${pad(dt.getHours())}:${pad(dt.getMinutes())} – ${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

export default async function HomePage() {
  // Schedule — group all active events by day of week, deduplicate same slot in multiple weeks
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

  // Group by day of week, dedup same time+title across weeks
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

  // Build flat ordered list by Mon–Sun
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

  // Latest 8 paintings
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

  // Services from DB (first 4)
  const servicesRes = await pool.query<{
    id: number;
    title: string;
    description: string;
    type: string;
  }>(
    `SELECT id, title, description, type FROM services ORDER BY id LIMIT 4`
  );
  const services = servicesRes.rows;

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="flex flex-col border-b border-ink/10"
        style={{ minHeight: "calc(100vh - 84px)" }}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden bg-stone">
          <Image
            src="/images/25.jpg"
            alt="Арт Хаус — авторская живопись Ольги Смирновой"
            fill
            priority
            className="object-cover object-top"
          />
        </div>
        <div className="mx-auto w-full max-w-[600px] shrink-0 px-6 py-5 text-center lg:py-6">
          <h1 className="font-display text-[30px] leading-snug md:text-[38px] lg:text-[44px]">
            Художественная мастерская<br />Ольги Смирновой
          </h1>
          <p className="mt-2 text-[13px] text-ink/50">
            Камерные занятия, мастер-классы и авторская живопись
          </p>
          <Link
            href="/about"
            className="mt-3 inline-block text-[13px] text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-ink"
          >
            О проекте ·
          </Link>
        </div>
      </section>

      {/* ── Занятия + Расписание ── */}
      <section className="border-t border-ink/10">
        <div className="w-full">
          <div className="grid border-b border-ink/10 lg:grid-cols-[1fr_320px] lg:items-stretch">

            {/* Занятия — левая колонка */}
            <div className="flex flex-col border-b border-ink/10 lg:border-b-0 lg:border-r lg:border-ink/10">
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5 lg:px-8">
                <p className="caps text-ink/40">Занятия</p>
                <Link href="/classes" className="caps text-ink/40 transition hover:text-ink">
                  Все направления →
                </Link>
              </div>
              <div className="grid flex-1 md:grid-cols-2">
                {services.length === 0 ? (
                  <div className="col-span-2 p-8 text-sm text-ink/40">Занятия скоро будут добавлены</div>
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
                <p className="caps text-ink/40">Расписание</p>
                <Link href="/schedule" className="caps text-ink/40 transition hover:text-ink">
                  Полное →
                </Link>
              </div>
              <div className="flex-1 divide-y divide-ink/10">
                {scheduleItems.length > 0 ? scheduleItems.map((item, index) => (
                  <div key={index} className="px-6 py-4">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-ink/35">{item.day}</p>
                    <p className="mt-1 font-display text-[17px] leading-snug">{item.title}</p>
                    <p className="mt-0.5 text-xs text-ink/50">{item.time}{item.age ? ` · ${item.age}` : ""}</p>
                  </div>
                )) : (
                  <div className="px-6 py-8 text-sm text-ink/40">
                    Расписание скоро будет добавлено
                  </div>
                )}
              </div>
              <div className="border-t border-ink/10 p-6">
                <Link
                  href="/contact"
                  className="block w-full bg-ink py-3 text-center text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80"
                >
                  Записаться
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
            <p className="caps text-ink/40">Каталог</p>
            <h2 className="mt-3 font-display text-3xl italic leading-tight lg:text-4xl">
              Авторские картины
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/60">
              Коллекция работ Ольги Смирновой — живопись маслом, акварель и графика.
              Каждая картина передаёт настроение, свет и тишину момента.
            </p>
            <Link
              href="/paintings"
              className="mt-6 w-fit text-xs uppercase tracking-[0.2em] text-ink/50 transition hover:text-ink"
            >
              Смотреть каталог →
            </Link>
          </div>
          <div className="relative aspect-square overflow-hidden bg-stone">
            <Image src="/images/catalog_pic.jpg" alt="Каталог картин" fill className="object-cover" />
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
            <p className="caps text-ink/40">Галерея</p>
            <h2 className="mt-3 font-display text-3xl italic leading-tight lg:text-4xl">
              Работы учеников
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/60">
              Наши ученики создают удивительные работы с первых занятий.
              Здесь собраны лучшие из них — от первых набросков до завершённых картин.
            </p>
            <Link
              href="/gallery"
              className="mt-6 w-fit text-xs uppercase tracking-[0.2em] text-ink/50 transition hover:text-ink"
            >
              Открыть галерею →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Картины ── */}
      <section className="border-t border-ink/10">
        <PaintingsShowcase paintings={paintings} />
      </section>

      {/* ── О мастерской ── */}
      <section className="border-b border-t border-ink/10">
        <div className="w-full">
          <div className="grid lg:grid-cols-[420px_1fr] lg:items-stretch">
            <div className="relative min-h-[320px] overflow-hidden bg-stone border-b border-ink/10 lg:min-h-0 lg:border-b-0 lg:border-r lg:border-ink/10">
              <Image
                src="/images/IMG_8891.jpg"
                alt="Арт Хаус студия"
                fill
                className="object-cover"
              />
            </div>
            <div className="px-6 py-12 lg:px-12 lg:py-16">
              <p className="caps text-ink/40">О мастерской</p>
              <h2 className="mt-3 font-display text-[36px] leading-tight md:text-[48px]">
                Тонкая работа с формой и наблюдением
              </h2>
              <div className="mt-6 space-y-4 text-[16px] text-ink/70">
                <p>
                  Мы строим занятия вокруг медленного наблюдения, работы с материалами и бережного отношения к процессу.
                  Программа подходит для детей и взрослых, включая занятия на английском языке и свободный коворкинг.
                </p>
                <p>
                  В мастерской проходят камерные выставки и события — живые встречи, где можно почувствовать атмосферу
                  искусства и общения.
                </p>
              </div>
              <Link
                href="/about"
                className="mt-8 inline-block border border-ink/20 px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink transition hover:border-ink"
              >
                О проекте
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
