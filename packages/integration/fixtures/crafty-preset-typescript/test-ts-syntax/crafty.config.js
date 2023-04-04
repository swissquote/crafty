module.exports = {
  presets: [
    "@swissquote/crafty-preset-typescript",
    "@swissquote/crafty-runner-gulp",
    "@swissquote/crafty-runner-rollup",
    "@swissquote/crafty-runner-webpack",
  ],
  js: {
    webpack: {
      runner: "webpack",
      source: "js/app.ts",
    },
    rollup: {
      runner: "rollup",
      source: "js/app.ts",
    },
    gulp: {
      runner: "gulp/typescript",
      source: "js/**/*.ts",
    },
  },
  eslint: {
    settings: {
      "formatting/mode": "prettier:2",
    },
  },
};
