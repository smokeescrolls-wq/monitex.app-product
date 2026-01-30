import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
    // Opcional (só se você usar shadow DB):
    // shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
  },
});
