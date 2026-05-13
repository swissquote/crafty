<table>
<tr><th>Compatible Runners</th><td>

Not tied to any runner

</td></tr>
<tr><th>Linters</th><td>

N/A

</td></tr>
<tr><th>Commands</th><td>

- `test`: Vitest integrates itself with the `crafty test` command
- `ide`: Vitest integrates itself with the `crafty ide` command

</td></tr>
<tr><th>Related presets</th><td>

- [Babel](05_Packages/05_crafty-preset-babel.md)
- [TypeScript](05_Packages/05_crafty-preset-typescript.md)
- [React](05_Packages/05_crafty-preset-react.md)
- [SWC](05_Packages/05_crafty-preset-swc.md)

</td></tr>
</table>

Crafty provides a preset that will run [Vitest](https://vitest.dev/) once
`crafty test` is executed.

It adds safe defaults to be able to run your tests with your configuration,
owns the generated Vitest config used by Crafty and your IDE, and provides an
extension hook that allows you and other presets to extend its configuration.

Vitest is a Node-based runner. Unless you set another environment, the tests
run in a Node environment and not in a real browser.

If you need another environment, you can override it in the `vitest(...)`
hook.

We recommend that you use a separate tool for browser end-to-end tests if you
need them.

[TOC]

## File name Conventions

Vitest will look for test files with any of the following popular naming
conventions:

- Files with supported extensions in `__tests__` folders.
- Files with `.test.<extension>` suffix.
- Files with `.spec.<extension>` suffix.

By default, Crafty supports `js`, `mjs`, and `cjs` test files. `json` stays
resolvable, but does not take part in test discovery.

The `.test.<extension>` / `.spec.<extension>` files (or the `__tests__`
folders) can be located at any depth under the project root.

We recommend to put the test files (or `__tests__` folders) next to the code
they are testing so that relative imports appear shorter. For example, if
`App.test.js` and `App.js` are in the same folder, the test needs to
`import App from "./App"` instead of a long relative path.

> Using [`crafty-preset-babel`](05_Packages/05_crafty-preset-babel.md) or
> [`crafty-preset-swc`](05_Packages/05_crafty-preset-swc.md) will add `jsx` as
> a supported test file extension. Using
> [`crafty-preset-typescript`](05_Packages/05_crafty-preset-typescript.md)
> will add the TypeScript extensions `ts`, `tsx`, `mts`, and `cts`.

## `crafty test`

Running `crafty test` will run all tests and exit. But you can use any option
provided by Vitest itself.

For example, `crafty test --watch` will run your tests in watch mode. This mode
will run all your tests once and then wait for code or test changes to rerun
the concerned tests.

Crafty supports one active test runner. If both Jest and Vitest are
configured, `crafty test` fails with a clear error.

## Crafty-specific CLI options

The Vitest preset also provides extra options:

- `--moduleDirectories <dir[,dir...]>`: adds directories to module lookup
  beyond `node_modules`.
- `--moduleFileExtensions <ext[,ext...]>`: adds file extensions to module
  resolution and test discovery.
- `--reporters <name[,name...]>`: configures Vitest reporters. The special
  value `sonar` maps to `vitest-sonar-reporter` with Crafty's default output
  path.

You can pass a comma-separated list or repeat the option.

## Writing Tests

To create tests, add `it()` (or `test()`) blocks with the name of the test and
its code. You may optionally wrap them in `describe()` blocks for logical
grouping but this is neither required nor recommended.

Vitest provides built-in `test()` and `expect()` globals. A basic test could
look like this:

```js
import sum from "./sum";

test("sums numbers", () => {
  expect(sum(1, 2)).toEqual(3);
  expect(sum(2, 2)).toEqual(4);
});
```

All `expect()` matchers supported by Vitest are documented on the
[official website](https://vitest.dev/api/expect.html).

## Focusing and Excluding Tests

Use `test.skip()` or `it.skip()` to temporarily exclude a test from being
executed. Vitest also provides focused test helpers and CLI filters when you
want to run a single test in isolation.

## Coverage Reporting

Vitest can generate a coverage report. To do so, first add a coverage provider
such as `@vitest/coverage-v8`.

```sh
npm install --save-dev @vitest/coverage-v8
```

Tests run slower with coverage enabled, so we recommend running it separately
from your normal watch workflow.

Once installed, run `crafty test --coverage` to include a coverage
report.

## Snapshot Testing

Vitest supports snapshot testing for values, rendered components, and more.
[Read more about snapshot testing.](https://vitest.dev/guide/snapshot.html)

## Vitest configuration ownership

Crafty owns the Vitest configuration it runs.

- `crafty test` computes the Vitest config from Crafty state and ignores
  official `vitest.config.*` files.
- `crafty ide` writes the IDE-facing `vitest.config.mjs` file and removes
  alternative filenames such as `vitest.config.js`, `vitest.config.cjs`,
  `vitest.config.mts`, `vitest.config.ts`, `vitest.config.cts`, and the legacy
  `vitest.config.crafty.mjs`.

If you need to change Vitest behavior, use the `vitest(crafty, options,
context)` hook rather than maintaining a separate `vitest.config.*` file.

## Extending the configuration

Each preset and `crafty.config.js` can define the
`vitest(crafty, options, context)` function to override Vitest's configuration.

```javascript
const path = require("node:path");
const MODULES = path.join(__dirname, "..", "node_modules");

module.exports = {
  /**
   * Represents the extension point for Vitest configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} options - The Vitest configuration object
   * @param {Object} context - Crafty helpers for resolution and runtime plugins
   */
  vitest(crafty, options, context) {
    context.moduleDirectories.push(MODULES);
    context.moduleFileExtensions.push("ts");

    options.test.setupFiles = options.test.setupFiles || [];
    options.test.setupFiles.push(require.resolve("./testSetup"));
    options.test.environment = "jsdom";
  },
};
```

Because Crafty computes the configuration before starting Vitest, `options`
must stay serializable.

Use `context.moduleDirectories` and `context.moduleFileExtensions` to extend
module resolution and test discovery.

The full list of available configuration options is available on the
[official website](https://vitest.dev/config/).

## Runtime Vite plugins

If you need a Vite plugin at runtime, register it through
`context.runtimePlugins` instead of attaching a plugin object directly to
`options.plugins`.

```javascript
module.exports = {
  vitest(crafty, options, context) {
    context.runtimePlugins.push({
      pluginPath: require.resolve("./vitest-plugin"),
      options: {
        mode: "test",
      },
    });
  },
};
```

The module at `pluginPath` must export a function that receives `options` and
returns a Vite plugin. If you attach non-serializable values directly to
`options`, Crafty rejects them with a clear error.

## `crafty ide`

Running `crafty ide` generates a `vitest.config.mjs` file and updates
`.vscode/settings.json` so your IDE can point to the Crafty-generated Vitest
configuration.

[Read more about Vitest IDE integration.](Vitest_IDE_Integration.md)

## SonarQube Integration

Most of the time, at Swissquote, we use SonarQube to check our code quality.
More often than not, we add a reporter to create a SonarQube test report.

`crafty-preset-vitest` comes out of the box with a sonar report that is written
to `reports/sonar-report.xml`.

This report is automatically added to the configuration if no reporter is
specified through the command line. The `sonar` alias is normalized to
`vitest-sonar-reporter` with that default output path.

You can decide to change this configuration by overriding
`options.test.reporters`

```javascript
module.exports = {
  /**
   * Represents the extension point for Vitest configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} options - The Vitest configuration object
   */
  vitest(crafty, options) {
    // The Sonar reporter is automatically added
    console.log(options.test.reporters); // ['default', ["sonar", { outputFile: "./reports/sonar-report.xml" }]]
  },
};
```
