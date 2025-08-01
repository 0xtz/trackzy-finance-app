import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  numeric,
  pgTableCreator,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `trackzy_${name}`);

// --- auth ---
export const user = createTable(
  "user",
  {
    id: text().primaryKey().notNull().default(sql`gen_random_uuid()::text`),
    name: text().notNull(),
    email: text().notNull(),
    image: text(),
    email_verified: boolean().notNull(),

    // timestamps
    created_at: timestamp({ mode: "date" }).notNull(),
    updated_at: timestamp({ mode: "date" }).notNull(),
  },
  (table) => [unique("user_email_key").on(table.email)]
);

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
    access_token_expires_at: timestamp({ mode: "date" }),
    refresh_token_expires_at: timestamp({ mode: "date" }),
    scope: text(),
    password: text(),

    // timestamps
    created_at: timestamp({ mode: "date" }).notNull(),
    updated_at: timestamp({ mode: "date" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [user.id],
      name: "account_user_id_fkey",
    }),
  ]
);

export const session = createTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expires_at: timestamp({ mode: "date" }).notNull(),
    token: text().notNull(),
    ip_address: text(),
    user_agent: text(),
    user_id: text().notNull(),

    // timestamps
    created_at: timestamp({ mode: "date" }).notNull(),
    updated_at: timestamp({ mode: "date" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [user.id],
      name: "session_user_id_fkey",
    }),
    unique("session_token_key").on(table.token),
  ]
);

export const verification = createTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),

  // timestamps
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").$defaultFn(() => new Date()),
  updated_at: timestamp("updated_at").$defaultFn(() => new Date()),
});

// --- app ---

// categories for organizing expenses/income
export const category = createTable(
  "category",
  {
    id: text().primaryKey().notNull().default(sql`gen_random_uuid()::text`),
    name: text().notNull(),
    icon: text(),
    color: text(),
    type: text().notNull(), // 'expense' or 'income'

    // foreign keys
    user_id: text().notNull(),

    // timestamps
    created_at: timestamp({ mode: "date" }).notNull(),
    updated_at: timestamp({ mode: "date" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [user.id],
      name: "category_user_id_fkey",
    }),
  ]
);

export const budget = createTable(
  "budget",
  {
    id: text().primaryKey().notNull().default(sql`gen_random_uuid()::text`),
    name: text().notNull(),
    description: text(),
    amount: numeric().notNull(),

    // foreign keys
    user_id: text().notNull(),

    // timestamps
    created_at: timestamp({ mode: "date" }).notNull(),
    updated_at: timestamp({ mode: "date" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [user.id],
      name: "budget_user_id_fkey",
    }),
  ]
);

export const income = createTable(
  "income",
  {
    id: text().primaryKey().notNull().default(sql`gen_random_uuid()::text`),
    name: text().notNull(),
    description: text(),
    amount: numeric().notNull(),
    date: timestamp({ mode: "date" }).notNull(), // when the income occurred
    icon: text(),

    // foreign keys
    user_id: text().notNull(),
    category_id: text(),

    // timestamps
    created_at: timestamp({ mode: "date" }).notNull(),
    updated_at: timestamp({ mode: "date" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [user.id],
      name: "income_user_id_fkey",
    }),
    foreignKey({
      columns: [table.category_id],
      foreignColumns: [category.id],
      name: "income_category_id_fkey",
    }),
  ]
);

export const expense = createTable(
  "expense",
  {
    id: text().primaryKey().notNull().default(sql`gen_random_uuid()::text`),
    name: text().notNull(),
    description: text(),
    amount: numeric().notNull(),
    date: timestamp({ mode: "date" }).notNull(), // when the expense occurred
    icon: text(),

    // foreign keys
    user_id: text().notNull(),
    category_id: text(),
    budget_id: text(), // optional: link to a budget

    // timestamps
    created_at: timestamp({ mode: "date" }).notNull(),
    updated_at: timestamp({ mode: "date" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [user.id],
      name: "expense_user_id_fkey",
    }),
    foreignKey({
      columns: [table.category_id],
      foreignColumns: [category.id],
      name: "expense_category_id_fkey",
    }),
    foreignKey({
      columns: [table.budget_id],
      foreignColumns: [budget.id],
      name: "expense_budget_id_fkey",
    }),
  ]
);
