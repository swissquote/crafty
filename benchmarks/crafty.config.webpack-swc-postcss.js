module.exports = {
  presets: [
    "@swissquote/crafty-preset-swc",
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-preset-react",
    "@swissquote/crafty-runner-webpack",
  ],
  js: {
    app: {
      runner: "webpack",
      source: "src/index.jsx",
      react: true,
      extractCSS: true,
    },
  },
};
