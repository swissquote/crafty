module.exports = {
  swc(crafty, bundle, swcOptions) {
    swcOptions.jsc.transform = swcOptions.jsc.transform || {};
    swcOptions.jsc.transform.optimizer = swcOptions.jsc.transform.optimizer || {};
    swcOptions.jsc.transform.optimizer.globals =
      swcOptions.jsc.transform.optimizer.globals || {};
    swcOptions.jsc.transform.optimizer.globals.vars = {
      ...(swcOptions.jsc.transform.optimizer.globals.vars || {}),
      __SWC_MAGIC__: JSON.stringify("swc-hooked")
    };
  }
};