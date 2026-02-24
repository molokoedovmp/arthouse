FROM node:20-alpine AS base

# ── Зависимости ──────────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ── Сборка ───────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные нужны при сборке для Next.js
ARG DATABASE_URL
ARG ADMIN_PASSWORD
ARG S3_ENDPOINT
ARG S3_ACCESS_KEY
ARG S3_SECRET_KEY
ARG S3_BUCKET
ARG S3_REGION

ENV DATABASE_URL=$DATABASE_URL
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
ENV S3_ENDPOINT=$S3_ENDPOINT
ENV S3_ACCESS_KEY=$S3_ACCESS_KEY
ENV S3_SECRET_KEY=$S3_SECRET_KEY
ENV S3_BUCKET=$S3_BUCKET
ENV S3_REGION=$S3_REGION

RUN npm run build

# ── Продакшн-образ ────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
