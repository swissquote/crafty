const fs = require("node:fs");
const path = require("node:path");

const SONAR_REPORTER_MODULE = "vitest-sonar-reporter";
const SONAR_REPORTER_PATH = require.resolve(SONAR_REPORTER_MODULE);
const SONAR_REPORTER_DEFAULTS = {
  outputFile: "./coverage/sonar-report.xml",
  reportedFilePath: "relative"
};
const SUPPORTED_SONAR_FILE_PATHS = new Set(["relative", "absolute"]);
const MODULE_DIRECTORIES_ENV = "CRAFTY_VITEST_MODULE_RESOLUTION";
const MODULE_DIRECTORIES_SETUP_FILE = require.resolve(
  "./module-directories-setup"
);

function isModuleMode() {
  const packageJson = path.join(process.cwd(), "package.json");

  if (fs.existsSync(packageJson)) {
    return require(packageJson).type === "module";
  }

  return false;
}

function isSonarReporter(reporterName) {
  return (
    typeof reporterName === "string" &&
    (reporterName === "sonar" ||
      reporterName === SONAR_REPORTER_MODULE ||
      reporterName === SONAR_REPORTER_PATH)
  );
}

function normalizeSonarPath(filePath) {
  return filePath.replace(/\\/g, "/");
}

function createSonarReportedFilePathMapper(reportedFilePath) {
  if (reportedFilePath === "absolute") {
    return filePath =>
      normalizeSonarPath(path.resolve(process.cwd(), filePath));
  }

  return filePath => normalizeSonarPath(filePath);
}

function finalizeSonarReporterConfig(config = {}) {
  if (typeof config.onWritePath !== "undefined") {
    throw new Error(
      "Crafty does not support vitest-sonar-reporter's onWritePath option. " +
        "Use reportedFilePath instead."
    );
  }

  if (
    typeof config.reportedFilePath !== "undefined" &&
    !SUPPORTED_SONAR_FILE_PATHS.has(config.reportedFilePath)
  ) {
    throw new Error(
      "Crafty only supports vitest-sonar-reporter reportedFilePath values " +
        '"relative" and "absolute".'
    );
  }

  return {
    ...SONAR_REPORTER_DEFAULTS,
    ...config
  };
}

function finalizeReporters(reporters) {
  if (reporters.length === 0) {
    reporters.push("default");
    reporters.push(["sonar", finalizeSonarReporterConfig()]);
  }

  return reporters.map(reporter => {
    if (isSonarReporter(reporter)) {
      return [SONAR_REPORTER_PATH, finalizeSonarReporterConfig()];
    }

    if (Array.isArray(reporter) && reporter.length > 0) {
      const [name, config] = reporter;

      if (isSonarReporter(name)) {
        return [SONAR_REPORTER_PATH, finalizeSonarReporterConfig(config)];
      }
    }

    return reporter;
  });
}

function finalizeCoverageOptions(coverageOptions, coverageEnabledFromCli) {
  const normalizedCoverageOptions =
    coverageOptions && coverageOptions !== true ? { ...coverageOptions } : {};

  if (typeof normalizedCoverageOptions.enabled === "undefined") {
    normalizedCoverageOptions.enabled = coverageEnabledFromCli;
  }

  if (typeof normalizedCoverageOptions.provider === "undefined") {
    normalizedCoverageOptions.provider = "v8";
  }

  if (typeof normalizedCoverageOptions.reportsDirectory === "undefined") {
    normalizedCoverageOptions.reportsDirectory = "./coverage";
  }

  if (typeof normalizedCoverageOptions.reporter === "undefined") {
    normalizedCoverageOptions.reporter = ["lcov"];
  }

  return normalizedCoverageOptions;
}

function createDefaultCliState() {
  return {
    runnerArgs: [],
    moduleDirectories: ["node_modules"],
    moduleFileExtensions: ["js", "json", "mjs", "cjs"],
    reporters: []
  };
}

function extractVitestCliState(args) {
  const cliState = createDefaultCliState();
  const runnerArgs = [...args];

  let idx;
  while ((idx = runnerArgs.indexOf("--moduleDirectories")) > -1) {
    const [, moduleDir] = runnerArgs.splice(idx, 2);
    if (moduleDir) {
      moduleDir
        .split(",")
        .forEach(module => cliState.moduleDirectories.push(module));
    }
  }

  while ((idx = runnerArgs.indexOf("--moduleFileExtensions")) > -1) {
    const [, moduleExtension] = runnerArgs.splice(idx, 2);
    if (moduleExtension) {
      moduleExtension
        .split(",")
        .forEach(extension => cliState.moduleFileExtensions.push(extension));
    }
  }

  while ((idx = runnerArgs.indexOf("--reporters")) > -1) {
    const [, reporter] = runnerArgs.splice(idx, 2);
    if (reporter) {
      reporter.split(",").forEach(value => cliState.reporters.push(value));
    }
  }

  cliState.runnerArgs = runnerArgs;
  cliState.moduleDirectories = [...new Set(cliState.moduleDirectories)];
  cliState.moduleFileExtensions = [...new Set(cliState.moduleFileExtensions)];

  return cliState;
}

function normalizeCliState(argsOrState) {
  if (Array.isArray(argsOrState)) {
    return extractVitestCliState(argsOrState);
  }

  const cliState = {
    ...createDefaultCliState(),
    ...argsOrState
  };

  return {
    runnerArgs: [...cliState.runnerArgs],
    moduleDirectories: [...new Set(cliState.moduleDirectories)],
    moduleFileExtensions: [...new Set(cliState.moduleFileExtensions)],
    reporters: [...cliState.reporters]
  };
}

function normalizeVitestOptions(crafty, argsOrState = []) {
  const cliState = normalizeCliState(argsOrState);

  if (Array.isArray(argsOrState)) {
    argsOrState.splice(0, argsOrState.length, ...cliState.runnerArgs);
  }

  const moduleDirectories = [...cliState.moduleDirectories];
  const moduleFileExtensions = [...cliState.moduleFileExtensions];
  const reporters = [...cliState.reporters];
  const coverageEnabledFromCli = cliState.runnerArgs.includes("--coverage");

  const options = {
    resolve: {
      alias: [
        {
          find: /\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/,
          replacement: require.resolve("./file-mock")
        },
        {
          find: /\.(css|less|sass|scss)$/,
          replacement: require.resolve("./style-mock")
        }
      ]
    },
    test: {
      globals: true,
      exclude: ["**/node_modules/**", `${crafty.config.destination}/**`],
      reporters
    }
  };

  const context = {
    esmMode: isModuleMode(),
    moduleDirectories,
    moduleFileExtensions,
    runtimePlugins: []
  };

  crafty.runAllSync("vitest", crafty, options, context);

  options.test.reporters = finalizeReporters(options.test.reporters || []);
  options.test.coverage = finalizeCoverageOptions(
    options.test.coverage,
    coverageEnabledFromCli
  );

  if (
    context.moduleDirectories.some(
      moduleDirectory => moduleDirectory !== "node_modules"
    )
  ) {
    const moduleResolution = {
      moduleDirectories: [...new Set(context.moduleDirectories)],
      moduleFileExtensions: [...new Set(context.moduleFileExtensions)]
    };

    options.craftyModuleResolution = moduleResolution;

    context.runtimePlugins.push({
      pluginPath: require.resolve("./module-directories-plugin"),
      options: moduleResolution
    });
  }

  if (context.runtimePlugins.length > 0) {
    options.craftyRuntimePlugins = context.runtimePlugins;
  }

  const testableExtensions = [...new Set(moduleFileExtensions)].filter(
    extension => extension !== "json"
  );
  const extensionPattern = `{${testableExtensions.join(",")}}`;

  options.resolve.extensions = [
    ...new Set([
      ...(options.resolve.extensions || []),
      ...testableExtensions.map(extension => `.${extension}`)
    ])
  ];

  options.test.include = [
    ...new Set([
      ...(options.test.include || []),
      `**/__tests__/**/*.${extensionPattern}`,
      `**/*.{test,spec}.${extensionPattern}`
    ])
  ];

  return options;
}

function createRegExpDescriptor(value) {
  return {
    __craftyVitestType: "regexp",
    source: value.source,
    flags: value.flags
  };
}

function isPlainObject(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function materializeSonarReporterConfig(config) {
  if (!Array.isArray(config.test?.reporters)) {
    return config;
  }

  config.test.reporters = config.test.reporters.map(reporter => {
    if (!Array.isArray(reporter) || reporter.length === 0) {
      return reporter;
    }

    const [name, reporterOptions] = reporter;

    if (name !== SONAR_REPORTER_PATH || !isPlainObject(reporterOptions)) {
      return reporter;
    }

    const { reportedFilePath, ...remainingOptions } = reporterOptions;

    return [
      name,
      {
        ...remainingOptions,
        onWritePath: createSonarReportedFilePathMapper(
          reportedFilePath ?? SONAR_REPORTER_DEFAULTS.reportedFilePath
        )
      }
    ];
  });

  return config;
}

function serializeVitestValue(value, pathLabel) {
  if (value == null) {
    return value;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value instanceof RegExp) {
    return createRegExpDescriptor(value);
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      serializeVitestValue(item, `${pathLabel}[${index}]`)
    );
  }

  if (!isPlainObject(value)) {
    throw new Error(
      `${pathLabel} contains a non-serializable Vitest value. ` +
        "Use context.runtimePlugins for runtime Vite plugins."
    );
  }

  const serializedObject = {};

  Object.entries(value).forEach(([key, item]) => {
    if (typeof item === "undefined") {
      return;
    }

    if (typeof item === "function") {
      throw new Error(
        `${pathLabel}.${key} contains a non-serializable Vitest value. ` +
          "Use context.runtimePlugins for runtime Vite plugins."
      );
    }

    serializedObject[key] = serializeVitestValue(item, `${pathLabel}.${key}`);
  });

  return serializedObject;
}

function serializeVitestOptions(options) {
  return serializeVitestValue(options, "crafted Vitest config");
}

function materializeVitestValue(value) {
  if (value == null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(materializeVitestValue);
  }

  if (!isPlainObject(value)) {
    return value;
  }

  if (value.__craftyVitestType === "regexp") {
    return new RegExp(value.source, value.flags);
  }

  const materializedObject = {};

  Object.entries(value).forEach(([key, item]) => {
    materializedObject[key] = materializeVitestValue(item);
  });

  return materializedObject;
}

function materializeVitestOptions(options) {
  const materializedOptions = materializeVitestValue(options);

  materializeSonarReporterConfig(materializedOptions);

  materializedOptions.test = materializedOptions.test || {};
  materializedOptions.test.setupFiles = [
    ...new Set([
      MODULE_DIRECTORIES_SETUP_FILE,
      ...(materializedOptions.test.setupFiles || [])
    ])
  ];

  if (materializedOptions.craftyModuleResolution) {
    process.env[MODULE_DIRECTORIES_ENV] = JSON.stringify(
      materializedOptions.craftyModuleResolution
    );
    delete materializedOptions.craftyModuleResolution;
  } else {
    delete process.env[MODULE_DIRECTORIES_ENV];
  }

  if (
    !materializedOptions.craftyRuntimePlugins ||
    materializedOptions.craftyRuntimePlugins.length === 0
  ) {
    return materializedOptions;
  }

  materializedOptions.plugins = [...(materializedOptions.plugins || [])];

  materializedOptions.craftyRuntimePlugins.forEach(
    ({ pluginPath, options: pluginOptions }) => {
      materializedOptions.plugins.push(require(pluginPath)(pluginOptions));
    }
  );

  delete materializedOptions.craftyRuntimePlugins;

  return materializedOptions;
}

module.exports = {
  extractVitestCliState,
  materializeVitestOptions,
  serializeVitestOptions,
  normalizeVitestOptions
};
