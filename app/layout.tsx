import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "../components/ClientLayout";
import { LangProvider } from "../components/LangProvider";
import { cookies } from "next/headers";
import type { Lang } from "../lib/i18n";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "../lib/seo";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s — АртХаус",
  },
  description:
    "АртХаус — территория творчества Ольги Смирновой: занятия, мастер-классы, творческий коворкинг и авторские картины.",
  applicationName: SITE_NAME,
  authors: [{ name: "АртХаус", url: SITE_URL }],
  creator: "АртХаус",
  publisher: "АртХаус",
  category: "Искусство и образование",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Художественная мастерская в Истре: занятия для детей и взрослых, мастер-классы, мероприятия и творческий коворкинг.",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Творческая мастерская АртХаус" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Занятия живописью, мастер-классы и творческие события в Истре.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
  verification: { yandex: "ef24b4d9723ad5b3" },
  icons: { icon: "/ARTHOUSE.png", apple: "/ARTHOUSE.png" },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["ArtGallery", "EducationalOrganization", "LocalBusiness"],
              name: "АртХаус",
              alternateName: "Территория творчества Ольги Смирновой",
              url: SITE_URL,
              logo: `${SITE_URL}/ARTHOUSE.png`,
              image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
              email: "arthausterritory@yandex.ru",
              telephone: "+7 923 554-55-03",
              address: {
                "@type": "PostalAddress",
                addressCountry: "RU",
                addressRegion: "Московская область",
                addressLocality: "деревня Крючково, городской округ Истра",
                streetAddress: "ул. Вишневая, 17, ТЦ Ауха, 3 этаж, к. 3.9",
              },
              sameAs: [
                "https://t.me/ArtHausIstra",
                "https://www.instagram.com/bushumbart/",
                "https://vk.ru/arthausterritory",
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className={`${displayFont.variable} ${bodyFont.variable} bg-paper text-ink`}>
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for(var j=0;j<document.scripts.length;j++){
                  if(document.scripts[j].src===r){return;}
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
              })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=112818150','ym');

              ym(112818150,'init',{
                ssr:true,
                webvisor:true,
                clickmap:true,
                ecommerce:'dataLayer',
                referrer:document.referrer,
                url:location.href,
                accurateTrackBounce:true,
                trackLinks:true
              });
            `,
          }}
        />
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/112818150"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        <LangProvider initialLang={lang}>
          <ClientLayout>{children}</ClientLayout>
        </LangProvider>
      </body>
    </html>
  );
}
