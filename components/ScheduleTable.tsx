import { ScheduleItem } from "../data/schedule";

interface ScheduleTableProps {
  items: ScheduleItem[];
}


export function ScheduleTable({ items }: ScheduleTableProps) {
  return (
    <div className="overflow-hidden border border-ink/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone">
          <tr>
            <th className="px-6 py-4 font-semibold">День</th>
            <th className="px-6 py-4 font-semibold">Время</th>
            <th className="px-6 py-4 font-semibold">Занятие</th>
            <th className="px-6 py-4 font-semibold">Возраст</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.day}-${item.time}-${index}`} className="border-t border-ink/10">
              <td className="px-6 py-4">{item.day}</td>
              <td className="px-6 py-4">{item.time}</td>
              <td className="px-6 py-4">{item.title}</td>
              <td className="px-6 py-4 text-ink/70">{item.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
