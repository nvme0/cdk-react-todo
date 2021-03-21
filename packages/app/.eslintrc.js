module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "react/react-in-jsx-scope": "off", // needed for NextJS's jsx without react import
    "react/prop-types": "off", // Disable prop-types as we use TypeScript for type checking
    "@typescript-eslint/explicit-function-return-type": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    // more config...
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/jsx-key": "off",
    "react-hooks/exhaustive-deps": "off",
    camelcase: ["off", { properties: "always" }],
    "@typescript-eslint/camelcase": "off",
  },
  globals: { React: "writable" },
};
