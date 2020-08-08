const path = require("path");

module.exports = function buildPreset(context, opts) {
  const presets = [];
  const plugins = [];

  // This is similar to how `env` works in Babel:
  // https://babeljs.io/docs/usage/babelrc/#env-option
  // We are not using `env` because it’s ignored in versions > babel-core@6.10.4:
  // https://github.com/babel/babel/issues/4539
  // https://github.com/facebook/create-react-app/issues/720
  // It’s also nice that we can enforce `NODE_ENV` being specified.
  const env = opts.environment || process.env.BABEL_ENV || process.env.NODE_ENV;
  const isEnvDevelopment = env === "development";
  const isEnvProduction = env === "production";
  const isEnvTest = env === "test";

  if (!isEnvDevelopment && !isEnvProduction && !isEnvTest) {
    throw new Error(
      `${"Using `babel-preset-swissquote` requires that you specify `NODE_ENV` or " +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: '}${JSON.stringify(env)}.`
    );
  }

  // Presets
  // --------------------------------------------

  if (isEnvTest) {
    // ES features necessary for user's Node version
    presets.push([
      require.resolve("@babel/preset-env"),
      {
        targets: {
          node: "current"
        }
      }
    ]);
  } else {
    const targets = {};

    if (opts.browsers) {
      targets.browsers = opts.browsers;
    } else {
      // React parses on ie 9, so we should too
      targets.ie = 9;
    }

    // Latest stable ECMAScript features
    presets.push([
      require.resolve("@babel/preset-env"),
      {
        targets,
        useBuiltIns: "entry",
        corejs: 2,
        // Do not transform modules to CJS
        modules: false,
        // Exclude transforms that make all code slower
        exclude: ["transform-typeof-symbol"]
      }
    ]);
  }

  // JSX and React specific plugins
  presets.push([
    require.resolve("@babel/preset-react"),
    {
      // Adds component stack to warning messages
      // Adds __self attribute to JSX which React will use for some warnings
      development: isEnvDevelopment || isEnvTest,
      // Will use the native built-in instead of trying to polyfill
      // behavior for any plugins that require one.
      useBuiltIns: true
    }
  ]);

  // Plugins
  // --------------------------------------------

  // Necessary to include regardless of the environment because
  // in practice some other transforms (such as object-rest-spread)
  // don't work without it: https://github.com/babel/babel/issues/7215
  plugins.push(require.resolve("@babel/plugin-transform-destructuring"));

  // class { handleClick = () => { } }
  plugins.push([
    require.resolve("@babel/plugin-proposal-class-properties"),
    {
      loose: true
    }
  ]);

  // The following two plugins use Object.assign directly, instead of Babel's
  // extends helper. Note that this assumes `Object.assign` is available.
  // { ...todo, completed: true }
  plugins.push([
    require.resolve("@babel/plugin-proposal-object-rest-spread"),
    {
      useBuiltIns: true
    }
  ]);

  const babelRuntime = path.dirname(require.resolve("@babel/runtime/package.json"));

  // Polyfills the runtime needed for async/await and generators
  plugins.push([
    require.resolve("@babel/plugin-transform-runtime"),
    {
      corejs: false,
      helpers: opts.deduplicateHelpers || false,
      // By default, babel assumes babel/runtime version 7.0.0-beta.0,
      // explicitly resolving to match the provided helper functions.
      // https://github.com/babel/babel/issues/10261
      version: require(path.join(babelRuntime, "package.json")).version,
      regenerator: true,
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
      useESModules: opts.useESModules || false,
      // Undocumented option that lets us encapsulate our runtime, ensuring
      // the correct version is used
      // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
      absoluteRuntime: babelRuntime,
    }
  ]);

  // Remove PropTypes from production build
  if (isEnvProduction) {
    plugins.push([
      require("babel-plugin-transform-react-remove-prop-types").default,
      {
        removeImport: true
      }
    ]);
  }

  // Optional chaining and nullish coalescing are supported in @babel/preset-env,
  // but not yet supported in webpack due to support missing from acorn.
  // These can be removed once webpack has support.
  // See https://github.com/facebook/create-react-app/issues/8445#issuecomment-588512250
  plugins.push(require.resolve("@babel/plugin-proposal-optional-chaining"));
  plugins.push(
    require.resolve("@babel/plugin-proposal-nullish-coalescing-operator")
  );

  // function* () { yield 42; yield 43; }
  if (!isEnvTest) {
    plugins.push([
      require.resolve("@babel/plugin-transform-regenerator"),
      {
        // Async functions are converted to generators by @babel/preset-env
        async: false
      }
    ]);
  }

  // Adds syntax support for import()
  plugins.push(require.resolve("@babel/plugin-syntax-dynamic-import"));

  if (isEnvTest) {
    // Compiles import() to a deferred require()
    plugins.push(require.resolve("babel-plugin-transform-dynamic-import"));
  }

  return {
    presets,
    plugins
  };
};
