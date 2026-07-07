// oxlint configuration presets for Swissquote, mirroring the flavors of
// @swissquote/eslint-plugin-swissquote (recommended / node / legacy).
//
// These configs are an *approximate* equivalent of the ESLint presets: oxlint
// is a Rust linter and re-implements a large subset of the eslint /
// typescript-eslint / react / unicorn / import rules natively, but it cannot
// run the JavaScript-authored custom rules of eslint-plugin-swissquote.
// Formatting is intentionally NOT handled here, it is the job of oxfmt
// (@swissquote/crafty-preset-oxfmt).
//
// Reference: https://oxc.rs/docs/guide/usage/linter/config

// Best-practices rules, shared by `recommended` and `node`.
// Mirrors the intent of eslint-plugin-swissquote/src/best-practices.js
const bestPractices = {
  "array-callback-return": "error",
  "block-scoped-var": "error",
  "guard-for-in": "error",
  "no-alert": "warn",
  "no-caller": "error",
  "no-eval": "error",
  "no-extend-native": "error",
  "no-extra-bind": "error",
  "no-implied-eval": "error",
  "no-iterator": "error",
  "no-labels": "error",
  "no-label-var": "error",
  "no-loop-func": "error",
  "no-new": "error",
  "no-new-func": "error",
  "no-param-reassign": "off",
  "no-proto": "error",
  "no-restricted-globals": ["error", "event", "fdescribe"],
  "no-return-assign": "error",
  "no-script-url": "error",
  "no-self-compare": "error",
  "no-sequences": "error",
  "no-shadow": "off",
  "no-template-curly-in-string": "error",
  "no-throw-literal": "error",
  "no-use-before-define": "off",
  "no-useless-return": "error"
};

// ES2015+ rules, shared by `recommended` and `node`.
// Mirrors the intent of eslint-plugin-swissquote/src/es6-recommended.js
const es6Recommended = {
  "no-useless-computed-key": "error",
  "no-useless-constructor": "error",
  "no-useless-rename": "error",
  "no-var": "error",
  "object-shorthand": "error",
  "prefer-arrow-callback": "error",
  "prefer-const": "error",
  "prefer-numeric-literals": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",
  "prefer-template": "error",
  "symbol-description": "error"
};

// TypeScript best-practices, only applied to TS files via an override.
// Mirrors the intent of eslint-plugin-swissquote/src/typescript-best-practices.js
const typescriptBestPractices = {
  "typescript/no-explicit-any": "warn",
  "typescript/no-non-null-assertion": "warn",
  "typescript/consistent-type-imports": "warn",
  "typescript/no-empty-object-type": "warn"
};

const $schema =
  "./node_modules/@swissquote/oxlint-config-swissquote/node_modules/oxlint/configuration_schema.json";

const recommended = {
  $schema,
  plugins: [
    "typescript",
    "unicorn",
    "react",
    "jsx-a11y",
    "import",
    "promise",
    "oxc"
  ],
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn"
  },
  env: {
    browser: true,
    es2024: true
  },
  rules: {
    ...bestPractices,
    ...es6Recommended,
    // React, only relevant in the recommended (browser) flavor
    "react/jsx-key": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/no-children-prop": "error",
    "react/no-direct-mutation-state": "error",
    "unicorn/no-instanceof-array": "error"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
      rules: typescriptBestPractices
    }
  ]
};

const node = {
  $schema,
  plugins: ["typescript", "unicorn", "import", "promise", "oxc", "node"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn"
  },
  env: {
    node: true,
    es2024: true
  },
  rules: {
    ...bestPractices,
    ...es6Recommended
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
      rules: typescriptBestPractices
    }
  ]
};

// Legacy (ES5) code: keep correctness checks but drop the ES2015+ requirements
// that would be invalid in scripts targeting older runtimes.
const legacy = {
  $schema,
  plugins: ["unicorn", "oxc"],
  categories: {
    correctness: "error"
  },
  env: {
    browser: true
  },
  rules: {
    ...bestPractices,
    "no-var": "off",
    "prefer-const": "off",
    "prefer-template": "off",
    "object-shorthand": "off"
  }
};

export const configs = {
  recommended,
  node,
  legacy
};

export default { configs };
