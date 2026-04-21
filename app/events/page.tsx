import Image from "next/image";
import Link from "next/link";
import { Container } from "../../components/Container";
import { EventBookingModal } from "../../components/EventBookingModal";
import pool from "../../lib/db";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Анонсы мероприятий",
  description: "Анонсы мероприятий и новости территории творчества АртХаус.",
};

const TZ = "Europe/Moscow";

function fmtDay(dt: Date) {
  return dt.toLocaleDateString("ru-RU", { day: "2-digit", timeZone: TZ });
}
function fmtMonthYear(dt: Date, lang: "ru" | "en") {
  return dt.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    month: "long",
    year: "numeric",
    timeZone: TZ,
  });
}
function fmtWeekday(dt: Date, lang: "ru" | "en") {
  return dt.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    weekday: "long",
    timeZone: TZ,
  });
}
function fmtTime(dt: Date) {
  return dt.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
}

export default async function EventsPage() {
  const lang = await getLang();
  const t = getT(lang);
  const isRu = lang === "ru";

  const res = await pool.query<{
    id: number;
    title: string;
    description: string;
    event_date: Date;
    image: string;
    max_participants: number | null;
    booked: string;
    age_group: string | null;
    duration_minutes: string | null;
    price: string | null;
  }>(
    `SELECT e.id, e.title, e.description, e.event_date, e.image, e.max_participants,
            e.age_group, e.duration_minutes, e.price,
            COUNT(eb.id) AS booked
     FROM events e
     LEFT JOIN event_bookings eb ON eb.event_id = e.id
     WHERE e.event_date >= NOW()
     GROUP BY e.id
     ORDER BY e.event_date ASC`
  );
  const events = res.rows;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-ink/10 py-14 lg:py-20">
        <Container>
          <p className="caps text-ink/40">{isRu ? "АртХаус" : "ArtHouse"}</p>
          <h1 className="mt-4 font-display text-[52px] leading-tight md:text-[72px]">
            {t.events.title}
          </h1>
          <p className="mt-4 max-w-lg text-[17px] text-ink/55">
            {isRu
              ? "Мастер-классы, выставки и творческие встречи — записывайтесь заранее."
              : "Workshops, exhibitions and creative meetups — sign up in advance."}
          </p>
        </Container>
      </section>

      {/* Список */}
      <section className="py-12 lg:py-16">
        <Container>
          {events.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-[24px] text-ink/25">{t.events.noItems}</p>
            </div>
          ) : (
            <div className="space-y-px border border-ink/10">
              {events.map((event) => {
                const dt = new Date(event.event_date);
                const booked = parseInt(event.booked) || 0;
                const availableSpots =
                  event.max_participants !== null
                    ? event.max_participants - booked
                    : null;
                const isFull = availableSpots !== null && availableSpots <= 0;
                const hasMeta = event.age_group || event.duration_minutes || event.price;

                return (
                  <article
                    key={event.id}
                    className="group grid lg:grid-cols-[1fr_420px]"
                  >
                    {/* Левая часть — контент */}
                    <div className="flex flex-col justify-between border-b border-ink/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
                      {/* Дата */}
                      <div className="flex items-start gap-5">
                        <div className="shrink-0 text-center">
                          <p className="font-display text-[52px] leading-none text-ink/15">
                            {fmtDay(dt)}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink/40">
                            {fmtMonthYear(dt, lang)}
                          </p>
                        </div>
                        <div className="pt-1.5">
                          <p className="text-[11px] uppercase tracking-[0.12em] text-ink/40">
                            {fmtWeekday(dt, lang)}, {fmtTime(dt)}
                          </p>
                          <h2 className="mt-2 font-display text-[26px] leading-tight md:text-[32px]">
                            {event.title}
                          </h2>
                        </div>
                      </div>

                      {/* Описание */}
                      {event.description && (
                        <p className="mt-5 text-[15px] leading-relaxed text-ink/60">
                          {event.description}
                        </p>
                      )}

                      {/* Мета */}
                      {hasMeta && (
                        <div className="mt-6 flex flex-wrap gap-4">
                          {event.age_group && (
                            <div className="border border-ink/10 px-3 py-2">
                              <p className="text-[9px] uppercase tracking-[0.15em] text-ink/35">
                                {t.classes.age}
                              </p>
                              <p className="mt-0.5 text-sm text-ink/70">{event.age_group}</p>
                            </div>
                          )}
                          {event.duration_minutes && (
                            <div className="border border-ink/10 px-3 py-2">
                              <p className="text-[9px] uppercase tracking-[0.15em] text-ink/35">
                                {t.classes.duration}
                              </p>
                              <p className="mt-0.5 text-sm text-ink/70">{event.duration_minutes}</p>
                            </div>
                          )}
                          {event.price && (
                            <div className="border border-ink/10 px-3 py-2">
                              <p className="text-[9px] uppercase tracking-[0.15em] text-ink/35">
                                {t.classes.price}
                              </p>
                              <p className="mt-0.5 text-sm text-ink/70">{event.price}</p>
                            </div>
                          )}
                          {availableSpots !== null && (
                            <div className="border border-ink/10 px-3 py-2">
                              <p className="text-[9px] uppercase tracking-[0.15em] text-ink/35">
                                {isRu ? "Свободно мест" : "Available"}
                              </p>
                              <p className={`mt-0.5 text-sm ${isFull ? "text-red-500" : "text-ink/70"}`}>
                                {isFull ? (isRu ? "Мест нет" : "Full") : availableSpots}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Кнопка */}
                      <div className="mt-7">
                        <EventBookingModal
                          eventId={event.id}
                          title={event.title}
                          availableSpots={availableSpots}
                        />
                      </div>
                    </div>

                    {/* Правая часть — картинка */}
                    {event.image ? (
                      <div className="relative min-h-[260px] overflow-hidden bg-stone lg:min-h-0">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : (
                      <div className="hidden bg-stone/40 lg:block" />
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-ink/10 py-14">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-[22px] leading-snug text-ink/40 max-w-sm">
              {t.events.ctaText}
            </p>
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
