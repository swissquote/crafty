const path = require("path");
const { test } = require("uvu");
const assert = require("uvu/assert");

const resolveSize = require("../lib/size");

test("w/o options", async () => {
  const size = await resolveSize("test/fixtures/duplicate-1.jpg");

  assert.equal(size, { width: 200, height: 114 });
});

test("basePath + loadPaths", async () => {
  const size = await resolveSize("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });

  assert.equal(size, { width: 200, height: 57 });
});

test("non-existing file", async () => {
  try {
    await resolveSize("non-existing.gif");
    assert.unreachable();
  } catch (err) {
    assert.instance(err, Error);
    assert.is(err.message, "Asset not found or unreadable: non-existing.gif");
  }
});

test("nonsupported file type", async () => {
  try {
    await resolveSize("test/fixtures/fonts/empty-sans.woff");
    assert.unreachable();
  } catch (err) {
    const absolutePath = path.resolve("test/fixtures/fonts/empty-sans.woff");
    assert.instance(err, Error);
    assert.is(err.message, `Empty file: ${absolutePath}`);
  }
});

test("invalid file", async () => {
  try {
    await resolveSize("test/fixtures/invalid.jpg");
    assert.unreachable();
  } catch (err) {
    const absolutePath = path.resolve("test/fixtures/invalid.jpg");
    assert.instance(err, Error);
    assert.is(err.message, `Corrupt JPG, exceeded buffer limits: ${absolutePath}`);
  }
});

test("node-style callback w/o options", () => {
  return new Promise((resolve) => {
    resolveSize("test/fixtures/duplicate-1.jpg", (err, size) => {
      assert.equal(size, { width: 200, height: 114 });
      resolve();
    });
  });
});

test("node-style callback w/ options", () => {
  return new Promise((resolve) => {
    resolveSize(
      "picture.png",
      {
        basePath: "test/fixtures",
        loadPaths: ["fonts", "images"],
      },
      (err, size) => {
        assert.equal(size, { width: 200, height: 57 });
        resolve();
      }
    );
  });
});

test("node-style callback + non-existing file", () => {
  return new Promise((resolve) => {
    resolveSize("non-existing.gif", (err, size) => {
      assert.instance(err, Error);
      assert.is(err.message, "Asset not found or unreadable: non-existing.gif");
      assert.is(size, undefined);
      resolve();
    });
  });
});

test.run();
