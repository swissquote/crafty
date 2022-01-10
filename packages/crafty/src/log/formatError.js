const Information = require("./Information");

// Format orchestrator errors
function formatError(e) {
  if (!e.error) {

    if (e.showStack) {
      return e.toString();
    }

    return e.message;
  }

  // Don't show stacktrace on informational errors
  if (e.error instanceof Information) {
    return e.error.message;
  }

  // PluginError
  if (typeof e.error.showStack === "boolean") {
    return e.error.toString();
  }

  // Normal error
  if (e.error.stack) {
    return e.error.stack;
  }

  // Unknown (string, number, etc.)
  return new Error(String(e.error)).stack;
}
module.exports = formatError;
