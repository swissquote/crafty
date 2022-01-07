const path = require("path");
const test = require("ava");

const resolveSize = require("../lib/size");

test("w/o options", async t => {
  const size = await resolveSize("test/fixtures/duplicate-1.jpg");

  t.deepEqual(size, { width: 200, height: 114 });
});

test("basePath + loadPaths", async t => {
  const size = await resolveSize("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });

  t.deepEqual(size, { width: 200, height: 57 });
});

test("non-existing file", async t => {
  try {
    await resolveSize("non-existing.gif");
    t.unreachable();
  } catch (err) {
    t.truthy(err instanceof Error);
    t.is(err.message, "Asset not found or unreadable: non-existing.gif");
  }
});

test("nonsupported file type", async t => {
  try {
    await resolveSize("test/fixtures/fonts/empty-sans.woff");
    t.unreachable();
  } catch (err) {
    const absolutePath = path.resolve("test/fixtures/fonts/empty-sans.woff");
    t.truthy(err instanceof Error);
    t.is(err.message, `Empty file: ${absolutePath}`);
  }
});

test("invalid file", async t => {
  try {
    await resolveSize("test/fixtures/invalid.jpg");
    t.unreachable();
  } catch (err) {
    const absolutePath = path.resolve("test/fixtures/invalid.jpg");
    t.truthy(err instanceof Error);
    t.is(err.message, `Corrupt JPG, exceeded buffer limits: ${absolutePath}`);
  }
});

test("node-style callback w/o options", (t) => {
  return new Promise((resolve) => {
    resolveSize("test/fixtures/duplicate-1.jpg", (err, size) => {
      t.deepEqual(size, { width: 200, height: 114 });
      resolve();
    });
  });
});

test("node-style callback w/ options", (t) => {
  return new Promise((resolve) => {
    resolveSize(
      "picture.png",
      {
        basePath: "test/fixtures",
        loadPaths: ["fonts", "images"],
      },
      (err, size) => {
        t.deepEqual(size, { width: 200, height: 57 });
        resolve();
      }
    );
  });
});

test("node-style callback + non-existing file", (t) => {
  return new Promise((resolve) => {
    resolveSize("non-existing.gif", (err, size) => {
      t.truthy(err instanceof Error);
      t.is(err.message, "Asset not found or unreadable: non-existing.gif");
      t.is(size, undefined);
      resolve();
    });
  });
});
