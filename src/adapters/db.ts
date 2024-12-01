import { drizzle as drizzlePgLite } from 'drizzle-orm/pglite';
import * as schema from "./drizzle/schema.ts";
import { secretEnv } from "./env.secret.ts";
import { isProd } from './env.public.ts';
import { drizzle } from 'drizzle-orm/node-postgres';

export const testDbReallySeriously = drizzlePgLite({
  schema,
  logger: false
});


export const db = isProd ? testDbReallySeriously : drizzle({ 
  schema,
  connection: { 
    connectionString: secretEnv.POSTGRES_CONNECTION_URL
  }
});
