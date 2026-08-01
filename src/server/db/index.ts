import { createPool, type VercelPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: VercelPool | undefined;
};

const conn =
  globalForDb.conn ??
  createPool({
    connectionString: env.DATABASE_URL,
  });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

