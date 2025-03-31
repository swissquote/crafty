import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default {
  extends: [require.resolve("./common.js")],
  plugins: [require.resolve("./index.js")],
  rules: {
    // Swissquote Guidelines
    // ---------------------------------------------------------------------

    // [SPEC] IDs MUST NOT be styled
    "selector-max-id": 0,

    // [SPEC] Nested selectors SHOULD NOT be nested more than 2 levels
    "max-nesting-depth": [2, { ignore: ["blockless-at-rules"] }],

    // - a state (is-*|has-*) MUST NOT be alone in the dom, it must be adjacent to the component it is related to.
    "swissquote/no-state-without-component": true,

    // - a hack (_*) MUST NOT be reassigned
    "swissquote/no-hack-reassignment": true,

    // - a utility (u-*) MUST NOT be reassigned
    "swissquote/no-utility-reassignment": true,

    // - bare tags (a, div, p ...) MUST NOT be reassigned outside of a scope (with the exception of base typography rules that will be applied to the whole page)
    "swissquote/no-type-outside-scope": true,

    // TODO :: enable this
    //"swissquote/no-block-inside-block": true,

    // Limiting Language features
    // ---------------------------------------------------------------------
    "at-rule-no-vendor-prefix": [true, { disableFix: true }],
    "property-no-vendor-prefix": [true, { disableFix: true }],
    "selector-no-vendor-prefix": [true, { disableFix: true }],
    "value-no-vendor-prefix": [true, { disableFix: true }],
    // Union class names won't be possible when using standard CSS nesting
    "scss/selector-no-union-class-name": [true, { severity: "warning" }],

    // Misc
    // ---------------------------------------------------------------------

    // Using a combination of big css files and many compound selectors can have a big performance impact.
    "selector-max-compound-selectors": 6
  },
  overrides: [
    {
      files: ["**/*.scss", "**/*.css", "!**/*.module.scss", "!**/*.module.css"],
      rules: {
        // - The first letter of a component MUST be uppercase.
        // - All class names MUST be lowercase/uppercase characters or numbers
        // - all class names MUST start with one of
        // - u-, t-, s-, is- or has-
        // - A capital letter to mark a component
        // - An underscore (_) followed by any of the previous to mark a Hack
        // - a component MUST follow the BEM notation for its childs and modifiers
        // - javascript (js-) and QA related classes (qa-) MUST NOT be styled
        // - SASS style variable substitutions are allowed
        "selector-class-pattern": [
          /^(_)?(?:(?:u|t|(?:i|ha)?s)+-[a-z$]+[a-zA-Z0-9$()]*|(?:[a-z$][a-zA-Z0-9$()]+-)?[A-Z$][a-zA-Z0-9$()]*(__[a-z0-9$][a-zA-Z0-9$()]*)*(--[a-z0-9$][a-zA-Z0-9$()]*)*)$/,
          {
            resolveNestedSelectors: true
          }
        ]
      }
    },
    {
      files: ["**/*.module.scss", "**/*.module.css"],
      rules: {
        // In css-modules, naming isn't as important,
        // but as it's going to be used in JS, camelCase is best
        // But in some cases, you might want to wrap a part in ":global" and this needs to support non-module patterns as well
        "selector-class-pattern": [
          /^(_)?(?:(?:u|t|(?:i|ha)?s)+-[a-z$]+[a-zA-Z0-9$()]*|(?:[a-z$][a-zA-Z0-9$()]+-)?[A-Z$][a-zA-Z0-9$()]*(__[a-z0-9$][a-zA-Z0-9$()]*)*(--[a-z0-9$][a-zA-Z0-9$()]*)*)$|^[a-z][a-zA-Z0-9]+$/,
          {
            resolveNestedSelectors: true
          }
        ]
      }
    }
  ]
};
