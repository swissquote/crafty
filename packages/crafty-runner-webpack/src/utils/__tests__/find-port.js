const test = require("ava");

const portFinder = require("../find-port");

test("it can return port", async t => {
  const port = await portFinder.getFree("js_app");

  t.is(typeof port, "number");
  t.truthy(port > 2014);
  t.truthy(port <= 65535);
});

test("it will return the same port for the same service", async t => {
  const port1 = await portFinder.getFree("js_app");
  const port2 = await portFinder.getFree("js_app");

  t.is(port1, port2);
});
