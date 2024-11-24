import { drizzle as drizzlePg } from "drizzle-orm/pglite";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./drizzle/schema.ts";
import * as pgSchema from "./drizzle/pgSchema.ts";
import { env, isProd } from "./env.ts";

export const db = drizzle({
  schema,
  connection: isProd
    ? {
        url: env.TURSO_CONNECTION_URL,
        authToken: env.TURSO_AUTH_TOKEN,
      }
    : {
        url: "file:test.db",
      },
});

export const pgDb = drizzlePg({
  schema: pgSchema
});