var fs = require("fs");

var del = require("del");
var DefaultRegistry = require("undertaker-registry");

module.exports = class CommonRegistry extends DefaultRegistry {
  constructor(opts) {
    super();

    opts = opts || {};

    this.config = {
      port: opts.port || 8080,
      buildDir: opts.buildDir || "./build",
    };
  }

  init(taker) {
    var buildDir = this.config.buildDir;
    var exists = fs.existsSync(buildDir);

    if (exists) {
      throw new Error(
        "Cannot initialize undertaker-common-tasks registry. " +
          "`build/` directory exists."
      );
    }

    taker.task("clean", function() {
      return del([buildDir]);
    });

    taker.task("serve", function() {
      // your awesome feature here
    });
  }
};
