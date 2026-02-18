import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  { ignores: ["dist/", "node_modules/", "coverage/", "set-registry.js", "vitest.config.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettier,
  { rules: { "@typescript-eslint/no-explicit-any": "off" } }
);
