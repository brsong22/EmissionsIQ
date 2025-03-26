import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        plugins: {
            js,
        },
        extends: [
            "eslint:recommended",
        ],
    },
    {
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "semi": "error",
            "prefer-const": "error",
            "indent": ["error", 4]
        },
    },
]);