#!/bin/sh
set -e

echo "🚀 Rahayu Fashion Store — Container Starting..."

# If DATABASE_URL is provided, verify schema & auto-seed using standalone @prisma/client script
if [ -n "$DATABASE_URL" ] && [ -f "./prisma/init-db.mjs" ]; then
  echo "📦 Database connection detected. Running standalone schema & seed initializer..."
  node ./prisma/init-db.mjs || echo "⚠️ Warning: Database initialization skipped or database not ready yet."
fi

echo "✨ Starting Next.js Standalone Server on port ${PORT:-3000}..."
exec "$@"
