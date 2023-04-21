const features = require("./src/features");

module.exports = function(config, crafty, bundle) {
  // All processors used to make the CSS readable by a browser
  const processors = features(config);

  // Extend with Crafty
  if (crafty) {
    crafty.runAllSync("postcss", crafty, processors, bundle);
  }

  // Make a valid format for postcss
  return processors
    .values()
    .filter(item => item.isEnabled())
    .map(item => item.instantiate());
};
