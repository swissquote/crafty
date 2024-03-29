const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:preset-babel"
);

module.exports = function(crafty, bundle, babelOptions) {
  const babelConfiguration = {
    babelrc: false,
    presets: [
      [
        __dirname,
        {
          browsers: crafty.config.browsers,
          environment:
            crafty.getEnvironment() === "production"
              ? "production"
              : "development",
          ...babelOptions
        }
      ]
    ],
    plugins: []
  };

  // Apply preset configuration
  crafty.runAllSync("babel", crafty, bundle, babelConfiguration);

  debug("Babel configuration", babelConfiguration);

  return babelConfiguration;
};
