import invariant from "@/invariant";
import * as v from "valibot";

const envSchema = v.object({
  PUBLIC_UNLEASH_TOKEN: v.string(),
});

const hostEnv =
  import.meta.env ?? (typeof process !== "undefined" && process.env) ?? {};

const result = v.safeParse(envSchema, {
  PUBLIC_UNLEASH_TOKEN: hostEnv.PUBLIC_UNLEASH_TOKEN,
});

invariant(
  result.success,
  "env에 빠진 부분이 있습니다! 값을 채워주세요. \n" +
    JSON.stringify(result.issues, null, 2),
);
export const publicEnv = result.output;

export const isProd = hostEnv.PROD;
