export interface EventItem {
  title: string;
  date: string;
  description: string;
}

export const events: EventItem[] = [
  {
    title: "Открытая студия: свободное рисование",
    date: "5 марта",
    description: "Вечер без формата: мягкая музыка, общение и работа в собственном темпе.",
  },
  {
    title: "Мастер-класс по композиции",
    date: "16 марта",
    description: "Практика построения кадра и ритма на основе натюрморта и пейзажа.",
  },
  {
    title: "Выставка работ учеников",
    date: "2 апреля",
    description: "Теплая камерная экспозиция с новыми сериями и этюдами.",
  },
];
