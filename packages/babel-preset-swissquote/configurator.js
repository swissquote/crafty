const debug = require("debug")("crafty:preset-babel");

module.exports = function(crafty, environment, bundle, babelOptions) {
  const babelConfiguration = {
    babelrc: false,
    presets: [
      [
        __dirname,
        Object.assign(
          {
            browsers: crafty.config.browsers,
            environment
          },
          babelOptions || {}
        )
      ]
    ],
    plugins: []
  };

  // Apply preset configuration
  crafty.getImplementations("babel").forEach(preset => {
    debug(`${preset.presetName}.babel(Crafty, bundle, babelConfig)`);
    preset.babel(crafty, bundle, babelConfiguration);
    debug("preset executed");
  });

  debug("Babel configuration", babelConfiguration);

  return babelConfiguration;
};
