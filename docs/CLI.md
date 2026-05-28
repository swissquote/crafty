Crafty comes with some commands by default and presets can add new commands.

Here are the default commands:

[TOC]

## `crafty`

Will list the available commands and tasks.

## `crafty run [task [task...]]`

This is the main entry point to execute one or more tasks in Crafty.

Running `crafty run` without a task will execute the `default` task.

You can specify one or more tasks to run, separated by space.

## `crafty watch`

Running the watch mode will execute all tasks once at the start. After that, it
will watch for file system changes and re-execute related tasks once a change
occurs.

All presets can add watchers for any file pattern or use their embedded watcher
(like Webpack).

## `crafty test`

Presets can register test runners. When running `crafty test`, Crafty expects
one configured test runner and invokes it.

Crafty provides two test runner presets; Jest and Vitest.

## Commands added by presets

### `crafty cssLint [file|dir|glob]*`

Bundled Stylelint with embedded presets,
[read more here](05_Packages/05_crafty-preset-postcss)

### `crafty jsLint [file|dir|glob]*`

Bundled ESLint with embedded presets,
[read more here](05_Packages/05_crafty-preset-babel)
