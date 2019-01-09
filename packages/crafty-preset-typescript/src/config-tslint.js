function warn() {
  // When running in development mode, some errors can just be warnings.
  // Some errors don't need to break the build if they aren't threatening the functionality.
  return process.env.NODE_ENV === "development" ? "warning" : "error";
}

function fullWarn() {
  return process.env.NODE_ENV === "development"
    ? { severity: "warning" }
    : true;
}

module.exports = {
  extends: [require.resolve("tslint-eslint-rules")],
  rules: {
    // legacy
    "class-name": true,
    "no-internal-module": true,
    "one-line": [true, "check-open-brace", "check-whitespace"],
    "typedef-whitespace": [
      true,
      {
        "call-signature": "nospace",
        "index-signature": "nospace",
        parameter: "nospace",
        "property-declaration": "nospace",
        "variable-declaration": "nospace"
      }
    ],
    whitespace: [
      true,
      "check-branch",
      "check-decl",
      "check-operator",
      "check-separator",
      "check-type"
    ],

    // Best practices
    //"array-callback-return": true,
    //"accessor-pairs": true,
    "variable-name": [
      true,
      "check-format",
      "ban-keywords",
      "allow-pascal-case"
    ],
    //"consistent-return": true,
    curly: ["error", "all"],
    "dot-notation": ["error", { allowKeywords: true }],
    "triple-equals": [true, "allow-null-check"],
    forin: true,
    ban: true,
    "no-arg": true,
    //"no-case-declarations": true,
    //"no-catch-shadow": true,
    "no-eval": true,
    //"no-extend-native": true,
    //"no-extra-bind": true,
    "no-switch-case-fall-through": true,
    //"no-implied-eval": true,
    //"no-iterator": true,
    //"no-label-var": true,
    "label-position": [
      "error",
      {
        allowLoop: true,
        allowSwitch: true
      }
    ],
    //"no-loop-func": true,
    //"no-unused-expression": true,
    //"no-new-func": true,
    //"no-octal-escape": true,
    //"no-param-reassign": true,
    //"no-proto": true,
    "no-duplicate-variable": true,
    //"no-return-assign": true,
    //"no-script-url": true,
    //"no-self-assign": true,
    //"no-sequences": true,
    "no-shadowed-variable": true,
    "no-string-throw": true,
    //"no-undef-init": true,
    //"no-unused-labels": true,
    "no-unused-variable": ["error", "local"],
    //"no-use-before-declare": true,
    radix: true,
    //"require-yield": true,
    yoda: ["error", "never"],
    "no-conditional-assignment": true,
    "no-console": fullWarn(),
    "no-constant-condition": true,
    "no-control-regex": true,
    "no-debugger": true,
    "no-duplicate-case": true,
    "no-ex-assign": true,
    "no-extra-boolean-cast": true,
    "no-inner-declarations": true,
    "no-invalid-regexp": true,
    "ter-no-irregular-whitespace": true,
    "no-regex-spaces": true,
    "no-unexpected-multiline": true,
    "no-unsafe-finally": true,
    "use-isnan": true,
    "valid-jsdoc": [
      true,
      {
        requireParamType: false,
        requireReturn: false,
        requireReturnType: false,
        requireReturnDescription: false
      }
    ],
    "valid-typeof": true,

    // ES6
    //"no-class-assign": true,
    //"no-empty-pattern": true,
    //"no-new-symbol": true,
    //"no-useless-constructor": true,
    "no-var-keyword": true,
    "object-literal-shorthand": [
      "error",
      "always",
      {
        ignoreConstructors: false,
        avoidQuotes: true
      }
    ],
    "ter-prefer-arrow-callback": [
      "error",
      {
        allowNamedFunctions: false,
        allowUnboundThis: true
      }
    ],
    "prefer-const": [
      "error",
      {
        destructuring: "all",
        ignoreReadBeforeAssign: true
      }
    ],
    //"prefer-rest-params": true,
    //"prefer-spread": true,
    "prefer-template": true,

    // formatting
    "ter-arrow-spacing": [
      "warn",
      {
        before: true,
        after: true
      }
    ],
    "brace-style": ["warn", "1tbs"],
    "trailing-comma": ["warn", "never"],
    "comma-spacing": [
      "warn",
      {
        before: false,
        after: true
      }
    ],
    "generator-star-spacing": [
      "error",
      {
        before: false,
        after: true
      }
    ],
    "ter-indent": [
      "warn",
      2,
      {
        SwitchCase: 1,
        ignoredNodes: ["ConditionalExpression"]
      }
    ],
    "jsx-quotes": ["warn", "prefer-double"],
    //"keyword-spacing": fullWarn(),
    "new-parens": fullWarn(),
    //"no-array-constructor": fullWarn(),
    "no-bitwise": fullWarn(),
    "no-empty": fullWarn(),
    "no-empty-character-class": fullWarn(),
    "no-extra-parens": [
      "warn",
      "all",
      {
        nestedBinaryExpressions: false,
        conditionalAssign: false,
        ignoreJSX: "multi-line"
      }
    ],
    "no-extra-semi": fullWarn(),
    //"no-floating-decimal": fullWarn(),
    //"no-lone-blocks": fullWarn(),
    //"no-multi-str": fullWarn(),
    "no-multi-spaces": fullWarn(),
    //"no-negated-condition": fullWarn(),
    //"no-nested-ternary": fullWarn(),
    //"no-new-object": fullWarn(),
    "no-construct": fullWarn(),
    //"no-self-compare": fullWarn(),
    //"no-shadow-restricted-names": fullWarn(),
    //"no-spaced-func": fullWarn(),
    "ter-no-sparse-arrays": fullWarn(),
    indent: { severity: warn(), options: ["spaces"] },
    "no-trailing-whitespace": fullWarn(),
    //"no-useless-concat": fullWarn(),
    //"no-void": fullWarn(),
    //"no-with": fullWarn(),
    quotemark: {
      severity: warn(),
      options: ["double", "avoid-escape"]
    },
    semicolon: {
      severity: warn(),
      options: ["always", "ignore-interfaces", "ignore-bound-class-methods"]
    },
    //"space-infix-ops": fullWarn(),
    "space-unary-ops": [
      "warn",
      {
        words: true,
        nonwords: false
      }
    ],
    //"template-curly-spacing": fullWarn(),
    "yield-star-spacing": ["warn", "after"]
  }
};
