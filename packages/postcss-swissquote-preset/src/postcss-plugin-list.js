const debug = require("@swissquote/crafty-commons/packages/debug")(
  "postcss-swissquote-preset"
);

module.exports = () => {
  const listed = [];

  function reportOnPlugin(plugin) {
    if (!plugin.postcssPlugin) {
      return "-   ??? unknown ???";
    }

    const isNewPlugin = listed.indexOf(plugin.postcssPlugin) > -1;
    listed.push(plugin.postcssPlugin);

    return `-  ${plugin.postcssPlugin} ${isNewPlugin ? " (duplicate)" : ""}`;
  }

  return {
    postcssPlugin: "plugin-list",
    Once(root, { result }) {
      const plugins = result.processor.plugins.map(reportOnPlugin);
      debug("Used plugins:", plugins.join("\n"));
    }
  };
};
module.exports.postcss = true;
