const debug = require("debug")("postcss-swissquote-preset");

const features = require("./src/features");

module.exports = function(config, crafty) {
  // All processors used to make the CSS readable by a browser
  const processors = features(config);

  if (crafty) {
    crafty.getImplementations("postcss").forEach(preset => {
      debug(`${preset.presetName}.postcss(Crafty, postcssConfig)`);
      preset.postcss(crafty, processors);
      debug("preset executed");
    });
  }

  return processors
    .values()
    .filter(item => item.isEnabled())
    .map(item => item.instantiate());
};
