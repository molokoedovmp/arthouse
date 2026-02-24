export interface ScheduleItem {
  day: string;
  time: string;
  title: string;
  age: string;
}

export const schedule: ScheduleItem[] = [
  {
    day: "Понедельник",
    time: "16:00 – 17:30",
    title: "Рисование для детей",
    age: "6–8 лет",
  },
  {
    day: "Вторник",
    time: "17:00 – 18:30",
    title: "Art in English",
    age: "9–12 лет",
  },
  {
    day: "Среда",
    time: "19:00 – 20:30",
    title: "Мастер-класс для взрослых",
    age: "16+",
  },
  {
    day: "Четверг",
    time: "16:30 – 18:00",
    title: "Мастер-класс для детей",
    age: "9–12 лет",
  },
  {
    day: "Пятница",
    time: "11:00 – 18:00",
    title: "Коворкинг студии",
    age: "16+",
  },
  {
    day: "Суббота",
    time: "12:00 – 14:00",
    title: "Семейные занятия",
    age: "6+",
  },
];
