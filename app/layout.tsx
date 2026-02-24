import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "../components/ClientLayout";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${displayFont.variable} ${bodyFont.variable} bg-paper text-ink`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
