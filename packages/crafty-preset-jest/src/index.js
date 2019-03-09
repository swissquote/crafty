const { join } = require("path");
const { writeFileSync, unlinkSync, existsSync } = require("fs");

const jest = require("jest-cli");

function normalizeJestOptions(crafty, input, cli) {
  const moduleDirectories = new Set(
    [
      join(process.cwd(), "node_modules"),
      join(__dirname, "..", "node_modules"),
      join(__dirname, "..", "..", "..", "node_modules")
    ].filter(existsSync)
  );
  if (cli.flags.moduleDirectories) {
    cli.flags.moduleDirectories
      .split(",")
      .forEach(module => moduleDirectories.add(module));
  }

  const moduleFileExtensions = new Set(["js", "json"]);
  if (cli.flags.moduleFileExtensions) {
    cli.flags.moduleFileExtensions
      .split(",")
      .forEach(extension => moduleFileExtensions.add(extension));
  }

  const options = {
    resolver: require.resolve("jest-pnp-resolver"),
    moduleDirectories: [...moduleDirectories],
    moduleFileExtensions: [...moduleFileExtensions],
    testPathIgnorePatterns: ["/node_modules/", crafty.config.destination],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": require.resolve(
        "./file-mock"
      ),
      "\\.(css|less|sass|scss)$": require.resolve("./style-mock")
    },
    bail: true,
    roots: [process.cwd()],
    transform: {},
    globals: {}
  };

  if (input.length) {
    options.testRegex = input.join("|").replace(".", "\\.");
  }

  // Add custom transformer to ES import/export in node_modules
  options.transformIgnorePatterns = [];
  options.transform["[/\\\\]node_modules[/\\\\].+\\.m?js$"] = require.resolve(
    "./esm-transformer"
  );

  crafty.getImplementations("jest").forEach(preset => {
    preset.jest(crafty, options);
  });

  // Support all extensions that can be transformed for test files extensions, except for json
  if (!options.hasOwnProperty("testRegex")) {
    const extensions = options.moduleFileExtensions
      .filter(extension => extension !== "json")
      .join("|");
    options.testRegex = `(/__tests__/.*|(\\.|/)(test|spec))\\.(${extensions})$`;
  }

  return options;
}

function deleteOnExit(file) {
  process.addListener("exit", () => {
    try {
      unlinkSync(file);
    } catch (e) {
      console.log("Failed", e);
    }
  });
}

module.exports = {
  test(crafty, input, cli) {
    return new Promise((resolve, reject) => {
      // Create config file in the current working directory
      // Creating it in a temp path breaks code coverage collection
      const configFile = join(process.cwd(), "jest-config-crafty.json");
      deleteOnExit(configFile);
      const options = normalizeJestOptions(crafty, input, cli);
      const cliOptions = {
        config: configFile,
        coverage: cli.flags.coverage,
        watch: cli.flags.watch
      };

      writeFileSync(configFile, `${JSON.stringify(options, null, 2)}\n`);

      jest.runCLI(cliOptions, [configFile], result =>
        result.numFailedTests || result.numFailedTestSuites
          ? reject()
          : resolve()
      );
    });
  }
};
