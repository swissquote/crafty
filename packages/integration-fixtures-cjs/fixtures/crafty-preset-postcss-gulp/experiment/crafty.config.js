module.exports = {
  presets: ["@swissquote/crafty-preset-postcss", "@swissquote/crafty-runner-gulp"],
  css: {
    myBundle: {
      source: "css/style.scss"
    }
  },
  /**
   * Represents the extension point for Postcss configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {ProcessorMap} config - The list of plugins currently configured
   * @param {Object} bundle - The bundle that is being prepared for build (name, input, source, destination)
   */
  postcss(crafty, config, bundle) {
    // Disable minification to see the result
    const options = config.processor("postcss-lightningcss").options
    options.lightningcssOptions.minify = false;
  }
};
