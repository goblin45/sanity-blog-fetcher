// Prisma CLI config. DATABASE_URL must come from Infisical (injected into
// process.env), not from putting the connection string in the local .env.
// Run CLI via: dotenv -- infisical run -- prisma <command>
// (or project db:* scripts). Local .env holds INFISICAL_TOKEN only—see SETUP.md.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
