import * as v from "valibot";

export const isProd = import.meta.env.PROD;

const envSchema = v.object({
  TURSO_CONNECTION_URL: v.string(),
  TURSO_AUTH_TOKEN: v.string(),
});

export const env = v.parse(envSchema, {
  TURSO_CONNECTION_URL: import.meta.env.TURSO_CONNECTION_URL,
  TURSO_AUTH_TOKEN: import.meta.env.TURSO_AUTH_TOKEN,
});
