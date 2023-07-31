import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession,
    type DefaultUser,
} from "next-auth";

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
            // ...other properties
            // role: RoleName;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        // ...other properties
        // role: RoleName;
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        session(params) {
            if (params.user) {
                params.session.user.id = +params.user.id;
            }

            return params.session;
        },
    },
    providers: [],
};

export async function getSession$() {
    return getServerSession(authOptions);
}
