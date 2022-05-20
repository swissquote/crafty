var DefaultRegistry = require("undertaker-registry");

module.exports = class TaskMetadataRegistry extends DefaultRegistry {
  constructor(opts) {
    super();

    opts = opts || {};

    this.config = {
      port: opts.port || 8080,
      buildDir: opts.buildDir || "./build",
    };
  }

  set(name, fn) {
    var metadata = {
      name: name,
    };

    var task = (this._tasks[name] = fn.bind(metadata));
    return task;
  }
};
