const test = require("ava");
const path = require("path");
const testUtils = require("../utils");

test.serial("Fails if no pom is found", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-maven/missing-pom"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.is(result.status, 0);
  t.truthy(
    result.stdall.includes(
      "Could not define destination using maven, falling back to default."
    )
  );
  t.truthy(result.stdall.includes("No pom.xml found"));
  t.snapshot(result);

  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
});

test.serial("Places files in target of a webapp", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-maven/webapp");

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(
    testUtils.exists(
      cwd,
      "target/my-app-1.0.0-SNAPSHOT/resources/js/myBundle.min.js"
    )
  );
});

test.serial("Reads env. var before pom.xml", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-maven/env-override"
  );

  const result = await testUtils.run(["run", "default"], cwd, {
    env: { TARGET_BASEDIR: path.join(cwd, "target/some_basedir") }
  });

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(
    testUtils.exists(cwd, "target/some_basedir/resources/js/myBundle.min.js")
  );
});

test.serial(
  "Places files in target of a webapp from within a subfolder",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-maven/subfolder/src/main/frontend"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    t.snapshot(result);
    t.is(result.status, 0);

    t.truthy(
      testUtils.exists(
        cwd,
        "../../../target/my-app-1.0.0-SNAPSHOT/resources/js/myBundle.min.js"
      )
    );
  }
);

test.serial("Places files in target of a webjar", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-maven/webjar");

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(
    testUtils.exists(
      cwd,
      "target/classes/META-INF/resources/webjars/js/myBundle.min.js"
    )
  );
});
