module.exports = [
  {
    name: "postcss-packages",
    externals: [
      "assets",
      "browserslist",
      "caniuse-lite", // caniuse-lite will still be imported by autoprefixer
      "postcss-assets", // Depends on "assets" in a way that doesn't compile
      
      // TODO :: add a check to make sure no other direct imports are added
      "postcss",
      "postcss/lib/container",
      "postcss/lib/input",
      "postcss/lib/parser",
      "postcss/lib/node",
      "postcss/lib/comment",
      "postcss/lib/list",
      "postcss/lib/tokenize",
      "postcss/lib/stringifier"

    ]
  }
];
