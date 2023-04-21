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
    crafty.runAllSync("gulp", crafty, gulp, StreamHandler);
  }
};
