import invariant from "@/invariant";
import * as v from "valibot";

const envSchema = v.object({
  APP_HOST: v.string(),
  TURSO_CONNECTION_URL: v.string(),
  TURSO_AUTH_TOKEN: v.string(),
  PLUNK_EMAIL_API_KEY: v.string(),
  PAYPLE_HOST: v.string(),
  PAYPLE_CST_ID: v.string(),
  PAYPLE_CUST_KEY: v.string(),
  PAYPLE_CLIENT_KEY: v.string(),
  GOOGLE_CLIENT_ID: v.string(),
  GOOGLE_CLIENT_SECRET: v.string(),
  TWITTER_CLIENT_ID: v.string(),
  TWITTER_CLIENT_SECRET: v.string(),
  GITHUB_CLIENT_ID: v.string(),
  GITHUB_CLIENT_SECRET: v.string(),
  OUTLINE_API_SECRET_KEY: v.string(),
  SECRET_UNLEASH_TOKEN: v.string()
});

const hostEnv = import.meta.env ?? (typeof process !== "undefined" && process.env) ?? {};

const result = v.safeParse(envSchema, {
  APP_HOST: hostEnv.APP_HOST,
  TURSO_CONNECTION_URL: hostEnv.TURSO_CONNECTION_URL,
  TURSO_AUTH_TOKEN: hostEnv.TURSO_AUTH_TOKEN,
  PLUNK_EMAIL_API_KEY: hostEnv.PLUNK_EMAIL_API_KEY,
  PAYPLE_HOST: hostEnv.PAYPLE_HOST,
  PAYPLE_CST_ID: hostEnv.PAYPLE_CST_ID,
  PAYPLE_CUST_KEY: hostEnv.PAYPLE_CUST_KEY,
  PAYPLE_CLIENT_KEY: hostEnv.PAYPLE_CLIENT_KEY,
  GOOGLE_CLIENT_ID: hostEnv.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: hostEnv.GOOGLE_CLIENT_SECRET,
  TWITTER_CLIENT_ID: hostEnv.TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET: hostEnv.TWITTER_CLIENT_SECRET,
  GITHUB_CLIENT_ID: hostEnv.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: hostEnv.GITHUB_CLIENT_SECRET,
  OUTLINE_API_SECRET_KEY: hostEnv.OUTLINE_API_SECRET_KEY,
  SECRET_UNLEASH_TOKEN: hostEnv.SECRET_UNLEASH_TOKEN
});

invariant(
  result.success,
  "env에 빠진 부분이 있습니다! 값을 채워주세요. \n" +
    JSON.stringify(result.issues, null, 2),
);
export const secretEnv = result.output;
