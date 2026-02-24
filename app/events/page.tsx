import { Container } from "../../components/Container";
import pool from "../../lib/db";

export const metadata = {
  title: "Мероприятия",
  description: "Анонсы событий и новости художественной мастерской.",
};

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function fmtDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default async function EventsPage() {
  const res = await pool.query<{
    id: number;
    title: string;
    description: string;
    event_date: Date;
    image: string;
  }>(
    `SELECT id, title, description, event_date, image FROM events ORDER BY event_date ASC`
  );
  const events = res.rows;

  return (
    <div>
      {/* Заголовок */}
      <section className="border-b border-ink/10 py-16">
        <Container>
          <p className="caps text-ink/40">Арт Хаус</p>
          <h1 className="mt-4 font-display text-[56px] leading-tight md:text-[80px]">
            Ближайшие<br />события
          </h1>
        </Container>
      </section>

      {/* Список событий */}
      <section className="py-4">
        <Container>
          {events.length === 0 ? (
            <p className="py-16 text-center font-display text-[22px] text-ink/30">
              Скоро появятся новые события
            </p>
          ) : (
            events.map((event, index) => {
              const dateStr = fmtDate(new Date(event.event_date));
              const [day, ...rest] = dateStr.split(" ");
              return (
                <div key={event.id} className="border-b border-ink/10 py-10 lg:py-14">
                  <div className="grid gap-6 lg:grid-cols-[160px_1fr_80px] lg:items-start">
                    {/* Дата */}
                    <div>
                      <span className="font-display text-[64px] leading-none text-ink/15 lg:text-[72px]">
                        {day}
                      </span>
                      <p className="caps mt-1 text-ink/40">{rest.join(" ")}</p>
                    </div>

                    {/* Контент */}
                    <div className="space-y-3">
                      <p className="caps text-accent">
                        {index === 0 ? "Скоро" : "Предстоящее событие"}
                      </p>
                      <h2 className="font-display text-[28px] leading-tight md:text-[36px]">
                        {event.title}
                      </h2>
                      {event.description && (
                        <p className="max-w-lg text-ink/60">{event.description}</p>
                      )}
                    </div>

                    {/* Порядковый номер */}
                    <div className="hidden text-right lg:block">
                      <span className="font-display text-[64px] leading-none text-ink/5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col gap-6 border-t border-ink/10 pt-12 md:flex-row md:items-end md:justify-between">
            <p className="font-display text-[22px] text-ink/50 md:text-[28px]">
              Следите за анонсами или напишите нам напрямую
            </p>
            <a
              href="/contact"
              className="w-fit bg-ink px-8 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80"
            >
              Связаться
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
