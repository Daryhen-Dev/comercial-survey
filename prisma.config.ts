import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),         // Supabase pooled URL (pgBouncer port 6543) — used for queries
    directUrl: env('DIRECT_URL'),     // Supabase direct URL (port 5432) — used for migrations
  },
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
})
