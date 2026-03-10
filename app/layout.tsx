import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "../components/ClientLayout";
import { LangProvider } from "../components/LangProvider";
import { cookies } from "next/headers";
import type { Lang } from "../lib/i18n";

const displayFont = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Арт Хаус — территория творчества",
    template: "%s — Арт Хаус",
  },
  description:
    "Художественная мастерская и художник Ольга Смирнова: занятия, мастер-классы, выставки и каталог картин.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const lang: Lang = store.get("lang")?.value === "en" ? "en" : "ru";

  return (
    <html lang={lang}>
      <body className={`${displayFont.variable} ${bodyFont.variable} bg-paper text-ink`}>
        <LangProvider initialLang={lang}>
          <ClientLayout>{children}</ClientLayout>
        </LangProvider>
      </body>
    </html>
  );
}
