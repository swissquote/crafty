var asyncSettle = require("async-settle");
var nowAndLater = require("now-and-later");

var helpers = require("./helpers");

function iterator(fn, key, cb) {
  return asyncSettle(fn, cb);
}

function buildSettleParallel(...allArgs) {
  var args = helpers.verifyArguments(allArgs);

  var extensions = helpers.getExtensions(args[args.length - 1]);

  if (extensions) {
    args = args.slice(0, args.length - 1);
  }

  function settleParallel(done) {
    var onSettled = helpers.onSettled(done);
    nowAndLater.map(args, iterator, extensions, onSettled);
  }

  return settleParallel;
}

module.exports = buildSettleParallel;
