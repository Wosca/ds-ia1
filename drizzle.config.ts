import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
    database: "postgres",
    port: 6543,
    host: "aws-0-ap-southeast-2.pooler.supabase.com",
    user: "postgres.uephzqfhjxtcxxjkdglk",
    password: env.DATABASE_PASS || "",
  },
} satisfies Config;
