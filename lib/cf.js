import { getCloudflareContext } from "@opennextjs/cloudflare";

/** @returns {Promise<CloudflareEnv>} */
export async function getEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}

/** @returns {Promise<D1Database>} */
export async function getDB() {
  const env = await getEnv();
  if (!env.DB) {
    throw new Error("D1 binding DB is not configured");
  }
  return env.DB;
}

/** @returns {Promise<R2Bucket>} */
export async function getMediaBucket() {
  const env = await getEnv();
  if (!env.MEDIA) {
    throw new Error("R2 binding MEDIA is not configured");
  }
  return env.MEDIA;
}
