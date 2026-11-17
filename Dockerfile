# ==============================================================================
# RAHAYU FASHION STORE — PRODUCTION DOCKERFILE
# Multi-Stage Build with Alpine Linux & Next.js Standalone Engine (~120 MB image)
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Base Node.js Environment
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base

# Install libc6-compat for Turbopack & OpenSSL for Prisma engine compatibility
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ------------------------------------------------------------------------------
# 2. Dependencies Installation Stage
# ------------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Clean install all dependencies (including devDependencies needed for build)
RUN npm ci

# Generate Prisma Client specifically for the Alpine Linux environment
RUN npx prisma generate

# ------------------------------------------------------------------------------
# 3. Next.js Build Stage (Output Standalone)
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment arguments (can be overridden via build-args)
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_SHOW_DEMO_CONNECTOR=true
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rahayu_fashion?schema=public"

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SHOW_DEMO_CONNECTOR=$NEXT_PUBLIC_SHOW_DEMO_CONNECTOR
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compile Next.js with Standalone output
RUN npm run build

# ------------------------------------------------------------------------------
# 4. Production Runner Stage (Minimal, Hardened & Fast)
# ------------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create secure unprivileged user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Create uploads directory with correct permissions for server file uploads
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

# Copy public static files
COPY --from=builder /app/public ./public

# Copy Next.js standalone server and static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and engine for runtime operations and migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy startup entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
