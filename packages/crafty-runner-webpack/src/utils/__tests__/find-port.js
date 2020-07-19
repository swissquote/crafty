/* global test, expect */
const portFinder = require("../find-port");

test("it can return port", () => {
  return portFinder.getFree("js_app").then(port => {
    expect(typeof port).toBe("number");
    expect(port).toBeGreaterThan(2014);
    expect(port).toBeLessThanOrEqual(65535);
  });
});

test("it will return the same port for the same service", () => {
  return portFinder.getFree("js_app").then(port1 => {
    return portFinder.getFree("js_app").then(port2 => {
      expect(port1).toEqual(port2);
    });
  });
});
