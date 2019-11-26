module.exports = {
  extends: [
    // https://eslint.org/docs/rules/
    "eslint:recommended",
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended.json
    "plugin:@typescript-eslint/recommended",
    // https://prettier.io/docs/en/eslint.html
    "plugin:prettier/recommended",

    // https://github.com/benmosher/eslint-plugin-import
    "plugin:import/recommended",
    "plugin:import/typescript",
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
    "no-var": "warn",
    "valid-typeof": "warn", // "bigint" is not yet supported
    "no-return-await": "warn",
    // "prefer-const": "warn", // TODO: AssemblyScript has different semantics.
    "guard-for-in": "warn",
    "curly": "warn",
    "no-param-reassign": "warn",
    "prefer-spread": "off",

    "import/no-unresolved": "off", // cannot handle `paths` in tsconfig
    "import/no-cycle": "error",
    "import/no-default-export": "error",

    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/array-type": ["warn", { default: "generic" }],
    "@typescript-eslint/camelcase": "warn",
    "@typescript-eslint/class-name-casing": "warn", // to allow the initial underscore
    "@typescript-eslint/no-non-null-assertion": "warn", // NOTE: pay attention to it because it may cause unexpected behavior
    "@typescript-eslint/prefer-for-of": "warn",
    "@typescript-eslint/prefer-includes": "warn",
    "@typescript-eslint/prefer-string-starts-ends-with": "warn",
    "@typescript-eslint/prefer-readonly": "warn",
    "@typescript-eslint/prefer-regexp-exec": "warn",
    "@typescript-eslint/no-use-before-define": "warn",
    "@typescript-eslint/await-thenable": "warn",
    "@typescript-eslint/no-for-in-array": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "@typescript-eslint/no-extra-non-null-assertion": "warn",

    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-var-requires": "off", // enforces `import x = require("x")`, which is TypeScript-specific
    "@typescript-eslint/prefer-interface": "off",
    "@typescript-eslint/no-empty-function": "off",

    "prettier/prettier": "warn",
  },
};
