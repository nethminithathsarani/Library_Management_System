import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config'} */
export default [
  {
    languageOptions: {
      globals: globals.node, // Set global environment to Node.js
      ecmaVersion: "latest",
      sourceType: "module"
    },
    env: {
      node: true,
      es2021: true
    },
    extends: ["eslint:recommended"],
    rules: {}
  },
  pluginJs.configs.recommended
];
