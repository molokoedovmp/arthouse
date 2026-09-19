import type { MetadataRoute } from "next";
import pool from "../lib/db";
import { SITE_URL } from "../lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: Array<{
    path: string;
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/classes", changeFrequency: "weekly", priority: 0.9 },
    { path: "/schedule", changeFrequency: "daily", priority: 1 },
    { path: "/events", changeFrequency: "daily", priority: 0.9 },
    { path: "/gallery", changeFrequency: "weekly", priority: 0.8 },
    { path: "/paintings", changeFrequency: "weekly", priority: 0.8 },
    { path: "/artist", changeFrequency: "monthly", priority: 0.7 },
    { path: "/coworking", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  ];

  const routes = staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  let paintingRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await pool.query<{ id: number }>("SELECT id FROM paintings ORDER BY id");
    paintingRoutes = result.rows.map(({ id }) => ({
      url: `${SITE_URL}/paintings/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // Статические страницы всё равно должны попасть в sitemap при недоступной БД.
  }

  return [...routes, ...paintingRoutes];
}
