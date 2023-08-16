import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession,
    type DefaultUser,
} from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type RoleModel } from "./db/schema";
import { db } from "./db";
import { RoleService } from "~/utils/service";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: number;
            roleList: Array<RoleModel["name"]>;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        roleList: Array<RoleModel["name"]>;
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    adapter: DrizzleAdapter(db),
    callbacks: {
        session(params) {
            if (params.user) {
                params.session.user.id = +params.user.id;
                params.session.user.roleList = params.user.roleList;
            }

            return params.session;
        },
        async signIn(params) {
            try {
                await RoleService.assign(+params.user.id, "user");
                params.user.roleList = await RoleService.getUserRoles(+params.user.id);

                return true;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch ({ message }: any) {
                console.error("sign in callback", message);
                return "failed signing in";
            }
        },

    },
    providers: [],
};

export async function getSession$() {
    return getServerSession(authOptions);
}
