import { EventItem } from "../data/events";

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="border border-ink/10 bg-white p-6 shadow-soft">
      <p className="caps text-accent">{event.date}</p>
      <h3 className="mt-3 font-display text-xl">{event.title}</h3>
      <p className="mt-3 text-sm text-ink/70">{event.description}</p>
    </div>
  );
}
