/* Worker bindings for OpenNext / app/api (keep in sync with wrangler.jsonc). */
interface CloudflareEnv {
  DB: D1Database;
  MEDIA: R2Bucket;
  ASSETS: Fetcher;
  JWT_SECRET: string;
}
