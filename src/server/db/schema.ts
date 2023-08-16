import {
    mysqlTable,
    int,
    serial,
    timestamp,
    tinytext,
    index,
    mysqlEnum,
} from "drizzle-orm/mysql-core";
import { createSelectSchema } from "drizzle-zod";
import { type AdapterAccount } from "@auth/core/adapters";
import { type z } from "zod";
import { relations } from "drizzle-orm";

export const users = mysqlTable("users", {
    id: serial("id").primaryKey(),
    name: tinytext("name"),
    email: tinytext("email").unique().notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }).defaultNow(),
    image: tinytext("image"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow(),
});
const UserSchema = createSelectSchema(users);
export type UserModel = z.infer<typeof UserSchema>;

export const usersRelations = relations(users, (params) => ({
    accounts: params.many(accounts),
    sessions: params.many(sessions),
    roles: params.many(roles),
}));

export const accounts = mysqlTable("accounts", {
    id: serial("id").primaryKey(),
    userId: serial("userId").references(() => users.id, { onDelete: "cascade" }),
    type: tinytext("type").$type<AdapterAccount["type"]>().notNull(),
    provider: tinytext("provider").notNull(),
    providerAccountId: tinytext("providerAccountId").notNull(),
    refresh_token: tinytext("refresh_token"),
    access_token: tinytext("access_token"),
    expires_at: int("expires_at"),
    token_type: tinytext("token_type"),
    scope: tinytext("scope"),
    id_token: tinytext("id_token"),
    session_state: tinytext("session_state"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow(),
}, (account) => ({
    idx_provider_providerAccountId: index("idx_provider_providerAccountId").on(account.provider, account.providerAccountId),
}));
const AccountSchema = createSelectSchema(accounts);
export type AccountModel = z.infer<typeof AccountSchema>;

export const accountsRelations = relations(accounts, (params) => ({
    user: params.one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable("sessions", {
    id: serial("id").primaryKey(),
    userId: serial("userId").references(() => users.id, { onDelete: "cascade" }),
    sessionToken: tinytext("sessionToken").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
}, (s) => ({
    idx_session_token: index("idx_sessionToken").on(s.sessionToken),
}));
const SessionSchema = createSelectSchema(sessions);
export type SessionModel = z.infer<typeof SessionSchema>;

export const sessionsRelations = relations(sessions, (params) => ({
    user: params.one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable("verificationToken", {
    id: serial("id").primaryKey(),
    identifier: tinytext("identifier").notNull(),
    token: tinytext("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
    idx_identifier_token: index("idx_identifier_token").on(vt.identifier, vt.token),
}));

export const roles = mysqlTable("roles", {
    id: serial("id").primaryKey(),
    name: mysqlEnum("name", ["user", "admin"]).notNull().unique(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow(),
});
const RoleSchema = createSelectSchema(roles);
export type RoleModel = z.infer<typeof RoleSchema>;

export const rolesRelations = relations(roles, (params) => ({
    userRoles: params.many(userRoles),
}));

export const userRoles = mysqlTable("userRoles", {
    id: serial("id").primaryKey(),
    userId: serial("userId").references(() => users.id, { onDelete: "cascade" }),
    roleId: serial("roleId").references(() => roles.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow(),
}, (ur) => ({
    idx_userId: index("idx_userId").on(ur.userId),
    idx_roleId: index("idx_roleId").on(ur.roleId),
}));
const UserRolesSchema = createSelectSchema(roles);
export type UserRolesModel = z.infer<typeof UserRolesSchema>;

export const userRolesRelations = relations(userRoles, (params) => ({
    user: params.one(users, { fields: [userRoles.userId], references: [users.id] }),
    role: params.one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));
