// eslint-disable-next-line no-undef
module.exports = {
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "plugin:tailwindcss/recommended",
        "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    plugins: ["react", "@typescript-eslint", "react-refresh"],
    rules: {
        "react-refresh/only-export-components": "warn",
    },
    settings: {
        react: {
            version: "detect",
        },
        tailwindcss: {
            // These are the default values but feel free to customize
            callees: ["classnames", "clsx", "cn"],
            config: "tailwind.config.js", // returned from `loadConfig()` utility if not provided
            cssFiles: ["**/*.css", "!**/node_modules", "!**/.*", "!**/dist", "!**/build"],
            //   "cssFilesRefreshRate": 5_000,
            removeDuplicates: true,
            skipClassAttribute: false,
            whitelist: [],
            tags: [],
            classRegex: "^class(Name)?$", // can be modified to support custom attributes. E.g. "^tw$" for `twin.macro`
        },
    },
};
