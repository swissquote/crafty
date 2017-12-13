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
  rules: {
    // Formatting
    // ---------------------------------------------------------------------
    "at-rule-empty-line-before": warn("always", {
      except: ["blockless-after-blockless", "first-nested"],
      ignore: ["after-comment"],
      ignoreAtRules: ["else"]
    }),
    "block-closing-brace-newline-after": warn("always"),
    // [SPEC] The closing brace MUST be on the next line after the body
    "block-closing-brace-newline-before": warn("always-multi-line"),
    "block-closing-brace-space-before": warn("always-single-line"),
    "block-no-empty": warn(),
    // [SPEC] The opening brace MUST be the last element of the line
    "block-opening-brace-newline-after": warn("always-multi-line"),
    "block-opening-brace-space-after": warn("always-single-line"),
    // [SPEC] There MUST be one space before the opening brace
    "block-opening-brace-space-before": warn("always"),
    "color-hex-case": warn("lower"),
    "color-hex-length": warn("short"),
    //"comment-whitespace-inside": warn("always"),
    "declaration-bang-space-after": warn("never"),
    "declaration-bang-space-before": warn("always"),
    "declaration-block-semicolon-newline-after": warn("always-multi-line"),
    "declaration-block-semicolon-space-after": warn("always-single-line"),
    "declaration-block-semicolon-space-before": warn("never"),
    "declaration-block-single-line-max-declarations": warn(1),
    // [SPEC] The last declaration MUST have a semicolon
    "declaration-block-trailing-semicolon": warn("always"),
    // [SPEC] There MUST be a space after our property–value delimiting colon (:)
    "declaration-colon-space-after": warn("always-single-line"),
    "declaration-colon-space-before": warn("never"),
    "function-comma-newline-after": warn("always-multi-line"),
    "function-comma-space-after": warn("always-single-line"),
    "function-comma-space-before": warn("never"),
    "function-parentheses-newline-inside": warn("always-multi-line"),
    "function-parentheses-space-inside": warn("never-single-line"),
    "function-whitespace-after": warn("always"),
    // "function-url-quotes": "double", // Does not work with variables
    // [SPEC] Code MUST use an indent of 4 spaces, and MUST NOT use tabs for indenting.
    indentation: warn(4),
    "max-empty-lines": warn(1),
    "media-feature-colon-space-after": warn("always"),
    "media-feature-colon-space-before": warn("never"),
    "media-feature-name-no-vendor-prefix": warn(),
    "media-feature-parentheses-space-inside": warn("never"),
    "media-feature-range-operator-space-after": warn("always"),
    "media-feature-range-operator-space-before": warn("always"),
    "media-query-list-comma-newline-after": warn("always-multi-line"),
    "media-query-list-comma-space-after": warn("always-single-line"),
    "media-query-list-comma-space-before": warn("never"),
    "no-eol-whitespace": warn(),
    "no-missing-end-of-source-newline": warn(),
    "number-leading-zero": warn("always"),
    "number-no-trailing-zeros": warn(),
    "length-zero-no-unit": warn(),
    "rule-empty-line-before": warn("always-multi-line", {
      except: ["first-nested"],
      ignore: ["after-comment"]
    }),
    "selector-combinator-space-after": warn("always"),
    "selector-combinator-space-before": warn("always"),
    "selector-list-comma-newline-after": warn("always-multi-line"),
    "selector-list-comma-space-before": warn("never"),
    "string-quotes": warn("double"),
    "value-list-comma-newline-after": warn("always-multi-line"),
    "value-list-comma-space-after": warn("always-single-line"),
    "value-list-comma-space-before": warn("never"),

    // [SPEC] A line MUST NOT exceed 80 characters.
    "max-line-length": [
      80,
      {
        ignore: "non-comments",
        severity: "warning" // let's be nice with our users ...
      }
    ],

    // Possible Errors
    // ---------------------------------------------------------------------
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "at-root",
          "if",
          "define-mixin",
          "mixin",
          "else",
          "each",
          "for"
        ]
      }
    ],
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
    "selector-pseudo-class-no-unknown": true,
    "selector-pseudo-element-no-unknown": true,
    "selector-pseudo-element-colon-notation": "single",
    "string-no-newline": true,
    "unit-no-unknown": true,

    // Limiting Language features
    // ---------------------------------------------------------------------
    "at-rule-no-vendor-prefix": true,
    "property-no-vendor-prefix": true,
    "selector-no-vendor-prefix": true,
    "value-no-vendor-prefix": true
  }
};
