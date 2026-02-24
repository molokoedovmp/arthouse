import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 py-10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg">Арт Хаус — территория творчества</p>
            <p className="text-sm text-ink/60">Художественная мастерская и художник.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-ink/70">
            <Link href="/contact" className="link-underline">
              Связаться
            </Link>
            <Link href="/paintings" className="link-underline">
              Каталог картин
            </Link>
            <Link href="/gallery" className="link-underline">
              Галерея
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
