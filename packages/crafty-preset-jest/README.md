<table>
<tr><th>Compatible Runners</th><td>

Not tied to any runner

</td></tr>
<tr><th>Linters</th><td>

N/A

</td></tr>
<tr><th>Commands</th><td>

* `test`: Jest integrates itself with the `crafty test` command

</td></tr>
<tr><th>Related presets</th><td>

* [Babel](05_Packages/05_crafty-preset-babel.md)
* [TypeScript](05_Packages/05_crafty-preset-typescript.md)

</td></tr>
</table>

Crafty provides a preset that will run [Jest](https://facebook.github.io/jest/)
once `crafty test` is executed.

It adds safe defaults to be able to run your tests with your configuration and
provides an extension hook that allows you and other presets to extend its
configuration.

Jest is a Node-based runner. This means that the tests always run in a Node
environment and not in a real browser. This lets us enable fast iteration speed
and prevent flakiness.

While Jest provides browser global variables such as `window` thanks to
[jsdom](https://github.com/tmpvar/jsdom), they are approximations of the real
browser behavior. Jest is intended to be used for unit tests of your logic and
your components rather than the DOM quirks.

We recommend that you use a separate tool for browser end-to-end tests if you
need them.

[TOC]

## File name Conventions

Jest will look for test files with any of the following popular naming
conventions:

* Files with `.js` suffix in `__tests__` folders.
* Files with `.test.js` suffix.
* Files with `.spec.js` suffix.

The `.test.js` / `.spec.js` files (or the `__tests__` folders) can be located at
any depth under the `src` top level folder.

We recommend to put the test files (or `__tests__` folders) next to the code
they are testing so that relative imports appear shorter. For example, if
`App.test.js` and `App.js` are in the same folder, the test needs to `import App from './App'` instead of a long relative path.

> Using [`crafty-preset-babel`](05_Packages/05_crafty-preset-babel.md) will add
> `jsx` as a supported test file extension and
> [`crafty-preset-typescript`](05_Packages/05_crafty-preset-typescript.md) will
> add the support for `ts` and `tsx`

To be able to use `.ts` or `.tsx` test files, you'll have to add `@types/jest` as a dependency :

```sh
npm install --save @types/jest
```

## `crafty test`

Running `crafty test` will run all test and exit. But you can use any option
provided by Jest itself.

For example `crafty test --watch` will run your tests in watch mode. This mode
will run all your tests once and once it's done will wait for code or test
changes to re-run the concerned tests.

## Writing Tests

To create tests, add `it()` (or `test()`) blocks with the name of the test and
its code. You may optionally wrap them in `describe()` blocks for logical
grouping but this is neither required nor recommended.

Jest provides a built-in `expect()` global function for making assertions. A
basic test could look like this:

```js
import sum from "./sum";

it("sums numbers", () => {
  expect(sum(1, 2)).toEqual(3);
  expect(sum(2, 2)).toEqual(4);
});
```

All `expect()` matchers supported by Jest are
[extensively documented here](http://facebook.github.io/jest/docs/expect.html).<br />
You can also use
[`jest.fn()` and `expect(fn).toBeCalled()`](http://facebook.github.io/jest/docs/expect.html#tohavebeencalled)
to create “spies” or mock functions.

## Testing Components

A broad spectrum of component testing techniques exists. They range from a
“smoke test” verifying that a component renders without throwing, to shallow
rendering and testing some of the output, to full rendering and testing
component lifecycle and state changes.

Different projects choose different testing trade-offs based on how often
components change, and how much logic they contain. If you haven’t decided on a
testing strategy yet, we recommend that you start with creating simple smoke
tests for your components:

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
});
```

This test mounts a component and makes sure that it didn’t throw during
rendering. Tests like this provide a lot value with little effort so they are
great as a starting point, and this is the test you will find in
`src/App.test.js`.

When you encounter bugs caused by changing components, you will gain a deeper
insight into which parts of them are worth testing in your application. This
might be a good time to introduce more specific tests asserting specific
expected output or behavior.

If you’d like to test components in isolation from the child components they
render, we recommend using
[`shallow()` rendering API](http://airbnb.io/enzyme/docs/api/shallow.html) from
[Enzyme](http://airbnb.io/enzyme/). To install it, run:

```sh
npm install --save enzyme react-test-renderer
```

You can write a smoke test with it too:

```js
import React from "react";
import { shallow } from "enzyme";
import App from "./App";

it("renders without crashing", () => {
  shallow(<App />);
});
```

Unlike the previous smoke test using `ReactDOM.render()`, this test renders
`<App>` but doesn’t go deeper. For example, even if `<App>` itself renders a
`<Button>` that throws, this test will pass. Shallow rendering is great for
isolated unit tests, but you may still want to create some full rendering tests
to ensure the components integrate as expected. Enzyme supports
[full rendering with `mount()`](http://airbnb.io/enzyme/docs/api/mount.html),
and you can also use it for testing state changes and component lifecycle.

You can read the [Enzyme documentation](http://airbnb.io/enzyme/) for more
testing techniques. Enzyme documentation uses Chai and Sinon for assertions but
you don’t have to use them because Jest provides built-in `expect()` and
`jest.fn()` for spies.

Here is an example from Enzyme documentation that asserts specific output,
rewritten to use Jest matchers:

```js
import React from "react";
import { shallow } from "enzyme";
import App from "./App";

it("renders welcome message", () => {
  const wrapper = shallow(<App />);
  const welcome = <h2>Welcome to React</h2>;
  // expect(wrapper.contains(welcome)).to.equal(true);
  expect(wrapper.contains(welcome)).toEqual(true);
});
```

All Jest matchers are
[extensively documented here](http://facebook.github.io/jest/docs/expect.html).

You might find [jest-enzyme](https://github.com/blainekasten/enzyme-matchers)
helpful to simplify your tests with readable matchers. The above `contains` code
can be written simpler with jest-enzyme.

```js
expect(wrapper).toContainReact(welcome);
```

To enable this, install `jest-enzyme`:

```sh
npm install --save jest-enzyme
```

## Focusing and Excluding Tests

You can replace `it()` with `xit()` to temporarily exclude a test from being
executed.<br /> Similarly, `fit()` lets you focus on a specific test without
running any other tests.

## Coverage Reporting

Jest has an integrated coverage reporter that works well with EcmaScript 2015+
and requires no configuration.<br /> Run `crafty test --coverage` to include a
coverage report like this:

![coverage report](http://i.imgur.com/5bFhnTS.png)

Note that tests run much slower with coverage. We recommend to run it separately
from your normal workflow.

## Snapshot Testing

Snapshot testing is a feature of Jest that automatically generates text
snapshots of your components and saves them on the disk so if the UI output
changes, you get notified without manually writing any assertions on the
component output.
[Read more about snapshot testing.](http://facebook.github.io/jest/blog/2016/07/27/jest-14.html)

## Extending the configuration

Each preset and `crafty.config.js` can define the `jest(crafty, options)`
function to override Jest's configuration.

```javascript
const path = require("path");
const MODULES = path.join(__dirname, "..", "node_modules");

module.exports = {
  /**
   * Represents the extension point for rollup configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} options - The Jest configuration object
   */
  jest(crafty, options) {
    // Adds this directory to resolve modules
    options.moduleDirectories.push(MODULES);

    // Add a transformer for TypeScript
    options.transform["^.+\\.tsx?$"] = require.resolve(
      "ts-jest/preprocessor.js"
    );

    // Add file extensions to resolve imports
    options.moduleFileExtensions.push("ts");
    options.moduleFileExtensions.push("tsx");
  }
};
```

The full list of available configuration option is available
[on the official website](https://facebook.github.io/jest/docs/en/configuration.html).
