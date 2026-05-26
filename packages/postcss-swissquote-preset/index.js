const prepareProcessors = require("./processors");

const initializer = async options => {
  const processors = await prepareProcessors(
    options.config,
    options.crafty || null,
    options.bundle || null
  );

  const plugin = () => {
    return {
      postcssPlugin: "swissquote-preset",
      plugins: Object.values(processors)
    };
  };

  plugin.postcss = true;
  return plugin;
};

module.exports = initializer;
