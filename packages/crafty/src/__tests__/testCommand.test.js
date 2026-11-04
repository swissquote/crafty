const { test, afterEach } = require("node:test");
const { expect } = require("expect");
const testCommand = require("../commands/testCommand");

const initialEnvironment = process.env.NODE_ENV;

afterEach(() => {
  if (initialEnvironment === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = initialEnvironment;
  }
});

function runWithOriginalEnvironment(originalEnvironment) {
  const crafty = {
    originalEnvironment,
    getImplementations: () => []
  };

  // Without a runner, the command rejects after it restored NODE_ENV
  return testCommand.command(crafty, [], {}).catch(() => undefined);
}

test("sets NODE_ENV to test when it was not set before", async () => {
  process.env.NODE_ENV = "production";

  await runWithOriginalEnvironment(undefined);

  expect(process.env.NODE_ENV).toBe("test");
});

test("restores the original NODE_ENV", async () => {
  process.env.NODE_ENV = "production";

  await runWithOriginalEnvironment("development");

  expect(process.env.NODE_ENV).toBe("development");
});
