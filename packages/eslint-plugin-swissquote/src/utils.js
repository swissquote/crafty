// Eslint can't load plugins transitively (from a shared config)
// So we have to include the file ourselves and include the rules as if they were ours.
// Solution proposed by @nzakas himself : https://github.com/eslint/eslint/issues/3458#issuecomment-257161846
// replaces `extends: "plugin:react/recommended",`

const hasOwnProperty = Object.prototype.hasOwnProperty;

function fixKey(key) {
  // might be called more than once
  if (key.indexOf("@swissquote") === 0) {
    return key;
  }

  return key.indexOf("/") > -1 ? `@swissquote/swissquote/${key}` : key;
}

function fixPluginKey(key) {
  // might be called more than once
  if (key.indexOf("@swissquote") === 0) {
    return key;
  }

  return `@swissquote/swissquote/${key}`;
}

/**
 * This ensures that all configurations get the `@swissquote/swissquote` prefix as it was since Crafty 1.0
 * This can technically be disabled now but would break a whole lot of apps
 *
 * @param {*} configs
 * @returns
 */
function prefixPlugins(configs) {
  for (const config of configs) {
    if (config.plugins) {
      config.plugins = Object.fromEntries(
        Object.entries(config.plugins).map(([key, value]) => {
          return [fixPluginKey(key), value];
        })
      );
    }

    if (config.rules) {
      config.rules = Object.fromEntries(
        Object.entries(config.rules).map(([key, value]) => {
          return [fixKey(key), value];
        })
      );
    }
  }

  return configs;
}

function addMissingRules(source, destination, except = []) {
  Object.keys(source).forEach(ruleName => {
    // Only define the rules we don't have configured yet
    if (
      !hasOwnProperty.call(destination, ruleName) &&
      except.indexOf(ruleName) === -1
    ) {
      destination[ruleName] = source[ruleName];
    }
  });
}

function warn() {
  // When running in development mode, some errors can just be warnings.
  // Some errors don't need to break the build if they aren't threatening the functionality.
  return process.env.NODE_ENV === "development" ? "warn" : "error";
}

module.exports = {
  addMissingRules,
  warn,
  prefixPlugins
};
