module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    "vue/no-unused-vars": "warn",
    "prettier/prettier": [
      "error",
      {
        semi: true,
        useTabs: false,
        tabWidth: 2,
        trailingComma: "all",
        printWidth: 120,
        bracketSpacing: true,
        arrowParens: "always",
        endOfLine: "auto",
      },
    ],
  },
};
