module.exports = [
  {
    name: "stylelint-packages",
    externals: {
      browserslist: "@swissquote/crafty/packages/browserslist",
      postcss: "postcss",
      "postcss/lib/result": "postcss/lib/result",
      "postcss/lib/list": "postcss/lib/list",
      "postcss-scss": "postcss-scss",
      prettier: "prettier",
      stylelint: "stylelint",
      "stylelint/lib/utils/optionsMatches":
       "stylelint/lib/utils/optionsMatches",
      "caniuse-lite": "caniuse-lite"
    }
  }
];
