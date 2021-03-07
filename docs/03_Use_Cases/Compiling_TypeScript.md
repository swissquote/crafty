[TOC]

When compiling TypeScript, like for JavaScript, you have to know wether you are
going to develop in an application or a library. The good news is that Crafty
makes it a breeze to switch from one to the other.

## Compiling TypeScript for a webapp ( Webpack / rollup.js )

When developing for a webapp, you wish for all files to be packed into the
smallest number of files, because the number of requests that a final
application will make are directly related to the performance of that
application.

Webpack and rollup.js do a great job at optimizing your bundles into the
smallest possible package. For this use case, we are going to use Webpack, but
they are interchangeable in this example.

### Installing the preset with Webpack

```bash
cd src/main/frontend
npm install @swissquote/crafty @swissquote/crafty-preset-typescript @swissquote/crafty-runner-webpack --save
```

In your `crafty.config.js` file, you must add the following presets and create a
bundle.

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-typescript",
    "@swissquote/crafty-runner-webpack"
  ],
  js: {
    app: {
      runner: "webpack",
      source: "js/index.ts"
    }
  }
};
```

Then, you can create a `tsconfig.json` next to `crafty.config.js`.

```json
{
  "exclude": ["node_modules", "node", "css", "etc"],
  "compilerOptions": {
    "declaration": true,
    "moduleResolution": "node",
    "charset": "UTF-8",
    "jsx": "react",
    "module": "esnext", // Using an ES6 module with an ES5 target allows to leverage tree shaking
    "sourceMap": true,
    "target": "es5",
    "lib": ["DOM", "ES2017", "DOM.Iterable", "ScriptHost"]
  }
}
```

You are now ready to run `crafty run` and compile your TypeScript source files
with Webpack.

Read more about
[`crafty-preset-typescript`](05_Packages/05_crafty-preset-typescript).

You can also know more about
[Webpack's features and options](05_Packages/02_crafty-runner-webpack.md)

## Compiling TypeScript for a library ( Gulp )

When developing a library, you can either go the same direction as a webapp and
merge all the files into one bundle, or you can keep each source file in a
separate compiled file and use them as-is.

The advantage of the second approach is that the Tree-Shaking that can be done
in the final application is much more efficient if the compiled files stay
separate. (Like a component library).

This approach is not recommended if you know that most of your library
will always be used, as we would recommend to use rollup.js in that case.

### Installing the preset with Gulp

```bash
cd src/main/frontend
npm install @swissquote/crafty @swissquote/crafty-preset-typescript @swissquote/crafty-runner-gulp --save
```

In your `crafty.config.js` file, you must add the following presets and create a
bundle.

You can see that the bundle we created contains a glob as the source, this means
that all source files will be compiled separately, and the dependencies between
the files won't be resolved (like Webpack or rollup.js would do).

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-typescript",
    "@swissquote/crafty-runner-gulp"
  ],
  js: {
    lib: {
      runner: "gulp/typescript",
      source: "js/**/*.ts"
    }
  }
};
```

Then, you can create a `tsconfig.json` next to `crafty.config.js`.

```json
{
  "exclude": ["node_modules", "node", "css", "etc"],
  "compilerOptions": {
    "declaration": true,
    "moduleResolution": "node",
    "charset": "UTF-8",
    "jsx": "react",
    "module": "esnext", // Using an ES6 module with an ES5 target allows to leverage tree shaking
    "sourceMap": true,
    "target": "es5",
    "lib": ["DOM", "ES2017", "DOM.Iterable", "ScriptHost"]
  }
}
```

You are now ready to run `crafty run` and compile your TypeScript source files
with Gulp.

Read more about
[`crafty-preset-typescript`](05_Packages/05_crafty-preset-typescript).

## Features

All features that exist in EcmaScript 2016 are supported in TypeScript.

On top of that, TypeScript supports optional typing for each variable, function
parameter and return type.

Read more about
[TypeScript specific features](05_Packages/05_crafty-preset-typescript/TypeScript_Features.md)
