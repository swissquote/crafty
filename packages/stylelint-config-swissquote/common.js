// Taken from https://github.com/stylelint/stylelint-config-suitcss/
// Changes since last import: https://github.com/suitcss/stylelint-config-suitcss/compare/4e09f16f7340d610348059ab73f24fb11488152d...master

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function warn(value, options) {
  const opt = options || {};

  // When running in development mode, some errors can just be warnings.
  // Some errors don't need to break the build if they aren't threatening the functionality.
  if (process.env.NODE_ENV === "development") {
    opt.severity = "warning";
  }

  return [value || true, opt];
}

export default {
  plugins: [
    require.resolve("./index.js"),
    require.resolve("./packages/stylelint-prettier.js"),
    require.resolve("./packages/stylelint-scss.js")
  ],
  rules: {
    // Formatting
    // ---------------------------------------------------------------------

    // [SPEC] Code MUST use an indent of 4 spaces, and MUST NOT use tabs for indenting.
    // [SPEC] A line MUST NOT exceed 80 characters.
    // [SPEC] The last declaration MUST have a semicolon
    // [SPEC] The closing brace MUST be on the next line after the body
    // [SPEC] The opening brace MUST be the last element of the line
    // [SPEC] There MUST be one space before the opening brace
    // [SPEC] There MUST be a space after our property–value delimiting colon (:)
    "prettier/prettier": warn(true, { tabWidth: 4 }),

    "block-no-empty": warn(),
    "color-hex-length": warn("short"),

    // "function-url-quotes": "double", // Does not work with variables
    "media-feature-name-no-vendor-prefix": warn(),
    "length-zero-no-unit": warn(),

    // Possible Errors
    // ---------------------------------------------------------------------
    "color-no-invalid-hex": true,
    "declaration-block-no-duplicate-properties": [
      true,
      { ignore: "consecutive-duplicates-with-different-values" }
    ],
    "declaration-block-no-redundant-longhand-properties": true,
    "declaration-block-no-shorthand-property-overrides": true,
    "function-calc-no-unspaced-operator": true,
    "function-linear-gradient-no-nonstandard-direction": true,
    "keyframe-declaration-no-important": true,
    "media-feature-name-no-unknown": true,
    "property-no-unknown": true,
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global", "local"] }
    ],
    "selector-pseudo-element-no-unknown": true,
    "selector-pseudo-element-colon-notation": "single",
    "string-no-newline": true,
    "unit-no-unknown": [true, { ignoreUnits: ["x"] }],
    "swissquote/no-negative-var": true,

    // SCSS Rules
    // ---------------------------------------------------------------------
    "scss/at-rule-no-unknown": true
  }
};
