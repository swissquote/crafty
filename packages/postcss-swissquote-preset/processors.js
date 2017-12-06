module.exports = function(config) {
  const env = config.environment || process.env.NODE_ENV || "production";

  // All processors used to make the CSS readable by a browser
  const processors = [];

  // Handle @import and rebase urls
  const importOptions = {};
  processors.push(require("postcss-import")(importOptions));
  processors.push(require("postcss-url")({ url: "rebase" }));

  // Apply Sass-like features
  processors.push(require("postcss-mixins")()); // TODO :: migrate to https://www.npmjs.com/package/postcss-sassy-mixins ?
  processors.push(require("postcss-advanced-variables")()); // TODO :: investigate about postcss-each, postcss-conditionals, postcss-simple-vars, postcss-nested-vars
  processors.push(require("postcss-atroot")());
  processors.push(require("postcss-property-lookup")());

  // Handle next generation features
  const cssnextOptions = {
    browsers: config.browsers,
    features: {
      applyRule: false, // this feature will never be spec-compliant, removing
      autoprefixer: false // Disable autoprefixer, will be done separately
    }
  };
  processors.push(require("postcss-cssnext")(cssnextOptions));

  // Must be run after postcss-apply
  // that is inside postcss-cssnext
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
