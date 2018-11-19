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

  // Polyfills the runtime needed for async/await and generators
  plugins.push([
    require.resolve("@babel/plugin-transform-runtime"),
    {
      helpers: opts.deduplicateHelpers || false,
      useESModules: opts.useESModules || false,
      regenerator: true
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
