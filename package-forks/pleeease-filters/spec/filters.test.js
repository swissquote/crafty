/* global it, expect, describe */
// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm test`

const { test } = require("uvu");
const assert = require("uvu/assert");

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const filter = require('../index');

const specDir = path.join(__dirname, 'cases');

function runTest(name, options) {
  // css
  const css = fs.readFileSync(path.join(specDir, `${name}.css`), 'utf-8');
  let expected;

  if (typeof options !== 'undefined' && options.same) {
    expected = css;
  } else {
    expected = fs.readFileSync(path.join(specDir, `${name}.out.css`), 'utf-8');
  }

  // process
  const processed = postcss(filter(options)).process(css);

  assert.is(processed.css, expected);
}

test('should not add SVG filters when none', () => {
  runTest('none');
});

test('should convert grayscale filters', () => {
  runTest('grayscale');
});

test('should convert sepia filters', () => {
  runTest('sepia');
});

test('should convert saturate filters', () => {
  runTest('saturate');
});

test('should convert hue-rotate filters', () => {
  runTest('hueRotate');
});

test('should convert invert filters', () => {
  runTest('invert');
});

test('should convert opacity filters', () => {
  runTest('opacity');
});

test('should convert brightness filters', () => {
  runTest('brightness');
});

test('should convert contrast filters', () => {
  runTest('contrast');
});

test('should convert blur filters', () => {
  runTest('blur');
});

test('should convert drop-shadow filters', () => {
  runTest('dropShadow');
});

test('should convert multiple filters', () => {
  runTest('multiple');
});

test('should not convert invalid filters', () => {
  runTest('invalid');
});

test('should deal correctly with edge cases', () => {
  runTest('edge');
});

test('should add IE filter when asking', () => {
  runTest('ie', { oldIE: true });
});

test('should not add filters if they are already present', () => {
  runTest('present', { same: true, oldIE: true });
});

test.run();
