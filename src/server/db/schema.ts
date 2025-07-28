import { sql } from "drizzle-orm"
import {
  boolean,
  foreignKey,
  pgTableCreator,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `trackzy_${name}`)

//
export const user = createTable(
  "user",
  {
    id: text().primaryKey().notNull().default(sql`gen_random_uuid()::text`),
    name: text().notNull(),
    email: text().notNull(),
    image: text(),
    email_verified: boolean().notNull(),

    // timestamps
    created_at: timestamp({ mode: "string" }).notNull(),
    updated_at: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [unique("user_email_key").on(table.email)]
)

export const account = createTable(
  "account",
  {
    id: text().primaryKey().notNull().default(sql`gen_random_uuid()::text`),
    account_id: text().notNull(),
    provider_id: text().notNull(),
    user_id: text().notNull(),
    access_token: text(),
    refresh_token: text(),
    id_token: text(),
    access_token_expires_at: timestamp({ mode: "string" }),
    refresh_token_expires_at: timestamp({ mode: "string" }),
    scope: text(),
    password: text(),

    // timestamps
    created_at: timestamp({ mode: "string" }).notNull(),
    updated_at: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [user.id],
      name: "account_user_id_fkey",
    }),
  ]
)

export const session = createTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expires_at: timestamp({ mode: "string" }).notNull(),
    token: text().notNull(),
    ip_address: text(),
    user_agent: text(),
    user_id: text().notNull(),

    // timestamps
    created_at: timestamp({ mode: "string" }).notNull(),
    updated_at: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [user.id],
      name: "session_user_id_fkey",
    }),
    unique("session_token_key").on(table.token),
  ]
)

export const verification = createTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),

  // timestamps
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").$defaultFn(() => new Date()),
  updated_at: timestamp("updated_at").$defaultFn(() => new Date()),
})
