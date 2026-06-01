module.exports = {
  presets: [
    "@swissquote/crafty-preset-swc",
    "@swissquote/crafty-preset-lightningcss",
    "@swissquote/crafty-preset-react",
    "@swissquote/crafty-runner-rspack",
  ],
  js: {
    app: {
      runner: "rspack",
      source: "src/index.jsx",
      react: true,
      extractCSS: true,
    },
  },
};
