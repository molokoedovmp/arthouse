"use client";

import { useState } from "react";
import { useLanguage } from "./LangProvider";
import { getT } from "../lib/i18n";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { lang } = useLanguage();
  const t = getT(lang).contact.form;

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
          email: fd.get("email"),
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
        {t.name}
        <input
          type="text"
          name="name"
          className="border border-ink/15 px-4 py-3 text-base outline-none transition focus:border-accent"
          placeholder={t.namePlaceholder}
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/70">
        {t.phone}
        <input
          type="tel"
          name="phone"
          className="border border-ink/15 px-4 py-3 text-base outline-none transition focus:border-accent"
          placeholder={t.phonePlaceholder}
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/70">
        {t.email}
        <input
          type="email"
          name="email"
          className="border border-ink/15 px-4 py-3 text-base outline-none transition focus:border-accent"
          placeholder={t.emailPlaceholder}
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/70">
        {t.message}
        <textarea
          name="message"
          rows={4}
          className="border border-ink/15 px-4 py-3 text-base outline-none transition focus:border-accent"
          placeholder={t.messagePlaceholder}
        />
      </label>

      {status === "success" && (
        <p className="text-sm text-green-700">{t.success}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">{t.error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 w-fit bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/90 disabled:opacity-50"
      >
        {status === "loading" ? t.sending : t.submit}
      </button>
    </form>
  );
}
