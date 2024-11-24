import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  schema: "./src/adapters/drizzle/pgSchema.ts",
  out: "./migrations",
  dialect: "postgresql"
});
