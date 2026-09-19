import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://art-territory.ru"
).replace(/\/$/, "");

export const SITE_NAME = "АртХаус — территория творчества";
export const DEFAULT_OG_IMAGE = "/images/IMG_main_about.jpg";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords = [],
  noIndex = false,
}: PageMetadata): Metadata {
  const canonical = path === "/" ? "/" : path.replace(/\/$/, "");

  return {
    title,
    description,
    keywords: [
      "АртХаус",
      "художественная мастерская",
      "Истра",
      "Ольга Смирнова",
      ...keywords,
    ],
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
  };
}
