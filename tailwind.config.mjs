/** @type {import("tailwindcss").Config} */
export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            container: {
                center: true,
                padding: {
                    DEFAULT: "1rem",
                    sm: "2rem",
                    lg: "4rem",
                    xl: "5rem",
                    "2xl": "6rem",
                },

            },
            keyframes: {
                "wiggle": {
                    "0%, 100%": { transform: "translate(-3px)" },
                    "50%": { transform: "translate(3px)" },
                },
            },
            animation: {
                "wiggle": "wiggle 250ms ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
