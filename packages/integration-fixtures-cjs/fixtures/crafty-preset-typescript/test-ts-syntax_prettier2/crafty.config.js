module.exports = {
  presets: [
    "@swissquote/crafty-preset-typescript",
    "@swissquote/crafty-runner-gulp",
    "@swissquote/crafty-runner-webpack",
  ],
  js: {
    webpack: {
      runner: "webpack",
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
