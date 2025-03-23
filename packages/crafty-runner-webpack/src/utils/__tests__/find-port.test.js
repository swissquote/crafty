const { test } = require('node:test');
const { expect } = require('expect');

const portFinder = require("../find-port");

test("it can return port", async () => {
  const port = await portFinder.getFree("js_app");

  expect(typeof port).toBe("number");
  expect(port).toBeGreaterThan(2014);
  expect(port).toBeLessThanOrEqual(65535);
});

test("it will return the same port for the same service", async () => {
  const port1 = await portFinder.getFree("js_app");
  const port2 = await portFinder.getFree("js_app");

  expect(port1).toBe(port2);
});
