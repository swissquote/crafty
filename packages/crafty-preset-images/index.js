const path = require("path");

const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const svgmin = require("gulp-svgmin");

module.exports = {
  defaultConfig() {
    return {
      bundleTypes: { img: "images" },
      img_basedir: "images",
      img_extensions: ["png", "jpg", "jpeg", "gif"]
    };
  },
  gulp(crafty, gulp, StreamHandler) {
    if (
      Object.keys(crafty.undertaker._registry.tasks()).some(
        task => task === "images"
      )
    ) {
      throw new Error(
        "Failed registering 'crafty-preset-images' a task with this name already exists"
      );
    }

    const sourcesPath = crafty.config.img_extensions.map(extension => {
      return path.join(crafty.config.img_basedir, "**", `*.${extension}`);
    });

    gulp.task("images_all", () => {
      const stream = new StreamHandler(
        sourcesPath,
        crafty.config.destination_img
      );

      //Only work on images that were changed
      if (crafty.isWatching()) {
        stream.add(newer(crafty.config.destination_img));
      }

      stream.add(imagemin());

      return stream.generate();
    });

    gulp.task("images_svg", () => {
      const stream = new StreamHandler(
        path.join(crafty.config.img_basedir, "**", "*.svg"),
        crafty.config.destination_img
      );

      stream.add(svgmin());

      return stream.generate();
    });

    gulp.task("images", gulp.parallel("images_all", "images_svg"));

    // Better to run only one watcher for all images
    crafty.watcher.add(path.join(crafty.config.img_basedir, "**/*"), "images");

    crafty.addDefaultTask("images");
  }
};
