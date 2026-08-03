import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => user.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ],
);

// 1. Better Auth User Table (extended with role)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: varchar("role", { length: 50 }).default("parent").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

// 2. Packages & Pricing Table
export const packages = pgTable("package", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  price: integer("price"), // in cents, optional
  billingCycle: varchar("billing_cycle", { length: 50 }),
  features: jsonb("features").$type<string[]>().notNull(),
  purchaseUrl: text("purchase_url"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// 3. User Subscriptions / Package Purchases
export const userSubscriptions = pgTable("user_subscription", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  packageId: text("package_id")
    .notNull()
    .references(() => packages.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  amountPaid: integer("amount_paid"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// 4. Resource Library Table
export const resources = pgTable("resource", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description").notNull(),
  fileUrl: text("file_url").notNull(),
  coverImageUrl: text("cover_image_url"),
  downloadCount: integer("download_count").default(0).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// 5. Resource Downloads Tracking Table
export const resourceDownloads = pgTable("resource_download", {
  id: text("id").primaryKey(),
  resourceId: text("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  ipAddress: text("ip_address"),
  downloadedAt: timestamp("downloaded_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// 6. Parent Assessment Submissions Table
export const assessmentSubmissions = pgTable("assessment_submission", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  childAge: varchar("child_age", { length: 50 }),
  childGrade: varchar("child_grade", { length: 50 }),
  supportAreas: jsonb("support_areas").$type<string[]>().notNull(),
  challenges: jsonb("challenges").$type<string[]>(),
  preferences: jsonb("preferences").$type<string[]>(),
  goals: jsonb("goals").$type<string[]>(),
  recommendedPackageIds: jsonb("recommended_package_ids").$type<string[]>(),
  recommendedResourceIds: jsonb("recommended_resource_ids").$type<string[]>(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// 7. Recommendation Rules Table
export const recommendationRules = pgTable("recommendation_rule", {
  id: text("id").primaryKey(),
  triggerSupportArea: text("trigger_support_area").notNull(),
  targetPackageId: text("target_package_id").references(() => packages.id, {
    onDelete: "cascade",
  }),
  targetResourceId: text("target_resource_id").references(() => resources.id, {
    onDelete: "cascade",
  }),
  priority: integer("priority").default(1).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// 8. Contact Inquiries Table
export const contactSubmissions = pgTable("contact_submission", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("new").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
  session: many(session),
  subscriptions: many(userSubscriptions),
  assessmentSubmissions: many(assessmentSubmissions),
  resourceDownloads: many(resourceDownloads),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  subscriptions: many(userSubscriptions),
  recommendationRules: many(recommendationRules),
}));

export const userSubscriptionsRelations = relations(
  userSubscriptions,
  ({ one }) => ({
    user: one(user, {
      fields: [userSubscriptions.userId],
      references: [user.id],
    }),
    package: one(packages, {
      fields: [userSubscriptions.packageId],
      references: [packages.id],
    }),
  })
);

export const resourcesRelations = relations(resources, ({ many }) => ({
  downloads: many(resourceDownloads),
  recommendationRules: many(recommendationRules),
}));

export const resourceDownloadsRelations = relations(
  resourceDownloads,
  ({ one }) => ({
    resource: one(resources, {
      fields: [resourceDownloads.resourceId],
      references: [resources.id],
    }),
    user: one(user, {
      fields: [resourceDownloads.userId],
      references: [user.id],
    }),
  })
);

export const assessmentSubmissionsRelations = relations(
  assessmentSubmissions,
  ({ one }) => ({
    user: one(user, {
      fields: [assessmentSubmissions.userId],
      references: [user.id],
    }),
  })
);

export const recommendationRulesRelations = relations(
  recommendationRules,
  ({ one }) => ({
    package: one(packages, {
      fields: [recommendationRules.targetPackageId],
      references: [packages.id],
    }),
    resource: one(resources, {
      fields: [recommendationRules.targetResourceId],
      references: [resources.id],
    }),
  })
);
