const { getModulePath, isModule, isExternal } = require("./functions.js");

function printStats({ modules }) {
  const packages = modules
    .filter((m) => m.nameForCondition != null && isModule(m.name))
    .map((m) => getModulePath(m.nameForCondition))
    .reduce((acc, entry) => acc.add(entry), new Set());

  const notPackage = modules.filter(
    (m) =>
      !isModule(m.name) &&
      !isExternal(m.name) &&
      m.name.indexOf("webpack/") !== 0
  );
  const externals = modules.filter((m) => isExternal(m.name));

  console.log(
    modules.length,
    "modules,",
    packages.size,
    "packages,",
    externals.length,
    "externals,",
    notPackage.length,
    "non-package modules"
  );
  console.log("");
}

function checkStats(stats, statFile) {
  printStats(stats);

  const errors = [];

  function recordError(error) {
    errors.push(error);
  }

  // All packages must be found
  stats.modules
    .filter((m) => m.name.indexOf("/ncc/@@notfound") > -1)
    .map(
      (m) =>
        `Module "${m.name.split("?")[1]}" requested by "${
          m.issuerName
        }" was not found.`
    )
    .map(recordError);

  // Packages provided by another module should stay external
  stats.modules
    .filter((m) => m.name.indexOf("/packages/") > -1)
    .filter((m) => !isExternal(m.name))
    .map(
      (m) =>
        `Module "${m.name}" requested by "${m.issuerName}" should be external.`
    )
    .map(recordError);

  // All readable-stream packages must be external
  stats.modules
    .filter((m) => !isExternal(m.name))
    .filter((m) => {
      // Never accept those packages
      if (
        m.name.indexOf("node_modules/readable-stream/") > -1 ||
        m.name.indexOf("node_modules/typescript/") > -1
      ) {
        return true;
      }

      // Only accept stylelint in some files
      if (
        m.name.indexOf("node_modules/stylelint/") > -1 &&
        !statFile.includes("stylelint")
      ) {
        return true;
      }

      return false;
    })
    .map(
      (m) =>
        `Module "${m.name}" requested by "${m.issuerName}" should be external.`
    )
    .map(recordError);

  if (errors.length > 0) {
    const message = `${errors.length} errors found`;
    console.log(message);
    console.log("=".repeat(message.length));
    errors.forEach((m) => {
      console.log(m);
    });

    console.log();
    process.exit(1);
  }
}

module.exports = checkStats;
