const prepareProcessors = require("./processors");

const plugin = options => {
  const processors = prepareProcessors(options.config);

  return {
    postcssPlugin: "swissquote-preset",
    plugins: Object.values(processors)
  };
};

plugin.postcss = true;

module.exports = plugin;
