module.exports = function(config) {
  const env = config.environment || process.env.NODE_ENV || "production";

  // All processors used to make the CSS readable by a browser
  const processors = [];

  // Handle @import and rebase urls
  const importOptions = {};
  processors.push(require("postcss-import")(importOptions));
  processors.push(require("postcss-url")({ url: "rebase" }));

  // Apply Sass-like features
  processors.push(require("postcss-sassy-mixins")());
  processors.push(require("postcss-advanced-variables")());
  processors.push(require("postcss-atroot")());
  processors.push(require("postcss-property-lookup")());

  // Add plugins from postcss-preset-env missing in postcss-cssnext
  processors.push(require("postcss-dir-pseudo-class")());
  processors.push(require("postcss-logical")());

  // Handle next generation features
  const cssnextOptions = {
    browsers: config.browsers,
    features: {
      applyRule: false, // this feature will never be spec-compliant, removing
      autoprefixer: false // Disable autoprefixer, will be done separately
    }
  };
  processors.push(require("postcss-cssnext")(cssnextOptions));

  // Also support sass-style nesting
  processors.push(require("postcss-nested")());

  // Handle asset variables resolving
  const assetsOptions = {
    cachebuster: true,
    loadPaths: ["images"],
    relative: true
  };
  processors.push(require("postcss-assets")(assetsOptions));

  // Only add postcss-opacity and postcss-filter-gradient if old IE needs to be supported
  const list = require("browserslist")(config.browsers);
  if (
    list.indexOf("ie 9") >= 0 ||
    list.indexOf("ie 8") >= 0 ||
    list.indexOf("ie 7") >= 0 ||
    list.indexOf("ie 6") >= 0
  ) {
    processors.push(require("postcss-filter-gradient")());
  }

  // Options to apply to autoprefixer
  const autoprefixerOptions = {
    browsers: config.browsers
  };
  processors.push(require("autoprefixer")(autoprefixerOptions));

  // CSSO :: Minify and Optimize CSS
  if (env === "production") {
    processors.push(require("postcss-csso")({}));
  }

  // Report problems encountered during build
  const reporterOptions = {
    clearReportedMessages: true
  };
  processors.push(require("postcss-reporter")(reporterOptions));

  // List the used plugins (sends output to debug)
  processors.push(require("./postcss-plugin-list"));

  return processors;
};
