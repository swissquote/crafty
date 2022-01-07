// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm test`

const test = require("ava");

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const filter = require('../index');

const specDir = path.join(__dirname, 'cases');

function runTest(t, name, options) {
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

  t.is(processed.css, expected);
}

test('should not add SVG filters when none', (t) => {
  runTest(t, 'none');
});

test('should convert grayscale filters', (t) => {
  runTest(t, 'grayscale');
});

test('should convert sepia filters', (t) => {
  runTest(t, 'sepia');
});

test('should convert saturate filters', (t) => {
  runTest(t, 'saturate');
});

test('should convert hue-rotate filters', (t) => {
  runTest(t, 'hueRotate');
});

test('should convert invert filters', (t) => {
  runTest(t, 'invert');
});

test('should convert opacity filters', (t) => {
  runTest(t, 'opacity');
});

test('should convert brightness filters', (t) => {
  runTest(t, 'brightness');
});

test('should convert contrast filters', (t) => {
  runTest(t, 'contrast');
});

test('should convert blur filters', (t) => {
  runTest(t, 'blur');
});

test('should convert drop-shadow filters', (t) => {
  runTest(t, 'dropShadow');
});

test('should convert multiple filters', (t) => {
  runTest(t, 'multiple');
});

test('should not convert invalid filters', (t) => {
  runTest(t, 'invalid');
});

test('should deal correctly with edge cases', (t) => {
  runTest(t, 'edge');
});

test('should add IE filter when asking', (t) => {
  runTest(t, 'ie', { oldIE: true });
});

test('should not add filters if they are already present', (t) => {
  runTest(t, 'present', { same: true, oldIE: true });
});
