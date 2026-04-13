import { Container } from "../../components/Container";
import { ContactForm } from "../../components/ContactForm";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";
import { contactInfo } from "../../lib/contact-info";

export const metadata = {
  title: "Контакты",
  description: "Свяжитесь с художественной мастерской Арт Хаус.",
};

export default async function ContactPage() {
  const lang = await getLang();
  const t = getT(lang);
  const c = t.contact;
  const labelClass = "caps text-ink/50";
  const linkValueClass = "mt-2 inline-block text-sm leading-relaxed text-ink/70 transition hover:text-ink";
  const textValueClass = "mt-2 text-sm leading-relaxed text-ink/70";
  const mapLat = 55.881177;
  const mapLon = 36.800689;
  const mapPoint = `${mapLon},${mapLat}`;
  const yandexMapUrl = `https://yandex.ru/map-widget/v1/?ll=${encodeURIComponent(mapPoint)}&z=16&pt=${encodeURIComponent(`${mapPoint},pm2rdm`)}`;

  return (
    <section className="py-16">
      <Container>
        <div className="mb-10">
          <p className="caps text-ink/40">{c.subtitle}</p>
          <h1 className="mt-2 font-display text-[36px] leading-tight md:text-[48px]">{c.heading}</h1>
        </div>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div>
              <p className={labelClass}>{c.phone}</p>
              <a href={`tel:${contactInfo.phone}`} className={linkValueClass}>
                {contactInfo.phone}
              </a>
            </div>
            <div>
              <p className={labelClass}>{c.email}</p>
              <a
                href={`mailto:${contactInfo.email}`}
                className={linkValueClass}
              >
                {contactInfo.email}
              </a>
            </div>
            <div>
              <p className={labelClass}>Сайт</p>
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className={linkValueClass}
              >
                {contactInfo.websiteLabel}
              </a>
            </div>
            <div>
              <p className={labelClass}>Телеграм</p>
              <a
                href={contactInfo.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={linkValueClass}
              >
                {contactInfo.telegram}
              </a>
            </div>
            <div>
              <p className={labelClass}>ВКонтакте</p>
              <a
                href={contactInfo.vk}
                target="_blank"
                rel="noopener noreferrer"
                className={linkValueClass}
              >
                {contactInfo.vk}
              </a>
            </div>
            <div>
              <p className={labelClass}>{c.schedule}</p>
              <p className={textValueClass}>{c.scheduleValue}</p>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>

        <div className="mt-12 border-t border-ink/10 pt-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className={labelClass}>{c.address}</p>
              <p className={textValueClass}>{contactInfo.postalAddress}</p>
            </div>
            <div className="overflow-hidden border border-ink/10 bg-stone" style={{ aspectRatio: "16 / 10" }}>
              <iframe
                src={yandexMapUrl}
                title="Карта Яндекс — АртХаус"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
