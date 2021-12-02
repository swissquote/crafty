const path = require("path");
const { test } = require("uvu");
const assert = require("uvu/assert");

const resolvePath = require("../lib/path");

test("w/o options", async () => {
  const resolvedPath = await resolvePath("test/fixtures/duplicate-1.jpg");

  assert.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("basePath", async () => {
  const resolvedPath = await resolvePath("duplicate-1.jpg", {
    basePath: "test/fixtures",
  });
  assert.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("loadPaths", async () => {
  const resolvedPath = await resolvePath("picture.png", {
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });
  assert.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
});

test("loadPaths string", async () => {
  const resolvedPath = await resolvePath("picture.png", {
    loadPaths: "test/fixtures/images",
  });
  assert.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
});

test("loadPaths glob", async () => {
  const resolvedPath = await resolvePath("picture.png", {
    loadPaths: "test/fixtures/*",
  });
  assert.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
});

test("basePath + loadPaths", async () => {
  const resolvedPath = await resolvePath("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  assert.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
});

test("absolute needle + basePath", async () => {
  const absoluteTo = path.resolve("test/fixtures/duplicate-1.jpg");
  const resolvedPath = await resolvePath(absoluteTo, {
    basePath: "test/fixtures",
  });
  assert.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("absolute basePath + loadPaths", async () => {
  const resolvedPath = await resolvePath("picture.png", {
    basePath: path.resolve("test/fixtures"),
    loadPaths: [
      path.resolve("test/fixtures/fonts"),
      path.resolve("test/fixtures/images"),
    ],
  });
  assert.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
});

test("non-existing file", async () => {
  try {
    await resolvePath("non-existing.gif");
    assert.unreachable();
  } catch (err) {
    assert.instance(err, Error);
    assert.is(err.message, "Asset not found or unreadable: non-existing.gif");
  }
});

test("prioritize basePath over the loadPaths", async () => {
  const resolvedPath = await resolvePath("duplicate-1.jpg", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  assert.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("prioritize firsts loadPaths over the lasts", async () => {
  const resolvedPath = await resolvePath("duplicate-2.txt", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  assert.is(resolvedPath, path.resolve("test/fixtures/fonts/duplicate-2.txt"));
});

test("node-style callback w/ options", () => {
  return new Promise((resolve) => {
    resolvePath("test/fixtures/duplicate-1.jpg", (err, resolvedPath) => {
      assert.is(err, null);
      assert.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
      resolve();
    });
  });
});

test("node-style callback w/o options", () => {
  return new Promise((resolve) => {
    resolvePath(
      "duplicate-1.jpg",
      {
        basePath: "test/fixtures",
      },
      (err, resolvedPath) => {
        assert.is(err, null);
        assert.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
        resolve();
      }
    );
  });
});

test("node-style callback + non-existing file", () => {
  return new Promise((resolve) => {
    resolvePath("non-existing.gif", (err, resolvedPath) => {
      assert.instance(err, Error);
      assert.is(err.message, "Asset not found or unreadable: non-existing.gif");
      assert.is(resolvedPath, undefined);
      resolve();
    });
  });
});

test.run();
