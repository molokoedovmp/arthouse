"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "./LangProvider";
import { getT } from "../lib/i18n";

interface Props {
  eventId: number;
  title: string;
  availableSpots: number | null; // null = безлимит
}

type State = "idle" | "open" | "loading" | "success" | "error";

export function EventBookingModal({ eventId, title, availableSpots }: Props) {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);
  const { lang } = useLanguage();
  const t = getT(lang);
  const b = t.booking;
  const eb = t.eventBooking;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (state !== "open" && state !== "loading") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [state]);

  function open() {
    setName(""); setPhone(""); setEmail("");
    setErrorMsg("");
    setState("open");
  }

  function close() {
    if (state === "loading") return;
    setState("idle");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/event-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, name, phone, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? b.errorDefault);
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrorMsg(b.errorConnection);
      setState("error");
    }
  }

  const full = availableSpots !== null && availableSpots <= 0;

  return (
    <>
      {full ? (
        <span className="inline-block mt-2 border border-ink/10 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-ink/30">
          {eb.noSpots}
        </span>
      ) : (
        <button
          onClick={open}
          className="inline-block mt-2 bg-ink px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white transition hover:bg-ink/80"
        >
          {t.events.register}
        </button>
      )}

      {mounted && (state === "open" || state === "loading" || state === "success" || state === "error") &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4"
            onClick={close}
          >
            <div
              className="relative w-full max-w-md bg-paper p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                disabled={state === "loading"}
                className="absolute right-4 top-4 text-ink/40 hover:text-ink transition"
                aria-label={b.closeLabel}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              {state === "success" ? (
                <div className="text-center py-4">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-accent/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl">{eb.successTitle}</h3>
                  <p className="mt-2 text-sm text-ink/60">
                    {eb.successText} <span className="text-ink">{title}</span>.<br />
                    {eb.successSub}
                  </p>
                  <button
                    onClick={close}
                    className="mt-6 w-full bg-ink py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80"
                  >
                    {b.close}
                  </button>
                </div>
              ) : (
                <>
                  <p className="caps text-accent">{eb.title}</p>
                  <h3 className="mt-2 font-display text-[22px] leading-tight">{title}</h3>
                  {availableSpots !== null && (
                    <p className="mt-1 text-xs text-ink/40">
                      {t.common.freeSpots}: <span className="text-ink/70">{availableSpots}</span>
                    </p>
                  )}

                  <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-[0.15em] text-ink/50">{b.name}</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={state === "loading"}
                        placeholder={b.namePlaceholder}
                        className="mt-1 w-full border border-ink/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-ink/40 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-[0.15em] text-ink/50">{b.phone}</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={state === "loading"}
                        placeholder={b.phonePlaceholder}
                        className="mt-1 w-full border border-ink/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-ink/40 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-[0.15em] text-ink/50">{b.email}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={state === "loading"}
                        placeholder={b.emailPlaceholder}
                        className="mt-1 w-full border border-ink/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-ink/40 disabled:opacity-50"
                      />
                    </div>

                    {state === "error" && (
                      <p className="text-sm text-red-500">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={state === "loading"}
                      className="w-full bg-ink py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-ink/80 disabled:opacity-50"
                    >
                      {state === "loading" ? b.sending : b.submit}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
