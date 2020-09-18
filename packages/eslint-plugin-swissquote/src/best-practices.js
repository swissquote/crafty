const restrictedGlobals = require("confusing-browser-globals");

const { addMissingRules } = require("./utils");

module.exports = {
  rules: {
    // Best practices
    "array-callback-return": "error",
    "block-scoped-var": "error",
    camelcase: ["error", { properties: "never" }],
    "consistent-return": "error",
    curly: ["error", "all"],
    "dot-notation": ["error", { allowKeywords: true }],
    eqeqeq: ["error", "smart"],
    "guard-for-in": "error",
    "no-alert": "error",
    "no-caller": "error",
    "no-case-declarations": "error",
    "no-catch-shadow": "error",
    "no-delete-var": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-fallthrough": "error",
    "no-global-assign": "error",
    "no-implied-eval": "error",
    "no-iterator": "error",
    "no-label-var": "error",
    "no-labels": ["error", { allowLoop: true, allowSwitch: true }],
    "no-loop-func": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-octal": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "error",
    "no-proto": "error",
    "no-redeclare": "error",
    "no-return-assign": "error",
    "no-script-url": "error",
    "no-self-assign": "error",
    "no-sequences": "error",
    "no-shadow": "error",
    "no-throw-literal": "error",
    "no-undef": "error",
    "no-undef-init": "error",
    "no-unused-labels": "error",
    "no-unused-vars": [
      "error",
      { args: "none", vars: "local", ignoreRestSiblings: true }
    ],

    "no-useless-return": "error",
    "no-use-before-define": "error",
    radix: "error",
    "require-yield": "error",
    strict: "error",
    yoda: ["error", "never"],

    // Avoiding errors
    "for-direction": "error",
    "getter-return": ["error", { allowImplicit: true }],
    "no-await-in-loop": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": "error",
    "no-console": "warn",
    "no-constant-condition": "error",
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-dupe-args": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-ex-assign": "error",
    "no-extra-boolean-cast": "error",
    "no-func-assign": "error",
    "no-inner-declarations": "error",
    "no-invalid-regexp": "error",
    "no-irregular-whitespace": "error",
    "no-obj-calls": "error",
    "no-regex-spaces": "error",
    "no-template-curly-in-string": "error",
    "no-unexpected-multiline": "error",
    "no-unreachable": "error",
    "no-restricted-globals": ["error"].concat(restrictedGlobals),
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "use-isnan": "error",
    "valid-typeof": "error",
    "@swissquote/swissquote/sonarjs/no-duplicate-string": ["error", 10]
  }
};

addMissingRules(
  require("eslint-plugin-sonarjs").configs.recommended.rules,
  module.exports.rules
);
