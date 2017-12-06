## Description

"Automate and enhance your workflow" This is how Gulp presents itself, Gulp is a
task runner, combined with an API of file streams.

This runner is based on Gulp 4.

[TOC]

## Features

* Create any gulp task
* Combine tasks in parallel or in series
* Create file watchers that run tasks or anything else on change.

## Adding Gulp tasks

```javascript
module.exports = {
  /**
   * Represents the extension point for rollup configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Gulp} gulp - The instance of Gulp.
   * @param {StreamHandler} StreamHandler - A wrapper to create your tasks.
   */
  gulp(crafty, gulp, StreamHandler) {
    // Create tasks
    gulp.task("images_svg", function() {
      const stream = new StreamHandler("images/**/*.svg", "dist/images");

      stream.add(svgmin());

      return stream.generate();
    });

    // Group tasks into other tasks
    gulp.task("images", gulp.parallel("images_svg"));

    // Create custom watchers
    gulp.watch(["js/*.js"]).on("change", function(path) {
      console.log("Change happened to", path);
    });
  }
};
```

The [full API of Gulp](https://github.com/gulpjs/gulp/blob/4.0/docs/API.md) is
supported

### Slight change in behavior of `gulp.watch()`

We changed the behavior of `gulp.watch()` in Crafty compared to how it works in
Gulp: Instead of watching directly, the watch will start when running `crafty
watch`.

This creates a clear separation between development and production builds.

### `StreamHandler`

`StreamHandler` is a utility class to help you create your streams.

It works the same way as `gulp.src()...pipe(gulp.dest())` but with some added
syntactic sugar:

* Doesn't return a new instance on every `pipe` thus allowing you to create
  complex streams without re-assigning the variable every time
* Includes `gulp-plumber` to catch errors

```javascript
gulp.task("images_svg", function() {
  const stream = new StreamHandler("images/**/*.svg", "dist/images");

  stream.add(svgmin());

  return stream.generate();
});
```

#### `new StreamHandler(source, destination[, errorCallback])`

* `source` is a glob or array of globs
* `destination` is a destination file or directory
* `errorCallback` is an optional callback that you can set to define what to do
  with errors in your stream

#### `stream.add(handler)`

Same as `.pipe(handler)`

#### `generate()`

Generates the stream and returns it.
