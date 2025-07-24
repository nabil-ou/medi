module.exports = {
  extends: ["expo", "prettier", "plugin:jest/recommended"],
  plugins: ["prettier", "jest"],
  rules: {
    "prettier/prettier": "error",
  },
  env: {
    "jest/globals": true,
  },
};
