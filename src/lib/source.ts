import {
  markProfileInactive,
  type ProfileBranch,
  registerProfile,
} from '@/database/profiles';
import { getRedis } from '@/database/redis';
import { allowGitHubLookup } from './rate-limit';

const SOURCE_CACHE_PREFIX = 'about-source-availability-v3';
const SOURCE_CACHE_HIT_TTL_SECONDS = 60 * 30;

type CachedSourceBranch = ProfileBranch;

function getSourceUrl(username: string, branch: string) {
  return `https://raw.githubusercontent.com/${username}/.about/refs/heads/${branch}/about.json`;
}

function getSourceCacheKey(username: string) {
  return `${SOURCE_CACHE_PREFIX}:${username}`;
}

async function fetchSource(username: string, branch: string) {
  const url = getSourceUrl(username, branch);
  const res = await fetch(url);

  return { status: res.status, url };
}

async function readCachedBranch(username: string) {
  const redis = getRedis();

  if (!redis) {
    return null;
  }

  try {
    const branch = await redis.get<CachedSourceBranch>(
      getSourceCacheKey(username),
    );

    if (branch === 'main' || branch === 'master') {
      return branch;
    }
  } catch (error) {
    console.error('Failed to read source availability cache', error);
  }

  return null;
}

async function writeCachedBranch(username: string, branch: CachedSourceBranch) {
  const redis = getRedis();

  if (!redis) {
    return;
  }

  try {
    await redis.set(getSourceCacheKey(username), branch, {
      ex: SOURCE_CACHE_HIT_TTL_SECONDS,
    });
  } catch (error) {
    console.error('Failed to write source availability cache', error);
  }
}

export async function getSource(username: string, headers: Headers) {
  const cachedBranch = await readCachedBranch(username);

  if (cachedBranch === 'main' || cachedBranch === 'master') {
    return { url: getSourceUrl(username, cachedBranch) };
  }

  if (!(await allowGitHubLookup(headers))) {
    return { url: getSourceUrl(username, 'main') };
  }

  const main = await fetchSource(username, 'main');

  if (main.status === 200) {
    await writeCachedBranch(username, 'main');
    await registerProfile(username, 'main');

    return { url: main.url };
  }

  if (main.status === 429) return { url: main.url };

  const master = await fetchSource(username, 'master');

  if (master.status === 200) {
    await writeCachedBranch(username, 'master');
    await registerProfile(username, 'master');

    return { url: master.url };
  }

  if (master.status === 429) return { url: main.url };

  if (main.status === 404 && master.status === 404) {
    await markProfileInactive(username);

    return null;
  }

  return { url: main.url };
}
