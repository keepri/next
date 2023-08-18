import { eq, and } from "drizzle-orm";
import { db } from "~/server/db";
import { roles, userRoles, type RoleModel, type UserModel } from "~/server/db/schema";

export class RoleManager {
    static async getByName<TColumns extends keyof RoleModel>(
        roleName: RoleModel["name"],
        columns?: Partial<Record<TColumns, boolean>>,
    ): Promise<Pick<RoleModel, TColumns> | undefined> {
        const role = await db.query.roles
            .findFirst({ where: eq(roles.name, roleName), columns });

        // FIXME ugh...
        return role as unknown as Pick<RoleModel, TColumns> | undefined;
    }

    static async getByNameOrThrow<TColumns extends keyof RoleModel>(
        roleName: RoleModel["name"],
        columns?: Partial<Record<TColumns, boolean>>,
    ): Promise<Pick<RoleModel, TColumns>> {
        const role = await this.getByName(roleName, columns);
        if (!role) {
            throw new Error(`Could not find role "${roleName}"`);
        }

        // FIXME ugh...
        return role as unknown as Pick<RoleModel, TColumns>;
    }

    static async getById<TColumns extends keyof RoleModel>(
        id: RoleModel["id"],
        columns?: Partial<Record<TColumns, boolean>>,
    ): Promise<Pick<RoleModel, TColumns> | undefined> {
        const role = await db.query.roles
            .findFirst({ where: eq(roles.id, id), columns });

        // FIXME ugh...
        return role as unknown as Pick<RoleModel, TColumns> | undefined;
    }

    static async getByIdOrThrow<TColumns extends keyof RoleModel>(
        id: RoleModel["id"],
        columns?: Partial<Record<TColumns, boolean>>,
    ): Promise<Pick<RoleModel, TColumns>> {
        const role = await this.getById(id, columns);
        if (!role) {
            throw new Error(`Could not find role "${id}"`);
        }

        // FIXME ugh...
        return role as unknown as Pick<RoleModel, TColumns>;
    }

    static async getUserRoles(id: UserModel["id"]): Promise<Array<RoleModel["name"]>> {
        const roleList = await db.query.userRoles.findMany({
            where: eq(userRoles.userId, id),
            columns: {},
            with: { role: { columns: { name: true } } },
        });

        const roleNameList = Array(roleList.length) as Array<RoleModel["name"]>;
        for (const userRole of roleList) {
            roleNameList.push(userRole.role.name);
        }

        return roleNameList;
    }

    static async assign(id: number, roleName: RoleModel["name"]): Promise<void> {
        const role = await this.getByNameOrThrow(roleName, { id: true });
        const userRole = await db.query.userRoles
            .findFirst({
                where: and(eq(userRoles.userId, id), eq(userRoles.roleId, role.id)),
                columns: {},
            });

        if (!userRole) {
            await db.insert(userRoles).values({ userId: id, roleId: role.id });
            console.log(`assigned user ${id} the role of ${roleName}`);
        }
    }

    static async isAdmin(id: number): Promise<boolean> {
        const adminRole = await this.getByNameOrThrow("admin", { id: true });
        const userAdminRole = await db.query.userRoles.findFirst({
            where: and(eq(userRoles.userId, id), eq(userRoles.roleId, adminRole.id)),
            columns: {},
        });

        return userAdminRole ? true : false;
    }
}
