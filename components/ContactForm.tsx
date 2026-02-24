export function ContactForm() {
  return (
    <form className="mt-6 grid gap-4">
      <label className="grid gap-2 text-sm text-ink/70">
        Имя
        <input
          type="text"
          name="name"
          className="border border-ink/15 px-4 py-3 text-base outline-none transition focus:border-accent"
          placeholder="Ваше имя"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/70">
        Телефон
        <input
          type="tel"
          name="phone"
          className="border border-ink/15 px-4 py-3 text-base outline-none transition focus:border-accent"
          placeholder="+7 (___) ___-__-__"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/70">
        Сообщение
        <textarea
          name="message"
          rows={4}
          className="border border-ink/15 px-4 py-3 text-base outline-none transition focus:border-accent"
          placeholder="Напишите, чем можем помочь"
        />
      </label>
      <button
        type="submit"
        className="mt-2 w-fit bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/90"
      >
        Отправить
      </button>
    </form>
  );
}
