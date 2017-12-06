const postcss = require("postcss");
const debug = require("debug")("postcss-swissquote-preset");

module.exports = postcss.plugin("plugin-list", () => {
  const listed = [];

  function reportOnPlugin(plugin) {
    if (!plugin.postcssPlugin) {
      return "-   ??? unknown ???";
    }

    const isNewPlugin = listed.indexOf(plugin.postcssPlugin) > -1;
    listed.push(plugin.postcssPlugin);

    return `-  ${plugin.postcssPlugin} ${isNewPlugin ? " (duplicate)" : ""}`;
  }

  return (source, result) => {
    const plugins = result.processor.plugins.map(reportOnPlugin);
    debug("Used plugins:", plugins.join("\n"));
  };
});
