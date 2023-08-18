import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession,
    type DefaultUser,
} from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { RoleManager } from "~/utils/managers/role";

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
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser { }
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
            }

            return params.session;
        },
        async signIn(params) {
            try {
                await RoleManager.assign(+params.user.id, "user");

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
