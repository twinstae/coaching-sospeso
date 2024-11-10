import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./drizzle/schema.ts";
import { env, isProd } from "./env.ts";

export const db = drizzle({
  schema,
  connection: true
    ? {
        url: env.TURSO_CONNECTION_URL,
        authToken: env.TURSO_AUTH_TOKEN,
      }
    : {
        url: "file:test.db",
      },
});
