/**
 * Organization seed script.
 * Creates the "Limitless Legacy" organization if it doesn't already exist,
 * using the Better Auth organization API directly against the database.
 *
 * Run with: pnpm db:seed
 */

import { eq } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/server/db/schema.js";
import { config } from "dotenv";

config({ path: ".env" });

const ORG_NAME = "Limitless Legacy";
const ORG_SLUG = "limitless-legacy";

async function seed() {
  const connection = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(connection, { schema });

  console.log("🌱 Running organization seed...");

  // Check if org already exists
  const existing = await db
    .select()
    .from(schema.organization)
    .where(eq(schema.organization.slug, ORG_SLUG))
    .limit(1);

  if (existing.length > 0) {
    console.log(
      `✅ Organization "${ORG_NAME}" already exists (id: ${existing[0]!.id}). Skipping.`
    );
    await connection.end();
    return;
  }

  // Create the organization
  const orgId = crypto.randomUUID();
  await db.insert(schema.organization).values({
    id: orgId,
    name: ORG_NAME,
    slug: ORG_SLUG,
    createdAt: new Date(),
  });

  console.log(
    `✅ Created organization "${ORG_NAME}" with slug "${ORG_SLUG}" (id: ${orgId})`
  );
  await connection.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
