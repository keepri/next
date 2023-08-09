import {
    mysqlTable,
    primaryKey,
    int,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { createSelectSchema } from "drizzle-zod";
import { type AdapterAccount } from "@auth/core/adapters";
import { type z } from "zod";

export const users = mysqlTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }).defaultNow(),
    image: varchar("image", { length: 255 }),
});
export const UserSchema = createSelectSchema(users);
export type User = z.infer<typeof UserSchema>;

export const accounts = mysqlTable("accounts", {
    id: serial("id").primaryKey(),
    userId: serial("userId").references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 255 }),
    session_state: varchar("session_state", { length: 255 }),
}, (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
}));
export const AccountSchema = createSelectSchema(accounts);
export type Account = z.infer<typeof AccountSchema>;

export const sessions = mysqlTable("sessions", {
    id: serial("id").primaryKey(),
    userId: serial("userId").references(() => users.id, { onDelete: "cascade" }),
    sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});
export const SessionSchema = createSelectSchema(sessions);
export type Session = z.infer<typeof SessionSchema>;

export const verificationTokens = mysqlTable("verificationToken", {
    id: serial("id").primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token)
}));
