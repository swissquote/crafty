const { getExternals } = require("../../utils/externals");

const commonExternals = {
  // Provided by other Crafty packages
  ...getExternals(),

  stylelint: "../../shims/stylelint.js",
  "stylelint/lib/utils/optionsMatches":
    "../../shims/stylelint-optionsMatches.js"
};

module.exports = [
  {
    name: "stylelint-prettier-package",
    externals: {
      ...commonExternals,

      // We don't need most prettier parsers
      "./parser-angular.js": "../../shims/prettier-parser.js",
      "./parser-babel.js": "../../shims/prettier-parser.js",
      "./parser-espree.js": "../../shims/prettier-parser.js",
      "./parser-flow.js": "../../shims/prettier-parser.js",
      "./parser-glimmer.js": "../../shims/prettier-parser.js",
      "./parser-graphql.js": "../../shims/prettier-parser.js",
      "./parser-html.js": "../../shims/prettier-parser.js",
      "./parser-markdown.js": "../../shims/prettier-parser.js",
      "./parser-meriyah.js": "../../shims/prettier-parser.js",
      "./parser-typescript.js": "../../shims/prettier-parser.js",
      "./parser-yaml.js": "../../shims/prettier-parser.js"
    }
  },
  {
    name: "postcss-selector-parser-package",
    externals: {}
  },
  {
    name: "stylelint-scss-package",
    externals: {
      ...commonExternals,

      // We use other packages created here
      "postcss-selector-parser": "./postcss-selector-parser-package.js",

      // We mock the few lodash functions really used
      lodash: "../../src/not-lodash.js"
    }
  },
  {
    name: "stylelint-config-packages",
    externals: {
      ...commonExternals,

      // We keep postcss-scss external so we can have it in common with preset-postcss
      postcss: "postcss",
      "postcss/lib/result": "postcss/lib/result",
      "postcss/lib/list": "postcss/lib/list",
      "postcss-scss": "postcss-scss",

      // Used by stylelint-no-unsupported-browser-features
      "caniuse-lite": "caniuse-lite",
      "/caniuse-lite(/.*)/": "caniuse-lite$1",

      // We use other packages created here
      "stylelint-prettier": "./stylelint-prettier-package.js",
      "stylelint-scss": "./stylelint-scss-package.js",
      "postcss-selector-parser": "./postcss-selector-parser-package.js",

      // We mock the few lodash functions really used
      lodash: "../../src/not-lodash.js"
    }
  },
  {
    name: "stylelint-utils-packages",
    externals: {
      "../reference/keywordSets": "../../shims/stylelint-keywordSets.js"
    }
  }
];
