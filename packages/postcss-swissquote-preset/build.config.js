module.exports = [
  {
    name: "postcss-packages",
    externals: [
      "assets",
      "browserslist",
      "caniuse-lite", // caniuse-lite will still be imported by autoprefixer
      "postcss-assets" // Depends on "assets" in a way that doesn't compile
    ]
  }
];
