var assert = require("assert");

function noop() {}

// eslint-disable-next-line consistent-return
function getExtensions(lastArg) {
  if (typeof lastArg !== "function") {
    return lastArg;
  }
}

function filterSuccess(elem) {
  return elem.state === "success";
}

function filterError(elem) {
  return elem.state === "error";
}

function buildOnSettled(done) {
  if (typeof done !== "function") {
    // eslint-disable-next-line no-param-reassign
    done = noop;
  }

  function onSettled(error, result) {
    if (error) {
      return done(error, null);
    }

    var settledErrors = result.filter(filterError);
    var settledResults = result.filter(filterSuccess);

    var errors = null;
    if (settledErrors.length) {
      errors = settledErrors.map(e => e.value);
    }

    var results = null;
    if (settledResults.length) {
      results = settledResults.map(e => e.value);
    }

    return done(errors, results);
  }

  return onSettled;
}

function verifyArguments(rawArgs) {
  const args = rawArgs.flat();
  var lastIdx = args.length - 1;

  assert.ok(args.length, "A set of functions to combine is required");

  args.forEach((arg, argIdx) => {
    var isFunction = typeof arg === "function";
    if (isFunction) {
      return;
    }

    if (argIdx === lastIdx) {
      // Last arg can be an object of extension points
      return;
    }

    var msg = `Only functions can be combined, got ${typeof arg} for argument ${argIdx}`;
    assert.ok(isFunction, msg);
  });

  return args;
}

module.exports = {
  getExtensions,
  onSettled: buildOnSettled,
  verifyArguments
};
