"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          message: fd.get("message"),
        }),
      });
      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      <label className="grid gap-2 text-sm text-ink/70">
        Имя
        <input
          type="text"
          name="name"
          required
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

      {status === "success" && (
        <p className="text-sm text-green-700">Заявка отправлена — мы свяжемся с вами!</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">Не удалось отправить. Попробуйте ещё раз.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 w-fit bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/90 disabled:opacity-50"
      >
        {status === "loading" ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}
