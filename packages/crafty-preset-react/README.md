<table>
<tr><th>Compatible Runners</th><td>

- [Webpack](05_Packages/02_crafty-runner-webpack.md)

</td></tr>
<tr><th>Test Runners</th><td>

- [Jest](05_Packages/05_crafty-preset-jest.md)
- [Vitest](05_Packages/05_crafty-preset-vitest)

</td></tr>
<tr><th>Related presets</th><td>

- [Babel](05_Packages/05_crafty-preset-babel.md)
- [TypeScript](05_Packages/05_crafty-preset-typescript.md)
- [SWC](05_Packages/05_crafty-preset-swc.md)
- [Jest](05_Packages/05_crafty-preset-jest.md)
- [Vitest](05_Packages/05_crafty-preset-vitest)

</td></tr>
</table>

This preset provides utilities for React testing and Hot Module Replacement in
React projects.

[TOC]

When combined with `crafty-preset-jest` or `crafty-preset-vitest`, this preset
adds the React test setup file automatically.

## Installation

```bash
npm install @swissquote/crafty-preset-babel --save
```

```javascript
module.exports = {
  presets: [
    // also works with crafty-preset-typescript or crafty-preset-swc
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-runner-webpack",
    "@swissquote/crafty-preset-react",
  ],
  js: {
    app: {
      runner: "webpack",
      source: "js/app.js",
      hot: true, // Hot Module Replacement must be enabled for any kind of reload to work
      react: true, // React features must be enabled per bundle
    },
  },
};
```

## React Compiler

> This feature works with the **SWC** preset on Webpack, Rspack and Gulp.

The [React Compiler](https://react.dev/learn/react-compiler) automatically
memoizes your components and hooks at build time, removing most of the need for
manual `useMemo`, `useCallback` and `React.memo`. Crafty enables it through
SWC's built-in support.

It is **disabled by default** and must be opted into per bundle by setting
`reactCompiler` on the bundle's `react` option:

```js
module.exports = {
  presets: [
    "@swissquote/crafty-preset-swc",
    "@swissquote/crafty-runner-webpack",
    "@swissquote/crafty-preset-react",
  ],
  js: {
    app: {
      source: "js/app.js",
      react: {
        reactCompiler: true,
      },
    },
  },
};
```

The compiler runs in both development and production builds, and can be combined
with Fast Refresh:

```js
react: {
  refreshMode: "fast",
  reactCompiler: true,
}
```

### Requirements

- The compiler targets **React 19** by default. For React 17 or 18, set the
  `target` option (see below).
- With Rspack, the compiler requires `@rspack/core` **2.1.0 or later**.

### Options

Passing `true` uses SWC's defaults. To configure the compiler, pass an object
instead — the options match the
[React Compiler configuration](https://react.dev/reference/react-compiler/configuration)
(for example `target`, `compilationMode`, `panicThreshold`):

```js
react: {
  reactCompiler: {
    target: "18", // "17" | "18" | "19" (default)
  },
}
```

### Disabling it

The React Compiler is off by default, so there is nothing to do to keep it
disabled. To turn it off for a bundle where it was enabled, remove the
`reactCompiler` key or set it to `false`:

```js
react: {
  reactCompiler: false,
}
```

## Hot Module Replacement

When doing modern JavaScript development, the usual process is **Write code**,
**Compile**, **Refresh the browser**.

- `crafty watch` removes the **Compile** step because it's run automatically.
- Hot Module Replacement (HMR) was created to remove the **Refresh the browser**
  part.

More precisely, when doing a build with Webpack, in development mode, a
Websocket client is added to the build and an HTTP server is started.
When the page is loaded, each bundle will establish a Websocket connection to the server.

When you change a line of code, the server will rebuild them and send a
notification through Websocket to the browser, the browser will then download
the patch and apply the code change.

With React components, it will even re-render them without losing the current
state.

Here's an example :

![React Hot Module Replacement example](../react-hot-loader.gif)

## React Hot Module Replacement variants

There are two ways to make this work

### Fast Refresh

> This variant will work when using the Babel, TypeScript and SWC presets with Webpack.

Starting with React 16.13, [Fast Refresh](https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin) is the way to do Hot Module Replacement and doesn't require to add code to your application to get it to work.
This is the recommended way and will be the default starting with Crafty 1.20.0

To enable it, add these two parameters to your bundle in `crafty.config.js`:

```js
{
  hot: true,
  react: {
    refreshMode: "fast"
  }
}
```

You're now ready to run `crafty watch` and use Fast Refresh on all your components.

> If you are importing React through Requirejs or other ways that aren't controlled by Webpack, make sure that you are using the development version while running in watch mode, otherwise no refresh will be applied.

### React Hot Loader

> This variant will work when using the Babel or TypeScript presets with Webpack.

Most versions of React can work with [React Hot Loader](https://www.npmjs.com/package/react-hot-loader), but in some cases can't keep the component's state on refresh or don't support hooks, it's a deprecated way to do and will be removed from Crafty in the future.

To enable it, add these two parameters to your bundle in `crafty.config.js`:

```js
{
  hot: true,
  react: {
    refreshMode: "hot"
  }
}
```

Then you must mark your root component as hot-exported :

```javascript
import React from "react";
import { hot } from "react-hot-loader";

const App = () => <div>Hello World!</div>;

export default hot(module)(App);
```

Only the root component needs this wrapping, the child components don't need it.

### TypeScript

If you're using TypeScript you have one more step to make

```bash
npm install --save @types/webpack-env
```

[Read more about Hot Module Replacement](https://medium.com/@rajaraodv/webpack-hot-module-replacement-hmr-e756a726a07#.6qqb8241p)
