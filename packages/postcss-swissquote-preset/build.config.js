module.exports = [
  {
    name: "postcss-packages",
    externals: {
      browserslist: "@swissquote/crafty-commons/packages/browserslist",
      glob: "@swissquote/crafty-commons/packages/glob",
      minimatch: "@swissquote/crafty-commons/packages/minimatch",
      "caniuse-lite": "caniuse-lite", // caniuse-lite will still be imported by autoprefixer
      "caniuse-lite/data/features/css-sticky":
        "caniuse-lite/data/features/css-sticky",
      "caniuse-lite/data/features/border-radius":
        "caniuse-lite/data/features/border-radius",
      "caniuse-lite/data/features/css-boxshadow":
        "caniuse-lite/data/features/css-boxshadow",
      "caniuse-lite/data/features/css-animation":
        "caniuse-lite/data/features/css-animation",
      "caniuse-lite/data/features/css-transitions":
        "caniuse-lite/data/features/css-transitions",
      "caniuse-lite/data/features/transforms2d":
        "caniuse-lite/data/features/transforms2d",
      "caniuse-lite/data/features/transforms3d":
        "caniuse-lite/data/features/transforms3d",
      "caniuse-lite/data/features/css-gradients":
        "caniuse-lite/data/features/css-gradients",
      "caniuse-lite/data/features/css3-boxsizing":
        "caniuse-lite/data/features/css3-boxsizing",
      "caniuse-lite/data/features/css-filters":
        "caniuse-lite/data/features/css-filters",
      "caniuse-lite/data/features/css-filter-function":
        "caniuse-lite/data/features/css-filter-function",
      "caniuse-lite/data/features/css-backdrop-filter":
        "caniuse-lite/data/features/css-backdrop-filter",
      "caniuse-lite/data/features/css-element-function":
        "caniuse-lite/data/features/css-element-function",
      "caniuse-lite/data/features/multicolumn":
        "caniuse-lite/data/features/multicolumn",
      "caniuse-lite/data/features/user-select-none":
        "caniuse-lite/data/features/user-select-none",
      "caniuse-lite/data/features/flexbox":
        "caniuse-lite/data/features/flexbox",
      "caniuse-lite/data/features/calc": "caniuse-lite/data/features/calc",
      "caniuse-lite/data/features/background-img-opts":
        "caniuse-lite/data/features/background-img-opts",
      "caniuse-lite/data/features/background-clip-text":
        "caniuse-lite/data/features/background-clip-text",
      "caniuse-lite/data/features/font-feature":
        "caniuse-lite/data/features/font-feature",
      "caniuse-lite/data/features/font-kerning":
        "caniuse-lite/data/features/font-kerning",
      "caniuse-lite/data/features/border-image":
        "caniuse-lite/data/features/border-image",
      "caniuse-lite/data/features/css-selection":
        "caniuse-lite/data/features/css-selection",
      "caniuse-lite/data/features/css-placeholder":
        "caniuse-lite/data/features/css-placeholder",
      "caniuse-lite/data/features/css-placeholder-shown":
        "caniuse-lite/data/features/css-placeholder-shown",
      "caniuse-lite/data/features/css-hyphens":
        "caniuse-lite/data/features/css-hyphens",
      "caniuse-lite/data/features/fullscreen":
        "caniuse-lite/data/features/fullscreen",
      "caniuse-lite/data/features/css-autofill":
        "caniuse-lite/data/features/css-autofill",
      "caniuse-lite/data/features/css3-tabsize":
        "caniuse-lite/data/features/css3-tabsize",
      "caniuse-lite/data/features/intrinsic-width":
        "caniuse-lite/data/features/intrinsic-width",
      "caniuse-lite/data/features/css3-cursors-newer":
        "caniuse-lite/data/features/css3-cursors-newer",
      "caniuse-lite/data/features/css3-cursors-grab":
        "caniuse-lite/data/features/css3-cursors-grab",
      "caniuse-lite/data/features/pointer":
        "caniuse-lite/data/features/pointer",
      "caniuse-lite/data/features/text-decoration":
        "caniuse-lite/data/features/text-decoration",
      "caniuse-lite/data/features/text-size-adjust":
        "caniuse-lite/data/features/text-size-adjust",
      "caniuse-lite/data/features/css-masks":
        "caniuse-lite/data/features/css-masks",
      "caniuse-lite/data/features/css-clip-path":
        "caniuse-lite/data/features/css-clip-path",
      "caniuse-lite/data/features/css-boxdecorationbreak":
        "caniuse-lite/data/features/css-boxdecorationbreak",
      "caniuse-lite/data/features/object-fit":
        "caniuse-lite/data/features/object-fit",
      "caniuse-lite/data/features/css-shapes":
        "caniuse-lite/data/features/css-shapes",
      "caniuse-lite/data/features/text-overflow":
        "caniuse-lite/data/features/text-overflow",
      "caniuse-lite/data/features/css-deviceadaptation":
        "caniuse-lite/data/features/css-deviceadaptation",
      "caniuse-lite/data/features/css-media-resolution":
        "caniuse-lite/data/features/css-media-resolution",
      "caniuse-lite/data/features/css-text-align-last":
        "caniuse-lite/data/features/css-text-align-last",
      "caniuse-lite/data/features/css-crisp-edges":
        "caniuse-lite/data/features/css-crisp-edges",
      "caniuse-lite/data/features/css-logical-props":
        "caniuse-lite/data/features/css-logical-props",
      "caniuse-lite/data/features/css-appearance":
        "caniuse-lite/data/features/css-appearance",
      "caniuse-lite/data/features/css-snappoints":
        "caniuse-lite/data/features/css-snappoints",
      "caniuse-lite/data/features/css-regions":
        "caniuse-lite/data/features/css-regions",
      "caniuse-lite/data/features/css-image-set":
        "caniuse-lite/data/features/css-image-set",
      "caniuse-lite/data/features/css-writing-mode":
        "caniuse-lite/data/features/css-writing-mode",
      "caniuse-lite/data/features/css-cross-fade":
        "caniuse-lite/data/features/css-cross-fade",
      "caniuse-lite/data/features/css-read-only-write":
        "caniuse-lite/data/features/css-read-only-write",
      "caniuse-lite/data/features/text-emphasis":
        "caniuse-lite/data/features/text-emphasis",
      "caniuse-lite/data/features/css-grid":
        "caniuse-lite/data/features/css-grid",
      "caniuse-lite/data/features/css-text-spacing":
        "caniuse-lite/data/features/css-text-spacing",
      "caniuse-lite/data/features/css-any-link":
        "caniuse-lite/data/features/css-any-link",
      "caniuse-lite/data/features/css-unicode-bidi":
        "caniuse-lite/data/features/css-unicode-bidi",
      "caniuse-lite/data/features/css-overscroll-behavior":
        "caniuse-lite/data/features/css-overscroll-behavior",
      "caniuse-lite/data/features/css-color-adjust":
        "caniuse-lite/data/features/css-color-adjust",
      "caniuse-lite/data/features/css-text-orientation":
        "caniuse-lite/data/features/css-text-orientation",
      "caniuse-lite/data/features/css-featurequeries.js":
        "caniuse-lite/data/features/css-featurequeries.js",

      // TODO :: add a check to make sure no other direct imports are added
      postcss: "postcss",
      "postcss/lib/container": "postcss/lib/container",
      "postcss/lib/input": "postcss/lib/input",
      "postcss/lib/parser": "postcss/lib/parser",
      "postcss/lib/node": "postcss/lib/node",
      "postcss/lib/comment": "postcss/lib/comment",
      "postcss/lib/list": "postcss/lib/list",
      "postcss/lib/tokenize": "postcss/lib/tokenize",
      "postcss/lib/stringifier": "postcss/lib/stringifier",

      // postcss-url depends on make-dir
      // Since make-dir depends on semver that makes a big dependency
      // make-dir is also not that needed since we depend on Node 12 at least
      // This smaller version does reduces dependencies and is just enough to run
      "make-dir": "../../src/make-dir.js"
    }
  }
];
