import type { MetadataRoute } from "next";
import { paintings } from "../data/paintings";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arthouse.local";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/classes",
    "/schedule",
    "/events",
    "/gallery",
    "/paintings",
    "/artist",
    "/contact",
  ];

  const routes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const paintingRoutes = paintings.map((painting) => ({
    url: `${baseUrl}/paintings/${painting.slug}`,
    lastModified: new Date(),
  }));

  return [...routes, ...paintingRoutes];
}
