'use strict';

const test = require("ava");

var onSettled = require('../lib/helpers').onSettled;

var errors = [
  { state: 'error', value: new Error('Error 1') },
  { state: 'error', value: new Error('Error 2') },
];

  test('should group all errors', function(t) {
    onSettled(function(errs, results) {
      t.is(errs.length, 2);
      t.is(results, null);
    })(null, errors);
  });

  test('should error early if called with an error', function(t) {
    onSettled(function(err, results) {
      t.true(err instanceof Error);
      t.is(results, null);
    })(new Error('Should not happen'));
  });

  test('should handle the no callback case', function(t) {
    t.notThrows(() => onSettled()(null, errors));
  });

  test('should handle non-functions as callbacks', function(t) {
    t.notThrows(() => onSettled('not a function')(null, errors));
  });
