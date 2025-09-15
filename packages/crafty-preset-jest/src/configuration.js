const path = require("path");
const fs = require("fs");

function isModuleMode() {
  const packageJson = path.join(process.cwd(), "package.json");

  if (fs.existsSync(packageJson)) {
    return require(packageJson).type === "module";
  }

  return false;
}

const SONAR_REPORTER_MODULE = require.resolve("jest-to-sonar");

function finalizeReporters(reporters) {
  return reporters.map(reporter => {
    if (typeof reporter === "string" && reporter === "sonar") {
      return [SONAR_REPORTER_MODULE, { outputFile: "./reports/sonar-report.xml" }];
    }
    if (Array.isArray(reporter) && reporter.length > 0) {
      const [name, config] = reporter;
      if (typeof name === "string" && name === "sonar") {
        return [SONAR_REPORTER_MODULE, config];
      }
    }
    return reporter;
  });
}

function normalizeJestOptions(crafty, args) {
  const moduleDirectories = new Set(["node_modules"]);

  let idx;
  while ((idx = args.indexOf("--moduleDirectories")) > -1) {
    const [, moduleDir] = args.splice(idx, 2);
    moduleDir.split(",").forEach(module => moduleDirectories.add(module));
  }

  const moduleFileExtensions = new Set(["js", "json", "mjs", "cjs"]);
  while ((idx = args.indexOf("--moduleFileExtensions")) > -1) {
    const [, moduleExtension] = args.splice(idx, 2);
    moduleExtension
      .split(",")
      .forEach(extension => moduleFileExtensions.add(extension));
  }

  const reporters = [];
  while ((idx = args.indexOf("--reporters")) > -1) {
    const [, reporter] = args.splice(idx, 2);
    reporter.split(",").forEach(r => reporters.push(r));
  }

  if (reporters.length === 0) {
    reporters.push("default");
    reporters.push(["sonar", { outputFile: "./reports/sonar-report.xml" }]);
  }

  const options = {
    moduleDirectories: [...moduleDirectories],
    moduleFileExtensions: [...moduleFileExtensions],
    testPathIgnorePatterns: ["/node_modules/", crafty.config.destination],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": require.resolve(
        "./file-mock"
      ),
      "\\.(css|less|sass|scss)$": require.resolve("./style-mock")
    },
    reporters,
    bail: true,
    roots: [process.cwd()],
    transform: {},
    resolver: require.resolve("./resolver.js"),
    globals: {}
  };

  const esmMode = isModuleMode();
  if (!esmMode) {
    // Add custom transformer to ES import/export in node_modules
    options.transformIgnorePatterns = [];
    options.transform["[/\\\\]node_modules[/\\\\].+\\.m?js$"] = require.resolve(
      "./esm-transformer"
    );
  }

  crafty.runAllSync("jest", crafty, options, esmMode);

  // Support all extensions that can be transformed for test files extensions, except for json
  const extensions = options.moduleFileExtensions
    .filter(extension => extension !== "json")
    .join("|");
  options.testRegex = `(/__tests__/.*|(\\.|/)(test|spec))\\.(${extensions})$`;

  options.reporters = finalizeReporters(options.reporters);

  return options;
}

module.exports = {
  normalizeJestOptions,
  isModuleMode
};
