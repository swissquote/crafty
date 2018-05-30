## Description

`crafty` is the core package of Crafty, it gives the foundations to load presets and execute the tasks and commands created by them.

Crafty comes with three default commands, reads one configuration file and loads presets.
All the rest is handled by presets.

## The philosophy

Crafty's philosophy is that there are great build and automation tools out there, we don't want to reinvent them.

Gulp is awesome to create tasks and streams of work, Webpack is great at creating bundles, PostCSS and its plugin ecosystem is big. But what plugins and loaders should we use for our needs ?

Crafty's philosophy is that if you wish to use Gulp and Webpack together, it should be easy.
If you want to use TypeScript instead of Babel, it should be a single configuration line change.

The default configuration should allow you to get started in a couple of minutes, but you should be able to fine-tune the configuration to your needs.

Another aspect is that configuring your build process once is one thing, keeping it up-to-date is more complicated. Does a new major version of PostCSS work with my existing plugins ? Does this minor update introduce a breaking change by mistake ? Crafty takes care of that heavy lifting and helps you keep your `package.json` small.

## What's inside

### Bundles

In Crafty, a bundle is a piece of configuration that represents one or more source files and one destination file. (In some cases, more than one destination file.)

Each bundle has to be treated by a runner.

### Runners

A runner's purpose is to take a bundle and turn it into a task that will then take your files and compile them.

Each runner can be augmented with presets.

### Presets

Presets are a way to extend Crafty's capabilities with new tasks, commands, runners and configuration.

Each preset can use any number of extension points (functions) that will be executed by crafty or other presets.

We have an extension point that can override the configuration, an extension point to add Babel plugins (provided by the Babel preset) and more.

Read more about [the anatomy of a preset](Anatomy_of_a_preset.md)

## Existing runners and presets

* [`crafty-runner-webpack`](05_Packages/02_crafty-runner-webpack.md) Use this runner to bundle your code with Webpack.
* [`crafty-runner-gulp`](05_Packages/02_crafty-runner-gulp.md) Use this runner to be able to create Gulp tasks in your projects.
* [`crafty-preset-babel`](05_Packages/05_crafty-preset-babel) EcmaScript 2015+ support with Babel and ESLint with our linting rules.
* [`crafty-preset-postcss`](05_Packages/05_crafty-preset-postcss) Compile your CSS using PostCSS, works with Webpack and Gulp.
* [`crafty-preset-typescript`](05_Packages/05_crafty-preset-typescript) This preset provides TypeScript support and configures TSLint with our linting rules.
* [`crafty-preset-images`](05_Packages/05_crafty-preset-images.md) This preset compresses your SVG/PNG/JPG/GIF files.
* [`crafty-preset-images-simple`](05_Packages/05_crafty-preset-images-simple.md) If you are behind a corporate proxy, this preset will copy images without compressing them.
* [`crafty-preset-maven`](05_Packages/05_crafty-preset-maven.md) This preset overrides the destination to move your compiled assets to the right directory in `target` of your Maven project.
* [`crafty-preset-react`](05_Packages/05_crafty-preset-react.md) A preset that provides default configuration when using React in a project. JSX Compilation is handled by the `crafty-preset-babel` already (**Not Ready**)
* [`crafty-preset-jest`](05_Packages/05_crafty-preset-jest.md) This preset will add Jest to the `crafty test` command, works with Babel and TypeScript.
