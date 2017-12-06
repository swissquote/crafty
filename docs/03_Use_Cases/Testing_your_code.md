[TOC]

Crafty comes with a `crafty test` command by default, but no test runner comes
built-in.

For that we made an integration with Jest.

## Installing

```bash
cd src/main/frontend
npm install @swissquote/crafty @swissquote/crafty-preset-jest --save
```

In your `crafty.config.js` file, you must add the following presets

```javascript
module.exports = {
  presets: ["@swissquote/crafty-preset-jest"]
};
```

## Your first test

in `js` create a file named `math.js`

```javascript
module.exports.add = function add(a, b) {
  return a + b;
};

module.exports.multiply = function multiply(a, b) {
  return a * b;
};
```

then in `js/__tests__` create another file named `math.js`

```javascript
const math = require("../math");

test("adds 1 + 2 to equal 3", () => {
  expect(math.add(1, 2)).toBe(3);
});

test("multiply something", () => {
  expect(math.multiply(2, 2)).toBe(4);
});
```

You can now run `crafty test` and see that the test is discovered and executed
automatically.

Read more about [`crafty-preset-jest`](05_Packages/05_crafty-preset-jest).

## With Babel or Typescript

You can also use EcmaScript 2015+ and TypeScript features by installing and
adding their respective presets.

They are configured automatically once you include them in `presets` from your
`crafty.config.js`
