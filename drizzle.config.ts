import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/adapters/drizzle/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: "file:test.db"
  }
//   dbCredentials: {
//     url: process.env.TURSO_CONNECTION_URL!,
//     authToken: process.env.TURSO_AUTH_TOKEN!,
//   },
});