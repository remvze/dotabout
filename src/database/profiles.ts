import { getRedis } from './redis';

const PROFILES_KEY = 'dotabout:profiles';
const PROFILE_KEY_PREFIX = 'dotabout:profile';

export type ProfileBranch = 'main' | 'master';

function getProfileKey(username: string) {
  return `${PROFILE_KEY_PREFIX}:${username}`;
}

export async function registerProfile(username: string, branch: ProfileBranch) {
  const redis = getRedis();

  if (!redis) return;

  const now = new Date();
  const profileKey = getProfileKey(username);

  try {
    await redis
      .pipeline()
      .hsetnx(profileKey, 'firstSeenAt', now.toISOString())
      .hset(profileKey, {
        branch,
        lastVerifiedAt: now.toISOString(),
        status: 'active',
        username,
      })
      .zadd(
        PROFILES_KEY,
        { nx: true },
        { member: username, score: now.getTime() },
      )
      .exec();
  } catch (error) {
    console.error('Failed to register profile', error);
  }
}

export async function markProfileInactive(username: string) {
  const redis = getRedis();

  if (!redis) return;

  const profileKey = getProfileKey(username);

  try {
    if (!(await redis.exists(profileKey))) return;

    await redis.hset(profileKey, {
      lastVerifiedAt: new Date().toISOString(),
      status: 'inactive',
    });
  } catch (error) {
    console.error('Failed to mark profile inactive', error);
  }
}
