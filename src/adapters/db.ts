import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./drizzle/schema.ts";

export const db = drizzle({
  schema,
  connection: {
    url: "file:test.db",
  },
});
