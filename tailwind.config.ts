import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        stone: "rgb(var(--stone) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        caps: "0.18em",
      },
      boxShadow: {
        soft: "0 20px 50px -40px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
