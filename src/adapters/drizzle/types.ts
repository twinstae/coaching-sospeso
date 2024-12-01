import type { PgliteDatabase } from "drizzle-orm/pglite/driver";
import * as schema from "./schema.ts";
import type { NodePgDatabase } from "drizzle-orm/node-postgres/driver";

export type DrizzlePostgresDb =
  | PgliteDatabase<typeof schema>
  | NodePgDatabase<typeof schema>;
