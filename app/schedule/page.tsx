import { Container } from "../../components/Container";
import { BookingModal } from "../../components/BookingModal";
import { EventBookingModal } from "../../components/EventBookingModal";
import pool from "../../lib/db";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";
import { createPageMetadata } from "../../lib/seo";
import { MobileCardImage } from "../../components/MobileCardImage";

export const revalidate = 30;

export const metadata = createPageMetadata({
  title: "Расписание занятий и мероприятий",
  description: "Актуальное расписание занятий, мастер-классов и творческих мероприятий АртХаус в Истре. Выберите дату и запишитесь онлайн.",
  path: "/schedule",
  keywords: ["расписание арт-студии", "мастер-классы Истра", "запись на рисование"],
});

type ScheduleRow = {
  id: number;
  start_datetime: Date;
  max_participants: number | null;
  status: string;
  title: string;
  description: string | null;
  image: string | null;
  age_group: string | null;
  duration_minutes: string | null;
  price: string | null;
  type: string | null;
  booked: string;
};

type EventRow = {
  event_id: number;
  title: string;
  description: string | null;
  event_date: Date;
  image: string | null;
  max_participants: number | null;
  booked: string;
  type: string | null;
  age_group: string | null;
  duration_minutes: string | null;
  price: string | null;
};

const TZ = "Europe/Moscow";

function fmtTime(dt: Date) {
  return dt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
}

function fmtRange(dt: Date) {
  return fmtTime(dt);
}

function fmtDate(dt: Date, lang: "ru" | "en") {
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(dt);
}

function fmtMobileDate(dt: Date, lang: "ru" | "en") {
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(dt);
}

function fmtTimeOnly(dt: Date) {
  return fmtTime(dt);
}

function fmtNumberOrUnlimited(value: number | null, lang: "ru" | "en") {
  if (value === null) return lang === "ru" ? "Безлимит" : "Unlimited";
  return String(value);
}

export default async function SchedulePage() {
  const lang = await getLang();
  const t = getT(lang);
  const s = t.schedule;
  const isRu = lang === "ru";
  const serviceLabel = isRu ? "Занятие" : "Class";
  const eventLabel = isRu ? "Анонс мероприятия" : "Event";
  const mergedSubtitle = isRu
    ? "Единое расписание занятий и анонсов мероприятий в хронологическом порядке."
    : "Unified schedule of classes and event announcements in chronological order.";
  const noItemsText = isRu
    ? "В расписании пока нет активных занятий и мероприятий."
    : "There are no active classes or events in the schedule yet.";

  const [servicesRes, eventsRes] = await Promise.all([
    pool.query<ScheduleRow>(
      `SELECT s.id, s.start_datetime, s.max_participants, s.status,
              s.title, s.description, s.image, s.age_group, s.duration_minutes, s.price, s.type,
              COUNT(b.id) FILTER (WHERE b.status != 'cancelled') AS booked
       FROM schedule s
       LEFT JOIN bookings b ON b.schedule_id = s.id
       WHERE s.start_datetime >= NOW() AND s.status = 'active'
       GROUP BY s.id ORDER BY s.start_datetime`
    ),
    pool.query<EventRow>(
      `SELECT e.id AS event_id, e.title, e.description, e.event_date, e.image, e.max_participants,
              e.type, e.age_group, e.duration_minutes, e.price,
              COUNT(eb.id) FILTER (WHERE eb.status != 'cancelled') AS booked
       FROM events e
       LEFT JOIN event_bookings eb ON eb.event_id = e.id
       WHERE e.event_date >= NOW()
       GROUP BY e.id ORDER BY e.event_date`
    ),
  ]);

  const serviceItems = servicesRes.rows.map((row) => {
    const booked = Number(row.booked);
    const availableSpots = row.max_participants !== null ? row.max_participants - booked : null;
    const start = new Date(row.start_datetime);

    return {
      kind: "service" as const,
      id: row.id,
      startsAt: start,
      title: row.title,
      description: row.description ?? "",
      timeLabel: fmtRange(start),
      image: row.image ?? null,
      status: row.status,
      type: row.type ?? "",
      ageGroup: row.age_group ?? "",
      durationMinutes: row.duration_minutes ?? "",
      price: row.price ?? "",
      maxParticipants: row.max_participants,
      booked,
      availableSpots,
    };
  });

  const eventItems = eventsRes.rows.map((row) => {
    const booked = Number(row.booked);
    const availableSpots = row.max_participants !== null ? row.max_participants - booked : null;
    const start = new Date(row.event_date);

    return {
      kind: "event" as const,
      id: row.event_id,
      startsAt: start,
      title: row.title,
      description: row.description ?? "",
      timeLabel: fmtTimeOnly(start),
      image: row.image ?? null,
      maxParticipants: row.max_participants,
      type: row.type ?? "",
      ageGroup: row.age_group ?? "",
      durationMinutes: row.duration_minutes ?? "",
      price: row.price ?? "",
      booked,
      availableSpots,
    };
  });

  const timeline = [...serviceItems, ...eventItems].sort(
    (a, b) => a.startsAt.getTime() - b.startsAt.getTime()
  );
  const hasSingleCard = timeline.length === 1;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink/10 py-14">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="85%" cy="-10%" r="340" fill="#C8DDD9" fillOpacity="0.45" />
          <circle cx="-5%" cy="120%" r="280" fill="#EDD5CB" fillOpacity="0.4" />
          <ellipse cx="75%" cy="110%" rx="220" ry="180" fill="#E8DABC" fillOpacity="0.35" />
          <circle cx="60%" cy="40%" r="120" fill="#D9D0E8" fillOpacity="0.25" />
          <ellipse cx="15%" cy="0%" rx="180" ry="100" fill="#EAD8CC" fillOpacity="0.3" />
        </svg>
        <Container>
          <div className="relative">
            <p className="caps text-ink/40">{s.org}</p>
            <h1 className="mt-4 font-display text-[52px] leading-tight md:text-[72px]">{s.title}</h1>
            <p className="mt-5 text-[17px] text-ink/60">{mergedSubtitle}</p>
          </div>
        </Container>
      </section>

      <section className="py-10 md:py-12">
        <Container>
          {timeline.length === 0 ? (
            <div className="border-y border-ink/10 py-16 text-center">
              <p className="font-display text-[24px] text-ink/30">{noItemsText}</p>
            </div>
          ) : (
            <div className={`grid gap-2 md:grid-cols-2 md:gap-5 xl:grid-cols-3 ${hasSingleCard ? "grid-cols-1" : "grid-cols-2"}`}>
              {timeline.map((item) => (
                <article
                  key={`${item.kind}-${item.id}`}
                  className="flex min-w-0 flex-col border border-ink/10 bg-white"
                >
                  {item.image ? (
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-stone">
                      <MobileCardImage src={item.image} alt={item.title} />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-stone">
                      <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#c8ddd9]/70" />
                      <div className="absolute -bottom-8 -left-5 h-24 w-24 rounded-full bg-[#edd5cb]/70" />
                    </div>
                  )}

                  <div className={`min-w-0 md:px-5 md:pt-4 ${hasSingleCard ? "px-5 pt-4" : "px-2 pt-1.5"}`}>
                    <p className={`${hasSingleCard ? "text-[11px]" : "text-[8px]"} uppercase leading-none tracking-[0.12em] text-ink/40 md:text-[10px] md:leading-normal`}>{item.kind === "service" ? serviceLabel : eventLabel}</p>
                    <div className={`mt-2 items-baseline justify-between gap-3 md:hidden ${hasSingleCard ? "flex" : "block"}`}>
                      <p className={`${hasSingleCard ? "text-[18px]" : "text-[12px]"} font-display font-semibold leading-tight text-ink`}>
                        {fmtMobileDate(item.startsAt, lang)}
                      </p>
                      <p className={`${hasSingleCard ? "text-[15px]" : "mt-1 text-[11px]"} shrink-0 font-medium leading-none text-ink/65`}>
                        {item.kind === "service"
                          ? `${isRu ? "Время" : "Time"}: ${item.timeLabel}`
                          : `${isRu ? "Начало" : "Starts"}: ${item.timeLabel}`}
                      </p>
                    </div>
                    <p className="mt-2 hidden font-display text-[28px] leading-tight md:block">
                      {fmtDate(item.startsAt, lang)}
                    </p>
                    <p className="mt-2 hidden text-sm text-ink/55 md:block">
                      {item.kind === "service"
                        ? `${isRu ? "Время" : "Time"}: ${item.timeLabel}`
                        : `${isRu ? "Начало" : "Starts"}: ${item.timeLabel}`}
                    </p>
                  </div>

                  <div className={`flex min-h-0 min-w-0 flex-1 flex-col md:px-5 md:pb-5 md:pt-3 ${hasSingleCard ? "px-5 pb-5 pt-4" : "px-2 pb-2 pt-1.5"}`}>
                    <h2 className={`${hasSingleCard ? "text-[27px]" : "text-[17px]"} font-display font-semibold leading-tight text-ink md:text-[30px] md:font-normal`}>{item.title}</h2>
                    {item.description && (
                      <p className="mt-2 text-[12px] leading-relaxed text-ink/60 md:mt-3 md:text-[15px]">{item.description}</p>
                    )}

                    {(item.ageGroup || item.durationMinutes || item.price) && (
                      <dl className={`mt-3 text-ink/60 md:grid md:grid-cols-3 md:gap-3 md:space-y-0 md:border-y md:border-ink/10 md:py-3 md:text-[13px] ${hasSingleCard ? "grid grid-cols-3 gap-3 border-y border-ink/10 py-3 text-[13px]" : "space-y-0.5 text-[10px] leading-tight"}`}>
                        {item.ageGroup && (
                          <div className={`${hasSingleCard ? "min-w-0" : "flex gap-1"} md:block md:min-w-0`}>
                            <dt className={`${hasSingleCard ? "text-[9px] uppercase tracking-[0.08em]" : ""} text-ink/35 md:text-[9px] md:uppercase md:tracking-[0.08em]`}>{isRu ? "Возраст:" : "Age:"}</dt>
                            <dd className={`${hasSingleCard ? "mt-1 text-[14px]" : ""} font-medium text-ink/70 md:mt-1 md:text-[14px]`}>{item.ageGroup}</dd>
                          </div>
                        )}
                        {item.durationMinutes && (
                          <div className={`${hasSingleCard ? "min-w-0" : "flex gap-1"} md:block md:min-w-0`}>
                            <dt className={`${hasSingleCard ? "text-[9px] uppercase tracking-[0.08em]" : ""} text-ink/35 md:text-[9px] md:uppercase md:tracking-[0.08em]`}>{isRu ? "Длительность:" : "Duration:"}</dt>
                            <dd className={`${hasSingleCard ? "mt-1 text-[14px]" : ""} font-medium text-ink/70 md:mt-1 md:text-[14px]`}>{item.durationMinutes}</dd>
                          </div>
                        )}
                        {item.price && (
                          <div className={`${hasSingleCard ? "min-w-0" : "flex gap-1"} md:block md:min-w-0`}>
                            <dt className={`${hasSingleCard ? "text-[9px] uppercase tracking-[0.08em]" : ""} text-ink/35 md:text-[9px] md:uppercase md:tracking-[0.08em]`}>{isRu ? "Стоимость:" : "Price:"}</dt>
                            <dd className={`${hasSingleCard ? "mt-1 text-[14px]" : ""} font-medium text-ink/70 md:mt-1 md:text-[14px]`}>{item.price}</dd>
                          </div>
                        )}
                      </dl>
                    )}

                    <div className="mt-auto pt-3 md:pt-5">
                      {item.kind === "service" ? (
                        <BookingModal
                          scheduleId={item.id}
                          title={item.title}
                          time={item.timeLabel}
                          availableSpots={item.availableSpots}
                          largeOnMobile={hasSingleCard}
                        />
                      ) : (
                        <EventBookingModal
                          eventId={item.id}
                          title={item.title}
                          availableSpots={item.availableSpots}
                          largeOnMobile={hasSingleCard}
                        />
                      )}
                    </div>
                  </div>

                </article>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-6 border-t border-ink/10 pt-12 md:mt-10 md:flex-row md:items-end md:justify-between">
            <p className="font-display text-[22px] text-ink/50 md:text-[26px]">{s.ctaText}</p>
            <a href="/contact" className="w-fit bg-ink px-8 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80">
              {t.common.writeUs}
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
