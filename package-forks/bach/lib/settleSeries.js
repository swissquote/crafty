var asyncSettle = require("async-settle");
var nowAndLater = require("now-and-later");

var helpers = require("./helpers");

function iterator(fn, key, cb) {
  return asyncSettle(fn, cb);
}

function buildSettleSeries(...allArgs) {
  var args = helpers.verifyArguments(allArgs);

  var extensions = helpers.getExtensions(args[args.length - 1]);

  if (extensions) {
    args = args.slice(0, args.length - 1);
  }

  function settleSeries(done) {
    var onSettled = helpers.onSettled(done);
    nowAndLater.mapSeries(args, iterator, extensions, onSettled);
  }

  return settleSeries;
}

module.exports = buildSettleSeries;
