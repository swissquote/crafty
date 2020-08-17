const path = require("path");
const { ESLint } = require("eslint");
const { createFilter } = require("@rollup/pluginutils");

function normalizePath(id) {
  return path
    .relative(process.cwd(), id)
    .split(path.sep)
    .join("/");
}

async function getFormatter(eslint, formatter) {
  if (typeof formatter === "function") {
    return { format: formatter };
  }

  return eslint.loadFormatter(formatter);
}

function getConfiguration(options) {
  let finalOptions = options;
  if (typeof finalOptions === "string") {
    const configFile = path.resolve(process.cwd(), finalOptions);
    finalOptions = require(configFile);
    finalOptions.useEslintrc = false; // Tell eslint not to look for configuration files.
  }

  return finalOptions;
}

module.exports = function eslintPlugin(options = {}) {
  const {
    include,
    exclude = "node_modules/**",
    formatter = "stylish",
    throwOnWarning,
    throwOnError,
    ...eslintOptions
  } = getConfiguration(options);

  const eslint = new ESLint(eslintOptions);
  const filter = createFilter(include, exclude);

  let reports = [];

  return {
    name: "eslint",

    async transform(code, id) {
      const file = normalizePath(id);
      if ((await eslint.isPathIgnored(file)) || !filter(file)) {
        return;
      }

      const report = await eslint.lintText(code, {
        filePath: file
      });

      if (report) {
        reports.push(...report);
      }

      if (options.fix && report) {
        await ESLint.outputFixes(report);
      }
    },
    buildStart() {
      reports = [];
    },
    async buildEnd() {
      if (reports.length === 0) {
        return;
      }

      const output = (await getFormatter(eslint, formatter)).format(reports);
      if (output && output.length > 0) {
        console.log(output);
      }

      const hasWarnings =
        throwOnWarning && reports.some(report => report.warningCount > 0);
      const hasErrors =
        throwOnError && reports.some(report => report.errorCount > 0);

      if (hasWarnings && hasErrors) {
        throw Error("Warnings or errors were found");
      }

      if (hasWarnings) {
        throw Error("Warnings were found");
      }

      if (hasErrors) {
        throw Error("Errors were found");
      }
    }
  };
};
