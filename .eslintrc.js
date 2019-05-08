module.exports = {
  extends: [
    // https://eslint.org/docs/rules/
    "eslint:recommended",
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended.json
    "plugin:@typescript-eslint/recommended",
    // https://prettier.io/docs/en/eslint.html
    "plugin:prettier/recommended",
  ],
  plugins: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  settings: {},
  rules: {
    "no-undef": "off", // useless in TypeScript
    "no-constant-condition": ["warn", { checkLoops: false }],
    "no-useless-escape": "warn",
    "no-console": "warn",
    "valid-typeof": "warn", // "bigint" is not yet supported

    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_|^intl$" }],
    "@typescript-eslint/array-type": ["error", "generic"],
    "@typescript-eslint/camelcase": "warn",
    "@typescript-eslint/class-name-casing": "warn", // to allow the initial underscore
    "@typescript-eslint/no-non-null-assertion": "warn", // NOTE: pay attention to it because it may cause unexpected behavior
    "@typescript-eslint/prefer-for-of": "warn",
    "@typescript-eslint/prefer-includes": "warn",
    "@typescript-eslint/prefer-string-starts-ends-with": "warn",
    "@typescript-eslint/no-use-before-define": "warn",

    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-var-requires": "off", // not a part of ECMA-262
    "@typescript-eslint/prefer-interface": "off",

    "prettier/prettier": "warn",
  },
};
