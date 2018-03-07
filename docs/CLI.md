Crafty comes with some commands by default and presets can add new commands.

Here are the default commands:

[TOC]

## `crafty`

Will list the available commands and tasks.

## `crafty run [task [task...]]`

This is the main entry point to execute one or more tasks in Crafty.

Running `crafty run` without a task will execute the `default` task.

Otherwise you can execute as many tasks as you wish.

## `crafty watch`

Running the watch mode will execute all tasks once at the start. After that, it
will watch for file system changes and re-execute related tasks once a change
occurs.

All presets can add watchers for any file pattern or use their embedded watcher
(like Webpack).

## `crafty test`

Presets can register test runners, when running `crafty test` all these test
runners are invoked.

Currently Jest is the only test runner which has a preset.

## Commands added by presets

### `crafty cssLint [file|dir|glob]*`

Bundled Stylelint with embedded presets,
[read more here](05_Packages/05_crafty-preset-postcss)

### `crafty jsLint [file|dir|glob]*`

Bundled ESLint with embedded presets,
[read more here](05_Packages/05_crafty-preset-babel)
