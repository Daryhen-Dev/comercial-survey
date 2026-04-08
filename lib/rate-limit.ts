import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ─── In-memory fallback for local development ────────────────────────────────

type Entry = { count: number; resetAt: number }
const localStore = new Map<string, Entry>()

function localRateLimit(ip: string, limit = 5): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = localStore.get(ip)

  if (!entry || now > entry.resetAt) {
    localStore.set(ip, { count: 1, resetAt: now + 60_000 })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) return { allowed: false, remaining: 0 }

  entry.count++
  localStore.set(ip, entry)
  return { allowed: true, remaining: limit - entry.count }
}

// ─── Upstash for production ───────────────────────────────────────────────────

let ratelimit: Ratelimit | null = null

function getUpstashRatelimit(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: 'survey:rl',
    })
  }
  return ratelimit
}

// ─── Unified export ───────────────────────────────────────────────────────────

export async function rateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const upstash = getUpstashRatelimit()

  if (!upstash) {
    // Dev fallback — in-memory is fine for a single local process
    return localRateLimit(ip)
  }

  const { success, remaining } = await upstash.limit(ip)
  return { allowed: success, remaining }
}
