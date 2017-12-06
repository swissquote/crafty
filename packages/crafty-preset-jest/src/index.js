const { join } = require("path");
const { writeFileSync } = require("fs");

const jest = require("jest-cli");
const tmp = require("tmp");

function normalizeJestOptions(crafty, input, cli) {
  const moduleDirectories = new Set([
    join(__dirname, "../node_modules"),
    join(process.cwd(), "node_modules")
  ]);
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

  crafty.getImplementations("jest").forEach(preset => {
    preset.jest(crafty, options);
  });

  // Support all extensions that can be transformed for test files extensions
  if (!options.hasOwnProperty("testRegex")) {
    const extensions = options.moduleFileExtensions.join("|");
    options.testRegex = `(/__tests__/.*|(\\.|/)(test|spec))\\.(${extensions})$`;
  }

  return options;
}

module.exports = {
  test(crafty, input, cli) {
    return new Promise((resolve, reject) => {
      const configFile = tmp.fileSync({
        prefix: "jest-config-",
        postfix: ".json"
      }).name;
      const options = normalizeJestOptions(crafty, input, cli);
      const cliOptions = {
        config: configFile,
        coverage: cli.flags.coverage,
        watch: cli.flags.watch
      };

      writeFileSync(configFile, `${JSON.stringify(options, null, 2)}\n`);

      jest.runCLI(
        cliOptions,
        [configFile],
        result =>
          result.numFailedTests || result.numFailedTestSuites
            ? reject()
            : resolve()
      );
    });
  }
};
