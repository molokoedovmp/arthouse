import { Container } from "../../components/Container";
import { BookingModal } from "../../components/BookingModal";
import { EventBookingModal } from "../../components/EventBookingModal";
import { ScheduleImage } from "../../components/ScheduleImage";
import pool from "../../lib/db";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Расписание",
  description: "Единое расписание занятий и анонсов мероприятий художественной мастерской Арт Хаус.",
};

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

function fmtTimeOnly(dt: Date) {
  return fmtTime(dt);
}

function fmtNumberOrUnlimited(value: number | null, lang: "ru" | "en") {
  if (value === null) return lang === "ru" ? "Безлимит" : "Unlimited";
  return String(value);
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/10 bg-paper px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.15em] text-ink/35">{label}</p>
      <p className="mt-1 text-sm leading-snug text-ink/70">{value}</p>
    </div>
  );
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

  const servicesRes = await pool.query<ScheduleRow>(
    `SELECT s.id, s.start_datetime, s.max_participants, s.status,
            s.title, s.description, s.image, s.age_group, s.duration_minutes, s.price, s.type,
            COUNT(b.id) FILTER (WHERE b.status != 'cancelled') AS booked
     FROM schedule s
     LEFT JOIN bookings b ON b.schedule_id = s.id
     WHERE s.start_datetime >= NOW() AND s.status = 'active'
     GROUP BY s.id
     ORDER BY s.start_datetime`
  );

  const eventsRes = await pool.query<EventRow>(
    `SELECT e.id AS event_id, e.title, e.description, e.event_date, e.image, e.max_participants,
            e.type, e.age_group, e.duration_minutes, e.price,
            COUNT(eb.id) FILTER (WHERE eb.status != 'cancelled') AS booked
     FROM events e
     LEFT JOIN event_bookings eb ON eb.event_id = e.id
     WHERE e.event_date >= NOW()
     GROUP BY e.id
     ORDER BY e.event_date`
  );

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
            <div className="divide-y divide-ink/10 border-y border-ink/10">
              {timeline.map((item) => (
                <article
                  key={`${item.kind}-${item.id}`}
                  className={`grid gap-6 p-6 md:p-8 lg:gap-8 ${
                    item.image ? "lg:grid-cols-[230px_1fr_240px]" : "lg:grid-cols-[230px_1fr]"
                  }`}
                >
                  <div>
                    <p className="caps text-ink/35">{item.kind === "service" ? serviceLabel : eventLabel}</p>
                    <p className="mt-2 font-display text-[24px] leading-tight md:text-[28px]">
                      {fmtDate(item.startsAt, lang)}
                    </p>
                    <p className="mt-2 text-sm text-ink/55">
                      {item.kind === "service"
                        ? `${isRu ? "Время" : "Time"}: ${item.timeLabel}`
                        : `${isRu ? "Начало" : "Starts"}: ${item.timeLabel}`}
                    </p>
                  </div>

                  <div>
                    <h2 className="font-display text-[28px] leading-tight md:text-[34px]">{item.title}</h2>
                    {item.description && (
                      <p className="mt-3 text-[15px] leading-relaxed text-ink/60">{item.description}</p>
                    )}

                    <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                      {item.ageGroup && <Field label={isRu ? "Возраст" : "Age"} value={item.ageGroup} />}
                      {item.durationMinutes && <Field label={isRu ? "Длительность" : "Duration"} value={item.durationMinutes} />}
                      {item.price && <Field label={isRu ? "Стоимость" : "Price"} value={item.price} />}
                      {item.maxParticipants !== null && (
                        <>
                          <Field label={isRu ? "Мест всего" : "Total spots"} value={String(item.maxParticipants)} />
                          <Field label={isRu ? "Забронировано" : "Booked"} value={String(item.booked)} />
                          <Field label={isRu ? "Свободно" : "Available"} value={fmtNumberOrUnlimited(item.availableSpots, lang)} />
                        </>
                      )}
                    </div>

                    <div className="mt-5">
                      {item.kind === "service" ? (
                        <BookingModal
                          scheduleId={item.id}
                          title={item.title}
                          time={item.timeLabel}
                          availableSpots={item.availableSpots}
                        />
                      ) : (
                        <EventBookingModal
                          eventId={item.id}
                          title={item.title}
                          availableSpots={item.availableSpots}
                        />
                      )}
                    </div>
                  </div>

                  {item.image ? (
                    <ScheduleImage src={item.image} alt={item.title} />
                  ) : null}
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
