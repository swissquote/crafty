const debug = require("debug")("crafty:runner-gulp");

const StreamHandler = require("./StreamHandler");
const Gulp = require("./Gulp.js");

let gulp;

module.exports = {
  init(crafty) {
    gulp = new Gulp(crafty);
    StreamHandler.init(crafty, gulp);
  },
  bundleCreator(/*crafty*/) {
    return {
      __gulp(craftyAgain, bundle, creator) {
        creator(craftyAgain, bundle, gulp, StreamHandler);
      }
    };
  },
  tasks(crafty) {
    crafty.getImplementations("gulp").forEach(preset => {
      debug(`${preset.presetName}.gulp(Crafty, Gulp, StreamHandler)`);
      preset.gulp(crafty, gulp, StreamHandler);
      debug("tasks registered");
    });
  }
};
