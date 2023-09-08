import path from "path";

export default {
  defaultConfig() {
    return {
      bundleTypes: { img: "images" },
      img_basedir: "images"
    };
  },
  gulp(crafty, gulp /*, StreamHandler*/) {
    //eslint-disable-line no-unused-vars
    // Only register this task if there is not any other images task
    if (
      Object.keys(crafty.undertaker._registry.tasks()).some(
        task => task === "images"
      )
    ) {
      throw new Error(
        "Failed registering 'crafty-preset-images-simple' a task with this name already exists"
      );
    }

    const sourcesPath = path.join(crafty.config.img_basedir, "**", "*");

    // Register the tasks to copy images over
    gulp.task("images", () => {
      return gulp
        .src(sourcesPath, { encoding: false })
        .pipe(gulp.dest(crafty.config.destination_img));
    });

    // Register the watcher for the images task
    crafty.watcher.add(sourcesPath, "images");

    crafty.addDefaultTask("images");
  }
};
