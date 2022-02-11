const { getExternals } = require("../../utils/externals");

const commonExternals = {
  // Provided by other Crafty packages
  ...getExternals(),

  stylelint: "../../shims/stylelint.js",
  "stylelint/lib/utils/optionsMatches":
    "../../shims/stylelint-optionsMatches.js"
};

const FAKE_PRETTIER_PARSER = "../../shims/prettier-parser.js";

module.exports = [
  {
    name: "stylelint-prettier-package",
    externals: {
      ...commonExternals,

      // We don't need most prettier parsers
      "./parser-angular.js": FAKE_PRETTIER_PARSER,
      "./parser-babel.js": FAKE_PRETTIER_PARSER,
      "./parser-espree.js": FAKE_PRETTIER_PARSER,
      "./parser-flow.js": FAKE_PRETTIER_PARSER,
      "./parser-glimmer.js": FAKE_PRETTIER_PARSER,
      "./parser-graphql.js": FAKE_PRETTIER_PARSER,
      "./parser-html.js": FAKE_PRETTIER_PARSER,
      "./parser-markdown.js": FAKE_PRETTIER_PARSER,
      "./parser-meriyah.js": FAKE_PRETTIER_PARSER,
      "./parser-typescript.js": FAKE_PRETTIER_PARSER,
      "./parser-yaml.js": FAKE_PRETTIER_PARSER
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
