module.exports = [
  {
    name: "stylelint-packages",
    externals: {
      browserslist: "@swissquote/crafty/packages/browserslist",
      postcss: "postcss",
      "postcss/lib/result": "postcss/lib/result",
      "postcss/lib/list": "postcss/lib/list",
      "postcss-scss": "postcss-scss",
      stylelint: "stylelint",
      "stylelint/lib/utils/optionsMatches":
        "stylelint/lib/utils/optionsMatches",
      "caniuse-lite": "caniuse-lite",

      // We don't need most prettier parsers
      "./parser-angular": "prettier/parser-angular",
      "./parser-babylon": "prettier/parser-babylon.js",
      "./parser-flow": "prettier/parser-flow.js",
      "./parser-glimmer": "prettier/parser-glimmer.js",
      "./parser-graphql": "prettier/parser-graphql.js",
      "./parser-html": "prettier/parser-html.js",
      "./parser-markdown": "prettier/parser-markdown.js",
      "./parser-typescript": "prettier/parser-typescript.js",
      "./parser-yaml": "prettier/parser-yaml.js",

      // We mock the few lodash functions really used
      lodash: "../../src/not-lodash.js"
    }
  }
];
