var Transform = require("stream").Transform;
var fs = require("fs");
var path = require("path");
var util = require("util");
var glob = require("glob");

var PluginError = require("plugin-error");

const promiseGlob = util.promisify(glob);

var PLUGIN_NAME = "gulp-newer";

function Newer(options) {
  Transform.call(this, { objectMode: true });

  if (!options) {
    throw new PluginError(
      PLUGIN_NAME,
      "Requires a dest string or options object"
    );
  }

  if (typeof options === "string") {
    /* eslint-disable-next-line no-param-reassign */
    options = { dest: options };
  } else if (options.dest && typeof options.dest !== "string") {
    throw new PluginError(PLUGIN_NAME, "Requires a dest string");
  }

  if (options.ext && typeof options.ext !== "string") {
    throw new PluginError(PLUGIN_NAME, "Requires ext to be a string");
  }

  if (options.map && typeof options.map !== "function") {
    throw new PluginError(PLUGIN_NAME, "Requires map to be a function");
  }

  if (!options.dest && !options.map) {
    throw new PluginError(
      PLUGIN_NAME,
      "Requires either options.dest or options.map or both"
    );
  }

  if (options.extra) {
    if (typeof options.extra === "string") {
      options.extra = [options.extra];
    } else if (!Array.isArray(options.extra)) {
      throw new PluginError(
        PLUGIN_NAME,
        "Requires options.extra to be a string or array"
      );
    }
  }

  /**
   * Path to destination directory or file.
   * @type {string}
   */
  this._dest = options.dest;

  /**
   * Optional extension for destination files.
   * @type {string}
   */
  this._ext = options.ext;

  /**
   * Optional function for mapping relative source files to destination files.
   * @type {function(string): string}
   */
  this._map = options.map;

  /**
   * Promise for the dest file/directory stats.
   * @type {[type]}
   */
  this._destStats = null;

  /**
   * If the provided dest is a file, we want to pass through all files if any
   * one of the source files is newer than the dest.  To support this, source
   * files need to be buffered until a newer file is found.  When a newer file
   * is found, buffered source files are flushed (and the `_all` flag is set).
   * @type {[type]}
   */
  this._bufferedFiles = null;

  /**
   * Indicates that all files should be passed through.  This is set when the
   * provided dest is a file and we have already encountered a newer source
   * file.  When true, all remaining source files should be passed through.
   * @type {boolean}
   */
  this._all = false;

  this._extra = options.extra;

  /**
   * Indicates that there are extra files (configuration files, etc.)
   * that are not to be fed into the stream, but that should force
   * all files to be rebuilt if *any* are older than one of the extra
   * files.
   */
  this._extraStats = null;
}
util.inherits(Newer, Transform);

Newer.prototype.lazyStats = async function() {
  return this._dest ? fs.promises.stat(this._dest) : Promise.resolve(null);
};

Newer.prototype.lazyExtraStats = async function() {
  if (!this._extra) {
    return Promise.resolve();
  }

  var extraFiles = [];
  for (let i = 0; i < this._extra.length; ++i) {
    extraFiles.push(promiseGlob(this._extra[i]));
  }
  return Promise.all(extraFiles)
    .then(fileArrays => {
      // First collect all the files in all the glob result arrays
      var allFiles = [];
      for (let i = 0; i < fileArrays.length; ++i) {
        allFiles = allFiles.concat(fileArrays[i]);
      }
      var extraStats = [];
      for (let i = 0; i < allFiles.length; ++i) {
        extraStats.push(fs.promises.stat(allFiles[i]));
      }
      return Promise.all(extraStats);
    })
    .then(resolvedStats => {
      // We get all the file stats here; find the *latest* modification.
      var latestStat = resolvedStats[0];
      for (var j = 1; j < resolvedStats.length; ++j) {
        if (resolvedStats[j].mtime > latestStat.mtime) {
          latestStat = resolvedStats[j];
        }
      }
      return latestStat;
    })
    .catch(error => {
      throw new PluginError(
        PLUGIN_NAME,
        error && error.path
          ? `Failed to read stats for an extra file: ${error.path}`
          : `Failed to stat extra files; unknown error: ${error}`
      );
    });
};

/**
 * Pass through newer files only.
 * @param {File} srcFile A vinyl file.
 * @param {string} encoding Encoding (ignored).
 * @param {function(Error, File)} done Callback.
 */
/* eslint-disable-next-line @swissquote/swissquote/sonarjs/cognitive-complexity */
Newer.prototype._transform = async function(srcFile, encoding, done) {
  if (!srcFile || !srcFile.stat) {
    done(new PluginError(PLUGIN_NAME, "Expected a source file with stats"));
    return;
  }

  if (!this._destStats) {
    this._destStats = this.lazyStats();
  }

  if (!this._extraStats) {
    this._extraStats = this.lazyExtraStats();
  }

  var self = this;
  await Promise.all([this._destStats, this._extraStats])
    .then(([destStats, extraStats]) => {
      if ((destStats && destStats.isDirectory()) || self._ext || self._map) {
        // stat dest/relative file
        var relative = srcFile.relative;
        var ext = path.extname(relative);
        var destFileRelative = self._ext
          ? relative.substr(0, relative.length - ext.length) + self._ext
          : relative;
        if (self._map) {
          destFileRelative = self._map(destFileRelative);
        }
        var destFileJoined = self._dest
          ? path.join(self._dest, destFileRelative)
          : destFileRelative;
        return Promise.all([fs.promises.stat(destFileJoined), extraStats]);
      } else {
        // wait to see if any are newer, then pass through all
        if (!self._bufferedFiles) {
          self._bufferedFiles = [];
        }
        return [destStats, extraStats];
      }
    })
    .catch(function(err) {
      if (err.code === "ENOENT") {
        // dest file or directory doesn't exist, pass through all
        return [null, this._extraStats];
      } else {
        // unexpected error
        throw err;
      }
    })
    .then(([destFileStats, extraFileStats]) => {
      var newer = !destFileStats || srcFile.stat.mtime > destFileStats.mtime;
      // If *any* extra file is newer than a destination file, then ALL
      // are newer.
      if (extraFileStats && extraFileStats.mtime > destFileStats.mtime) {
        newer = true;
      }
      if (self._all) {
        self.push(srcFile);
      } else if (!newer) {
        if (self._bufferedFiles) {
          self._bufferedFiles.push(srcFile);
        }
      } else {
        if (self._bufferedFiles) {
          // flush buffer
          self._bufferedFiles.forEach(file => {
            self.push(file);
          });
          self._bufferedFiles.length = 0;
          // pass through all remaining files as well
          self._all = true;
        }
        self.push(srcFile);
      }
      done();
    })
    .catch(done);
};

/**
 * Remove references to buffered files.
 * @param {function(Error)} done Callback.
 */
Newer.prototype._flush = function(done) {
  this._bufferedFiles = null;
  done();
};

/**
 * Only pass through source files that are newer than the provided destination.
 * @param {Object} options An options object or path to destination.
 * @return {Newer} A transform stream.
 */
module.exports = function(options) {
  return new Newer(options);
};
