/**
 * Seed script.
 * 1. Creates the "Limitless Legacy" organization if it doesn't already exist.
 * 2. Seeds initial default site content copy into `siteContent` table if missing.
 *
 * Run with: pnpm db:seed
 */

import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../src/server/db/schema.js";

config({ path: ".env" });

const ORG_NAME = "Limitless Legacy";
const ORG_SLUG = "limitless-legacy";

export const defaultSiteContentItems = [
  {
    key: "brandName",
    label: "Brand Name",
    value: "Limitless Legacy",
    category: "general",
  },
  {
    key: "heroHeadline",
    label: "Hero Headline",
    value: "Personalized Learning Support Designed for Every Child",
    category: "hero",
  },
  {
    key: "heroDescription",
    label: "Hero Description",
    value:
      "Personalized learning plans, educational activities, and parent support tools created to help children build confidence, strengthen skills, and reach their potential.",
    category: "hero",
  },
  {
    key: "aboutSummary",
    label: "About Summary",
    value:
      "Limitless Legacy creates accessible learning opportunities and practical tools for families and educators while honoring every learner’s unique path.",
    category: "about",
  },
  {
    key: "footerDescription",
    label: "Footer Description",
    value: "Inclusive learning support for children, families, and educators.",
    category: "footer",
  },
  {
    key: "contactEmail",
    label: "Contact Email",
    value: "hello.limitlesslegacy@gmail.com",
    category: "contact",
  },
  {
    key: "assessmentDisclaimer",
    label: "Assessment Disclaimer",
    value:
      "This assessment is designed to help families identify supportive learning resources that may benefit their child. It does not diagnose disabilities or replace professional assessments. Every child learns differently, and this tool helps connect families with appropriate support options.",
    category: "assessment",
  },
];

async function seed() {
  const connection = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(connection, { schema });

  console.log("🌱 Running database seed...");

  // 1. Seed Organization
  const existingOrg = await db
    .select()
    .from(schema.organization)
    .where(eq(schema.organization.slug, ORG_SLUG))
    .limit(1);

  if (existingOrg.length > 0) {
    console.log(
      `✅ Organization "${ORG_NAME}" already exists (id: ${existingOrg[0]!.id}).`
    );
  } else {
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
  }

  // 2. Seed Site Content Items
  let seededContentCount = 0;
  for (const item of defaultSiteContentItems) {
    const existingContent = await db
      .select()
      .from(schema.siteContent)
      .where(eq(schema.siteContent.key, item.key))
      .limit(1);

    if (existingContent.length === 0) {
      await db.insert(schema.siteContent).values({
        key: item.key,
        label: item.label,
        value: item.value,
        category: item.category,
        updatedAt: new Date(),
      });
      seededContentCount++;
    }
  }

  console.log(`✅ Site Content: ${seededContentCount} new items seeded.`);

  await connection.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
