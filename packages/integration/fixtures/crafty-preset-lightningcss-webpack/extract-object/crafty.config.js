module.exports = {
  presets: [
    "@swissquote/crafty-preset-lightningcss",
    "@swissquote/crafty-runner-webpack"
  ],
  js: {
    myBundle: {
      source: "js/app.js",
      extractCSS: {
        filename: "[bundle]-object.min.css"
      }
    }
  }
};
