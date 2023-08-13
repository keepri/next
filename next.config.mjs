import { dirname, join } from "path";

await import("./src/utils/env.mjs");

/** @type {import("next").NextConfig} */
export default {
    eslint: {
        ignoreDuringBuilds: process.env.NODE_ENV === "production" ? true : false,
    },
    swcMinify: true,
    reactStrictMode: true,
    distDir: join(dirname("."), ".next"),
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV === "production" ? true : false,
    },
};
