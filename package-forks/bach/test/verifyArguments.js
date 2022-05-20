"use strict";

const test = require("ava");

var verifyArguments = require("../lib/helpers").verifyArguments;

function validArg() {}

test("should act as pass-through for a valid set of arguments", function(t) {
  var args = [validArg, validArg];
  t.deepEqual(verifyArguments(args), args);
});

test("should throw descriptive error message on invalid argument", function(t) {
  function invalid() {
    verifyArguments([validArg, "invalid", validArg]);
  }

  t.throws(invalid, {
    message: "Only functions can be combined, got string for argument 1",
  });
});

test("should throw descriptive error message on when no arguments provided", function(t) {
  function empty() {
    verifyArguments([]);
  }

  t.throws(empty, { message: "A set of functions to combine is required" });
});
