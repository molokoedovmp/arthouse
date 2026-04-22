# syntax=docker/dockerfile:1

# ── 1. Зависимости ──────────────────────────────────────────
FROM node:22.16.0-slim AS deps
WORKDIR /app
COPY package*.json ./
# --mount=type=cache кеширует ~/.npm между сборками — npm ci не скачивает пакеты повторно
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

# ── 2. Сборка ───────────────────────────────────────────────
FROM node:22.16.0-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── 3. Финальный образ (standalone — без node_modules) ──────
FROM node:22.16.0-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3005
ENV HOSTNAME=0.0.0.0

# standalone включает только нужное для запуска
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3005
CMD ["node", "server.js"]
