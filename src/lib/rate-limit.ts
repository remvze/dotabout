import { getSecret } from 'astro:env/server';
import { createHmac } from 'node:crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { getRedis } from '@/database/redis';

const IP_LIMIT = 10;
const GLOBAL_LIMIT = 100;

let ipRateLimit: Ratelimit | null = null;
let globalRateLimit: Ratelimit | null = null;

function initializeRateLimits() {
  const redis = getRedis();

  if (!redis) return null;

  ipRateLimit ??= new Ratelimit({
    limiter: Ratelimit.slidingWindow(IP_LIMIT, '1 m'),
    prefix: 'dotabout:ratelimit:ip',
    redis,
    timeout: 1000,
  });

  globalRateLimit ??= new Ratelimit({
    limiter: Ratelimit.slidingWindow(GLOBAL_LIMIT, '1 m'),
    prefix: 'dotabout:ratelimit:global',
    redis,
    timeout: 1000,
  });

  return { globalRateLimit, ipRateLimit };
}

function getRequestIp(headers: Headers) {
  return (
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    null
  );
}

function hashIp(ip: string, secret: string) {
  return createHmac('sha256', secret).update(ip).digest('hex');
}

export async function allowGitHubLookup(headers: Headers) {
  const rateLimits = initializeRateLimits();

  if (!rateLimits) return true;

  try {
    const ip = getRequestIp(headers);
    const hashSecret = getSecret('RATE_LIMIT_HASH_SECRET');

    if (ip && hashSecret) {
      const ipResult = await rateLimits.ipRateLimit.limit(
        hashIp(ip, hashSecret),
      );

      if (!ipResult.success) return false;
    }

    const globalResult = await rateLimits.globalRateLimit.limit('github');

    return globalResult.success;
  } catch (error) {
    console.error('Failed to apply GitHub lookup rate limit', error);
    return true;
  }
}
