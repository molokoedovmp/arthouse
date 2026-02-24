import { Container } from "../../components/Container";
import { SectionTitle } from "../../components/SectionTitle";
import { ContactForm } from "../../components/ContactForm";

export const metadata = {
  title: "Контакты",
  description: "Свяжитесь с художественной мастерской Арт Хаус.",
};

export default function ContactPage() {
  return (
    <section className="py-16">
      <Container>
        <SectionTitle subtitle="Контакты">Связаться с нами</SectionTitle>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div>
              <p className="caps text-ink/50">Адрес</p>
              <p className="mt-2 text-sm text-ink/70">Дзержинск, Нижегородская область</p>
            </div>
            <div>
              <p className="caps text-ink/50">Телефон</p>
              <p className="mt-2 text-sm text-ink/70">+7 (000) 000-00-00</p>
            </div>
            <div>
              <p className="caps text-ink/50">Email</p>
              <p className="mt-2 text-sm text-ink/70">arthouse@example.com</p>
            </div>
            <div>
              <p className="caps text-ink/50">График</p>
              <p className="mt-2 text-sm text-ink/70">По предварительной записи</p>
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
