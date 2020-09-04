const postcss = require("postcss");

const prepareProcessors = require("./processors");

module.exports = postcss.plugin("swissquote-preset", (options) => {
  const proc = postcss();
  const processors = prepareProcessors(options.config);

  Object.keys(processors).forEach((plugin) => {
    proc.use(processors[plugin]);
  });

  return proc;
});
