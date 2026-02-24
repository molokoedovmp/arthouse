export interface GalleryItem {
  image: string;
  caption: string;
  category: "students" | "events";
}

export const gallery: GalleryItem[] = [
  {
    image: "/images/gallery-1.jpg",
    caption: "Этюды акварелью, 8–10 лет",
    category: "students",
  },
  {
    image: "/images/gallery-2.jpg",
    caption: "Практика света и тени",
    category: "students",
  },
  {
    image: "/images/gallery-3.jpg",
    caption: "Серия работ по натюрморту",
    category: "students",
  },
  {
    image: "/images/gallery-4.jpg",
    caption: "Открытая студия: вечерний пленэр",
    category: "events",
  },
  {
    image: "/images/gallery-5.jpg",
    caption: "Мастер-класс по композиции",
    category: "events",
  },
  {
    image: "/images/gallery-6.jpg",
    caption: "Выставка работ учеников",
    category: "events",
  },
];
