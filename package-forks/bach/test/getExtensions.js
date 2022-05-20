"use strict";

const test = require("ava");

var getExtensions = require("../lib/helpers").getExtensions;

test("should return the argument if it is an object", function(t) {
  var obj = {};
  t.is(getExtensions(obj), obj);
});

test("should return undefined if argument is not an object", function(t) {
  var fn = function() {};
  t.is(getExtensions(fn), undefined);
});
