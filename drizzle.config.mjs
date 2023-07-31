import { env } from "~/env.mjs";

/** @type { import("drizzle-kit").Config } */
export default {
    strict: true,
    verbose: true,
    driver: "mysql2",
    dbCredentials: {
        connectionString: env.DATABASE_URL,
    },
    schema: "./src/server/db/schema.ts",
    out: "./src/server/db/drizzle",
};
