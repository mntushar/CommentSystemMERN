import { createClient } from "redis";

export const redisOm = createClient({
  url: process.env.REDIS_URL,
});

export async function connectRedis() {
  await redisOm.connect();
}
