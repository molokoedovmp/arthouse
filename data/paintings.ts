export interface Painting {
  title: string;
  year: string;
  size: string;
  technique: string;
  price: string;
  isAvailable: boolean;
  image: string;
  slug: string;
}

export const paintings: Painting[] = [
  {
    title: "Тишина утра",
    year: "2023",
    size: "80 × 60 см",
    technique: "масло, холст",
    price: "45 000 ₽",
    isAvailable: true,
    image: "/images/painting-placeholder.svg",
    slug: "tishina-utra",
  },
  {
    title: "Горизонт памяти",
    year: "2022",
    size: "90 × 70 см",
    technique: "акрил, холст",
    price: "52 000 ₽",
    isAvailable: true,
    image: "/images/painting-placeholder.svg",
    slug: "gorizont-pamyati",
  },
  {
    title: "Дыхание сада",
    year: "2024",
    size: "100 × 80 см",
    technique: "масло, холст",
    price: "68 000 ₽",
    isAvailable: false,
    image: "/images/painting-placeholder.svg",
    slug: "dyhanie-sada",
  },
  {
    title: "Теплый ветер",
    year: "2021",
    size: "70 × 50 см",
    technique: "темпера, холст",
    price: "39 000 ₽",
    isAvailable: true,
    image: "/images/painting-placeholder.svg",
    slug: "teplyy-veter",
  },
  {
    title: "Вечерний свет",
    year: "2020",
    size: "110 × 90 см",
    technique: "масло, холст",
    price: "74 000 ₽",
    isAvailable: true,
    image: "/images/painting-placeholder.svg",
    slug: "vecherniy-svet",
  },
  {
    title: "Пауза",
    year: "2022",
    size: "60 × 60 см",
    technique: "акрил, холст",
    price: "31 000 ₽",
    isAvailable: true,
    image: "/images/painting-placeholder.svg",
    slug: "pauza",
  },
  {
    title: "Северный воздух",
    year: "2024",
    size: "120 × 90 см",
    technique: "масло, холст",
    price: "85 000 ₽",
    isAvailable: false,
    image: "/images/painting-placeholder.svg",
    slug: "severnyy-vozduh",
  },
  {
    title: "Пейзаж с линиями",
    year: "2019",
    size: "75 × 55 см",
    technique: "смешанная техника",
    price: "36 000 ₽",
    isAvailable: true,
    image: "/images/painting-placeholder.svg",
    slug: "peyzazh-s-liniyami",
  },
];

export function getPaintingBySlug(slug: string) {
  return paintings.find((painting) => painting.slug === slug);
}
