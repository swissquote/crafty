const StreamHandler = require("./StreamHandler");
const Gulp = require("./Gulp.js");

const gulpSymbol = Symbol.for("gulp");

function getGulp(crafty) {
  return crafty[gulpSymbol];
}

module.exports = {
  init(crafty) {
    crafty[gulpSymbol] = new Gulp(crafty);
    StreamHandler.init(crafty, getGulp(crafty));
  },
  bundleCreator(/*crafty*/) {
    return {
      __gulp(craftyAgain, bundle, creator) {
        creator(craftyAgain, bundle, getGulp(craftyAgain), StreamHandler);
      }
    };
  },
  tasks(crafty) {
    crafty.runAllSync("gulp", crafty, getGulp(crafty), StreamHandler);
  }
};
