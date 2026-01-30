const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const prettier = require("eslint-plugin-prettier");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",
        parserOptions: {},
    },

    plugins: {
        prettier,
        "simple-import-sort": simpleImportSort,
        "@typescript-eslint": typescriptEslint,
    },

    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts"],
        },

        "import/resolver": {
            typescript: {},
        },
    },

    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ),

    rules: {
        "prettier/prettier": "error",
        curly: "error",

        "max-len": ["error", {
            code: 120,
        }],

        "no-dupe-class-members": "off",
        "no-useless-constructor": "off",
        "@typescript-eslint/no-useless-constructor": "off",

        "@typescript-eslint/no-use-before-define": ["error", {
            functions: false,
            classes: false,
        }],

        "simple-import-sort/imports": ["error"],
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],

        "@typescript-eslint/ban-ts-comment": ["error", {
            "ts-expect-error": true,
            "ts-ignore": false,
            "ts-nocheck": true,
            "ts-check": false,
            minimumDescriptionLength: 3,
        }],
    },
}, globalIgnores(["**/lib", "types"])]);
