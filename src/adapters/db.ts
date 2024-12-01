import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./drizzle/schema.ts";
import { secretEnv } from "./env.secret.ts";
import { isProd } from './env.public.ts';

export const db = drizzle({
  schema,
  connection: isProd
    ? {
        url: secretEnv.TURSO_CONNECTION_URL,
        authToken: secretEnv.TURSO_AUTH_TOKEN,
      }
    : {
        url: "file:test.db",
      },
});
