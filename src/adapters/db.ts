import { drizzle as drizzlePgLite } from "drizzle-orm/pglite";
import * as schema from "./drizzle/schema.ts";
import { secretEnv } from "./env.secret.ts";
import { isProd } from "./env.public.ts";
import { drizzle } from "drizzle-orm/node-postgres";

export const testDbReallySeriously = drizzlePgLite({
  schema,
  logger: true,
});

export const db = isProd
  ? drizzle({
      schema,
      connection: {
        connectionString: secretEnv.POSTGRES_CONNECTION_URL,
      },
    })
  : testDbReallySeriously;
