// Eslint can't load plugins transitively (from a shared config)
// So we have to include the file ourselves and include the rules as if they were ours.
// Solution proposed by @nzakas himself : https://github.com/eslint/eslint/issues/3458#issuecomment-257161846
// replaces `extends: "plugin:react/recommended",`

function addMissingRules(source, destination, except = []) {
  Object.keys(source).forEach((ruleName) => {
    // Only define the rules we don't have configured yet
    const key =
      ruleName.indexOf("/") > -1
        ? `@swissquote/swissquote/${ruleName}`
        : ruleName;
    if (!destination.hasOwnProperty(key) && except.indexOf(key) === -1) {
      destination[key] = source[ruleName];
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
};
