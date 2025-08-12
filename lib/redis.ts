import { Redis } from "@upstash/redis";
import { env } from "process";

if (!env.REDIS_URL || !env.REDIS_TOKEN) {
  console.warn(
    "REDIS_URL or REDIS_TOKEN environment variable is not defined, please add to enable background notifications and webhooks.",
  );
}

function isValidUpstashUrl(url: string | undefined): boolean {
  if (!url) return false;
  return /^https:\/\//i.test(url);
}

function isLikelyPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const trimmed = value.trim().toLowerCase();
  return ["", "string", "your_url", "replace_me", "todo"].includes(trimmed);
}

const shouldInitializeRedis =
  isValidUpstashUrl(env.REDIS_URL) && !isLikelyPlaceholder(env.REDIS_TOKEN);

export const redis = shouldInitializeRedis
  ? new Redis({
      url: env.REDIS_URL as string,
      token: env.REDIS_TOKEN as string,
    })
  : null;

if (!redis) {
  console.warn(
    "Upstash Redis is not initialized. Background notifications/webhooks will be disabled in this environment."
  );
}
