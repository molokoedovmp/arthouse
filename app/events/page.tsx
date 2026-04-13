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

const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default async function EventsPage() {
  const lang = await getLang();
  const t = getT(lang);

  const res = await pool.query<{
    id: number;
    title: string;
    description: string;
    event_date: Date;
    image: string;
    max_participants: number | null;
    booked: string;
  }>(
    `SELECT e.id, e.title, e.description, e.event_date, e.image, e.max_participants,
            COUNT(eb.id) AS booked
     FROM events e
     LEFT JOIN event_bookings eb ON eb.event_id = e.id
     GROUP BY e.id
     ORDER BY e.event_date ASC`
  );
  const events = res.rows;
  const MONTHS = lang === "en" ? MONTHS_EN : MONTHS_RU;

  return (
    <div>
      <Container>
        <div className="border-b border-ink/10 py-10">
          <h1 className="font-display text-[32px]">{t.events.title}</h1>
        </div>

        {events.length === 0 ? (
          <p className="py-24 text-center font-display text-[20px] text-ink/25">
            {t.events.noItems}
          </p>
        ) : (
          <div className="divide-y divide-ink/10">
            {events.map((event) => {
              const dt = new Date(event.event_date);
              const day = dt.getDate();
              const month = MONTHS[dt.getMonth()];
              const year = dt.getFullYear();
              const booked = parseInt(event.booked) || 0;
              const availableSpots = event.max_participants !== null
                ? event.max_participants - booked
                : null;

              return (
                <div key={event.id} className="grid gap-8 py-10 lg:grid-cols-[1fr_180px] lg:items-start">
                  <div>
                    <p className="caps text-sm text-ink/40">
                      {day} {month} {year}
                    </p>
                    <h2 className="mt-3 font-display text-[26px] leading-tight md:text-[30px]">
                      {event.title}
                    </h2>
                    {event.description && (
                      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/60">
                        {event.description}
                      </p>
                    )}
                    {availableSpots !== null && availableSpots > 0 && (
                      <span className="mt-3 inline-block rounded bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                        {availableSpots} {t.common.spots}
                      </span>
                    )}
                    <EventBookingModal
                      eventId={event.id}
                      title={event.title}
                      availableSpots={availableSpots}
                    />
                  </div>

                  {event.image ? (
                    <div className="overflow-hidden bg-stone">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={360}
                        height={240}
                        className="h-44 w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-ink/10 py-8">
          <p className="text-sm text-ink/40">{t.events.ctaText}</p>
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
