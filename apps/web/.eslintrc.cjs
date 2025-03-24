/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@vernisai/eslint-config/index.js"],
  ignorePatterns: ["dist/**", "node_modules/**", ".eslintrc.cjs"],
};
