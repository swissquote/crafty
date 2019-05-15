// Taken from https://github.com/stylelint/stylelint-config-suitcss/
// Changes since last import: https://github.com/suitcss/stylelint-config-suitcss/compare/4e09f16f7340d610348059ab73f24fb11488152d...master

function warn(value, options) {
  const opt = options || {};

  // When running in development mode, some errors can just be warnings.
  // Some errors don't need to break the build if they aren't threatening the functionality.
  if (process.env.NODE_ENV === "development") {
    opt.severity = "warning";
  }

  return [value || true, opt];
}

module.exports = {
  plugins: [
    require.resolve("./index"),
    require.resolve("stylelint-prettier"),
    require.resolve("stylelint-scss"),
    require.resolve("stylelint-no-unsupported-browser-features")
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
    // TODO :: check how we could write tabWidth to a .prettierrc
    "prettier/prettier": warn(true, { tabWidth: 4 }),

    "block-no-empty": warn(),
    "color-hex-length": warn("short"),

    // "function-url-quotes": "double", // Does not work with variables
    "media-feature-name-no-vendor-prefix": warn(),
    "media-feature-range-operator-space-after": warn("always"),
    "media-feature-range-operator-space-before": warn("always"),
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
    "function-calc-no-invalid": true,
    "function-calc-no-unspaced-operator": true,
    "function-linear-gradient-no-nonstandard-direction": true,
    "keyframe-declaration-no-important": true,
    "media-feature-name-no-unknown": true,
    "property-no-unknown": true,
    "selector-max-compound-selectors": 6,
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global"] }
    ],
    "selector-pseudo-element-no-unknown": true,
    "selector-pseudo-element-colon-notation": "single",
    "string-no-newline": true,
    "unit-no-unknown": [true, { ignoreUnits: ["x"] }],
    "swissquote/no-negative-var": true,

    // Limiting Language features
    // ---------------------------------------------------------------------
    "at-rule-no-vendor-prefix": true,
    "property-no-vendor-prefix": true,
    "selector-no-vendor-prefix": true,
    "value-no-vendor-prefix": true,

    // SCSS Rules
    // ---------------------------------------------------------------------
    "scss/at-rule-no-unknown": true
  }
};
