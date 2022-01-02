const { getExternals } = require("../../utils/externals");

const commonExternals = {
  // Provided by other Crafty packages
  ...getExternals(),

  stylelint: "stylelint",
  "/stylelint(/.*)/": "stylelint$1"
};

module.exports = [
  {
    name: "stylelint-prettier-package",
    externals: {
      ...commonExternals,

      // We don't need most prettier parsers
      "./parser-angular.js": "prettier/parser-angular.js",
      "./parser-babel.js": "prettier/parser-babel.js",
      "./parser-espree.js": "prettier/parser-espree.js",
      "./parser-flow.js": "prettier/parser-flow.js",
      "./parser-glimmer.js": "prettier/parser-glimmer.js",
      "./parser-graphql.js": "prettier/parser-graphql.js",
      "./parser-html.js": "prettier/parser-html.js",
      "./parser-markdown.js": "prettier/parser-markdown.js",
      "./parser-meriyah.js": "prettier/parser-meriyah.js",
      "./parser-typescript.js": "prettier/parser-typescript.js",
      "./parser-yaml.js": "prettier/parser-yaml.js"
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
  }
];
