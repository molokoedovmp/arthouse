import { Container } from "../../components/Container";
import { ContactForm } from "../../components/ContactForm";
import { getLang } from "../../lib/get-lang";
import { getT } from "../../lib/i18n";

export const metadata = {
  title: "Контакты",
  description: "Свяжитесь с художественной мастерской Арт Хаус.",
};

export default async function ContactPage() {
  const lang = await getLang();
  const t = getT(lang);
  const c = t.contact;

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
              <p className="caps text-ink/50">{c.address}</p>
              <p className="mt-2 text-sm text-ink/70">{c.addressValue}</p>
            </div>
            <div>
              <p className="caps text-ink/50">{c.phone}</p>
              <p className="mt-2 text-sm text-ink/70">+7 (000) 000-00-00</p>
            </div>
            <div>
              <p className="caps text-ink/50">{c.email}</p>
              <p className="mt-2 text-sm text-ink/70">arthouse@example.com</p>
            </div>
            <div>
              <p className="caps text-ink/50">{c.schedule}</p>
              <p className="mt-2 text-sm text-ink/70">{c.scheduleValue}</p>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
