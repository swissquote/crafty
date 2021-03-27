module.exports = {
  presets: ["@swissquote/crafty-preset-postcss", "@swissquote/crafty-runner-gulp"],
  css: {
    myBundle: {
      source: "css/style.scss"
    }
  },
  postcss(crafty, config, bundle) {
    // Override CSS custom properties in code
    const customProperties = config.processor("postcss-custom-properties").options;
    customProperties.importFrom = {
      customProperties: {
        "--color": "#fa5b35"
      }
    }
  }
};
