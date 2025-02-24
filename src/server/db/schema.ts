import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
export const createTable = pgTableCreator((name) => `${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"), // default is normal user; set to "admin" for admins
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const covid_countries = createTable("covid_countries", {
  country_code: varchar("country_code", { length: 10 }).notNull().primaryKey(),
  country_name: varchar("country_name", { length: 255 }).notNull(),
  whoregion: varchar("whoregion", { length: 50 }),
});

export const covid_cases = createTable("covid_cases", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  date_reported: timestamp("date_reported", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  country_code: varchar("country_code", { length: 10 })
    .notNull()
    .references(() => covid_countries.country_code),
  new_cases: integer("new_cases"),
  cumulative_cases: integer("cumulative_cases"),
  new_deaths: integer("new_deaths"),
  cumulative_deaths: integer("cumulative_deaths"),
});

export const covid_daily_stats = createTable("covid_daily_stats", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  country_code: varchar("country_code", { length: 10 })
    .unique()
    .notNull()
    .references(() => covid_countries.country_code),
  last_updated: timestamp("last_updated", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  total_cases: integer("total_cases").notNull().default(0),
  total_deaths: integer("total_deaths").notNull().default(0),
  new_cases_7day_avg: integer("new_cases_7day_avg").default(0),
  new_deaths_7day_avg: integer("new_deaths_7day_avg").default(0),
});

export const covidDailyStatsRelations = relations(
  covid_daily_stats,
  ({ one }) => ({
    country: one(covid_countries, {
      fields: [covid_daily_stats.country_code],
      references: [covid_countries.country_code],
    }),
  }),
);
