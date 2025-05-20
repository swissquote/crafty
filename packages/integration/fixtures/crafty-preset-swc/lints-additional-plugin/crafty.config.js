import depend from 'eslint-plugin-depend';

export default {
  presets: [
    "@swissquote/crafty-preset-swc",
    "@swissquote/crafty-runner-gulp",
    "@swissquote/crafty-runner-webpack"
  ],
  js: {
    gulp: {
      runner: "gulp/swc",
      source: "js/*.js"
    },
    webpack: {
      runner: "webpack",
      source: "js/script.js"
    }
  },
  eslint: {
    plugins: {
      depend,
    },
    rules: {
      'depend/ban-dependencies': 'error'
    }
  }
};
