import Link from "next/link";
import { Container } from "../../components/Container";
import pool from "../../lib/db";

export const metadata = {
  title: "Расписание",
  description: "График занятий художественной мастерской Арт Хаус.",
};

const daysOrder = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

const dayLabels: Record<string, string> = {
  Понедельник: "Пн",
  Вторник: "Вт",
  Среда: "Ср",
  Четверг: "Чт",
  Пятница: "Пт",
  Суббота: "Сб",
  Воскресенье: "Вс",
};

const DAYS_RU = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

function fmtTime(dt: Date, durationMin: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const end = new Date(dt.getTime() + (durationMin ?? 90) * 60000);
  return `${pad(dt.getHours())}:${pad(dt.getMinutes())} – ${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

interface SlotItem {
  time: string;
  startHour: string;
  title: string;
  age: string;
  spots: number | null;
}

export default async function SchedulePage() {
  const res = await pool.query<{
    start_datetime: Date;
    service_title: string;
    age_group: string;
    duration_minutes: number;
    max_participants: number | null;
  }>(
    `SELECT s.start_datetime, sv.title AS service_title, sv.age_group, sv.duration_minutes, s.max_participants
     FROM schedule s
     JOIN services sv ON s.service_id = sv.id
     WHERE s.start_datetime >= NOW() AND s.status = 'active'
     ORDER BY s.start_datetime`
  );

  // Group ALL events by day of week (array per day)
  const scheduleByDay: Record<string, SlotItem[]> = {};
  for (const row of res.rows) {
    const dt = new Date(row.start_datetime);
    const dayName = DAYS_RU[dt.getDay()];
    if (!scheduleByDay[dayName]) scheduleByDay[dayName] = [];
    scheduleByDay[dayName].push({
      time: fmtTime(dt, row.duration_minutes),
      startHour: String(dt.getHours()).padStart(2, "0"),
      title: row.service_title,
      age: row.age_group ?? "",
      spots: row.max_participants ?? null,
    });
  }

  return (
    <div>
      {/* Заголовок */}
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
            <p className="caps text-ink/40">Арт Хаус</p>
            <h1 className="mt-4 font-display text-[52px] leading-tight md:text-[72px]">Расписание</h1>
            <p className="mt-5 text-[17px] text-ink/60">Еженедельный график занятий мастерской</p>
          </div>
        </Container>
      </section>

      {/* Мобильный список */}
      <section className="md:hidden">
        <Container>
          {daysOrder.map((day) => {
            const slots = scheduleByDay[day];
            return (
              <div key={day} className="border-b border-ink/10 py-7">
                <div className="flex gap-5">
                  <div className="w-8 shrink-0 pt-1">
                    <span className="caps text-ink/35">{dayLabels[day]}</span>
                  </div>
                  {slots && slots.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {slots.map((slot, i) => (
                        <div key={i}>
                          <p className="caps text-accent">{slot.time}</p>
                          <h3 className="mt-1 font-display text-[22px] leading-tight">{slot.title}</h3>
                          {slot.age && <p className="mt-1 text-sm text-ink/50">{slot.age}</p>}
                          {slot.spots != null && (
                            <span className="mt-2 inline-block rounded bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                              {slot.spots} мест
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="pt-1 font-display text-[22px] text-ink/15">Выходной</p>
                  )}
                </div>
              </div>
            );
          })}
        </Container>
      </section>

      {/* Десктопный календарь */}
      <section className="hidden md:block">
        <Container>
          <div className="mt-10 grid grid-cols-7 border-l border-t border-ink/10">
            {/* Заголовки дней */}
            {daysOrder.map((day) => (
              <div key={`header-${day}`} className="border-b border-r border-ink/10 px-4 py-3">
                <span className="font-display text-[28px] leading-none text-ink/15">{dayLabels[day]}</span>
                <p className="caps mt-1 text-[10px] text-ink/35">{day}</p>
              </div>
            ))}

            {/* Ячейки */}
            {daysOrder.map((day) => {
              const slots = scheduleByDay[day];
              return (
                <div
                  key={`cell-${day}`}
                  className={`border-b border-r border-ink/10 p-5 min-h-[220px] ${slots ? "bg-paper" : "bg-stone/30"}`}
                >
                  {slots && slots.length > 0 ? (
                    <div className="flex h-full flex-col gap-5">
                      {slots.map((slot, i) => (
                        <div key={i} className={i > 0 ? "border-t border-ink/10 pt-4" : ""}>
                          {/* Час крупно только у первого */}
                          {i === 0 && (
                            <span className="font-display text-[44px] leading-none text-ink/10">
                              {slot.startHour}
                            </span>
                          )}
                          <p className="mt-1 text-xs text-ink/40">{slot.time}</p>
                          <h3 className="mt-1 font-display text-[15px] leading-snug">{slot.title}</h3>
                          {slot.age && <p className="caps mt-1 text-[10px] text-accent">{slot.age}</p>}
                          {slot.spots != null && (
                            <span className="mt-1.5 inline-block rounded bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                              {slot.spots} мест
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-[32px] text-ink/10">—</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col gap-6 border-t border-ink/10 pt-12 md:flex-row md:items-end md:justify-between">
            <p className="font-display text-[22px] text-ink/50 md:text-[26px]">Хотите записаться на занятие?</p>
            <Link
              href="/contact"
              className="w-fit bg-ink px-8 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80"
            >
              Написать нам
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
