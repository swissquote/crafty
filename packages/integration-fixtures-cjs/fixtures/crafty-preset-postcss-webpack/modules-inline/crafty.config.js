module.exports = {
  presets: [
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-runner-webpack"
  ],
  js: {
    myBundle: {
      source: "js/app.js",
      //extractCSS: "[name].[bundle].min.css"
    }
  }
};
