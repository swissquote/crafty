module.exports = {
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-gulp"],
  environment: "development", // We do it in development environment so uglify doesn't destroy what we did with the plugin
  js: {
    myBundle: {
      source: "js/**/*.js"
    }
  },
  babel(crafty, bundle, babel) {
    babel.plugins.push("@babel/plugin-transform-property-literals");
  }
};
