import invariant from '@/invariant';
import * as v from "valibot";

export const isProd = import.meta.env.PROD;

const envSchema = v.object({
  APP_HOST: v.string(),
  TURSO_CONNECTION_URL: v.string(),
  TURSO_AUTH_TOKEN: v.string(),
  PLUNK_EMAIL_API_KEY: v.string(),
  PAYPLE_HOST: v.string(),
  PAYPLE_CST_ID: v.string(),
  PAYPLE_CUST_KEY: v.string(),
  PAYPLE_CLIENT_KEY: v.string(),
});

const result = v.safeParse(envSchema, {
  APP_HOST: import.meta.env.APP_HOST,
  TURSO_CONNECTION_URL: import.meta.env.TURSO_CONNECTION_URL,
  TURSO_AUTH_TOKEN: import.meta.env.TURSO_AUTH_TOKEN,
  PLUNK_EMAIL_API_KEY: import.meta.env.PLUNK_EMAIL_API_KEY,
  PAYPLE_HOST: import.meta.env.PAYPLE_HOST,
  PAYPLE_CST_ID: import.meta.env.PAYPLE_CST_ID,
  PAYPLE_CUST_KEY: import.meta.env.PAYPLE_CUST_KEY,
  PAYPLE_CLIENT_KEY: import.meta.env.PAYPLE_CLIENT_KEY,
});

invariant(result.success, "env에 빠진 부분이 있습니다! 값을 채워주세요. \n" + JSON.stringify(result.issues, null, 2))
export const env = result.output;
