#!/bin/sh
set -e

echo "========================================================================"
echo "🚀 Rahayu Fashion Store — Container Starting (NODE_ENV=${NODE_ENV:-development})"
echo "========================================================================"

# If DATABASE_URL is provided, verify schema, auto-repair legacy items, & auto-seed using standalone @prisma/client script
if [ -n "$DATABASE_URL" ] && [ -f "./prisma/init-db.mjs" ]; then
  echo "📦 Database connection detected. Running standalone schema & seed initializer..."
  node ./prisma/init-db.mjs || echo "⚠️ Warning: Database initialization skipped or database not ready yet."
fi

if [ "$NODE_ENV" = "development" ]; then
  echo "🔥 Starting Next.js DEVELOPMENT Server (Turbopack + Live HTTP & Prisma Query Logs) on port ${PORT:-3000}..."
else
  echo "✨ Starting Next.js PRODUCTION Standalone Server on port ${PORT:-3000}..."
fi

exec "$@"
