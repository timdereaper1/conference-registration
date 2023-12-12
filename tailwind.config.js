// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { addDynamicIconSelectors } = require("@iconify/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                dark: {
                    DEFAULT: "#6E6B7B",
                    50: "#B9B9C3",
                    500: "#5E5873",
                },
                primary: {
                    DEFAULT: "#7367F0",
                    50: "#D8D6DE",
                },
                success: {
                    DEFAULT: "#28C76F",
                },
                warning: {
                    DEFAULT: "#FF9F43",
                },
            },
        },
    },
    plugins: [addDynamicIconSelectors()],
};
