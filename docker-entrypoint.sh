#!/bin/sh
set -e

echo "🚀 Rahayu Fashion Store — Container Starting..."

# If DATABASE_URL is provided, run prisma db push (and optional seed if empty)
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Database connection detected. Verifying Prisma schema sync..."
  # If prisma is in node_modules, run push
  if [ -f "./node_modules/prisma/build/index.js" ]; then
    node ./node_modules/prisma/build/index.js db push --skip-generate || echo "⚠️ Warning: Prisma db push skipped or database not ready yet."
  elif command -v npx >/dev/null 2>&1; then
    npx prisma db push --skip-generate || echo "⚠️ Warning: Prisma db push skipped or database not ready yet."
  fi
fi

echo "✨ Starting Next.js Standalone Server on port ${PORT:-3000}..."
exec "$@"
