<table>
<tr><th>Compatible Runners</th><td>

- [Webpack](05_Packages/02_crafty-runner-webpack.md)

</td></tr>
<tr><th>Test Runners</th><td>

- [Jest](05_Packages/05_crafty-preset-jest.md)

</td></tr>
<tr><th>Related presets</th><td>

- [Babel](05_Packages/05_crafty-preset-babel.md)
- [TypeScript](05_Packages/05_crafty-preset-typescript.md)
- [Jest](05_Packages/05_crafty-preset-jest.md)

</td></tr>
</table>

This preset provides utilities for Jest and Hot Module Replacement in React
projects.

[TOC]

## Installation

```bash
npm install @swissquote/crafty-preset-babel --save
```

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-babel", // also works with crafty-preset-typescript
    "@swissquote/crafty-runner-webpack", // optional
    "@swissquote/crafty-preset-react"
  ],
  js: {
    app: {
      runner: "webpack",
      source: "js/app.js",
      hot: true, // Hot Module Replacement must be enabled for React Hot Loader to work
      react: true // React Hot Loader must be explicitly enabled in your bundle
    }
  }
};
```

## Testing React components in Jest

This preset comes with [Enzyme](https://github.com/airbnb/enzyme) already
configured for React 16.

This allows you to do shallow rendering of components, execute events and check
the state of components.

Their documentation on testing components is exhaustive.

[Check it out](http://airbnb.io/enzyme/)

## Hot Module Replacement

When doing modern JavaScript development, the usual process is **Write code**,
**Compile**, **Refresh the browser**.

- `crafty watch` removes the **Compile** step because it's run automatically.
- Hot Module Replacement (HMR) was created to remove the **Refresh the browser**
  part.

More precisely, when doing a build with Webpack, in development mode, a
Websocket client is added to the build and a small HTTP server is started. When
the page is loaded, each bundle will establish a Websocket connection to the
server.

When you change a line of code, the server will rebuild them and send a
notification through Websockets to the browser, the browser will then download
the patch and apply the code change.

With React components, it will even re-render them without losing the current
state.

Here's an example :

![React Hot Module Replacement example](../react-hot-loader.gif)

To enable HMR on your react application, you must set `hot: true` and `react: true` on your bundle in `crafty.config.js`.

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
