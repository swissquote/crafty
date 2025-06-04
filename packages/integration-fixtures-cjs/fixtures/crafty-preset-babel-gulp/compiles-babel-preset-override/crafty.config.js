module.exports = {
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-gulp"],
  environment: "development", // We do it in development environment so Terser doesn't destroy what we did with the plugin
  js: {
    myBundle: {
      source: "js/**/*.js"
    }
  },
  eslint: {
    rules: {
      "@swissquote/swissquote/react/react-in-jsx-scope": 0
    }
  },
  babel(crafty, bundle, babel) {
    // Change the React Runtime
    const presetSwissquote = babel.presets
      .find(preset => preset[0].indexOf("babel-preset-swissquote") > 0);
    presetSwissquote[1].presetReact = { runtime: "automatic" };
  }
};
