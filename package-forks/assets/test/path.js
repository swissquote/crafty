const path = require("path");
const test = require("ava");

const resolvePath = require("../lib/path");

test("w/o options", async t => {
  const resolvedPath = await resolvePath("test/fixtures/duplicate-1.jpg");

  t.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("basePath", async t => {
  const resolvedPath = await resolvePath("duplicate-1.jpg", {
    basePath: "test/fixtures",
  });
  t.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("loadPaths", async t => {
  const resolvedPath = await resolvePath("picture.png", {
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });
  t.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
});

test("loadPaths string", async t => {
  const resolvedPath = await resolvePath("picture.png", {
    loadPaths: "test/fixtures/images",
  });
  t.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
});

test("loadPaths glob", async t => {
  const resolvedPath = await resolvePath("picture.png", {
    loadPaths: "test/fixtures/*",
  });
  t.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
});

test("basePath + loadPaths", async t => {
  const resolvedPath = await resolvePath("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  t.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
});

test("absolute needle + basePath", async t => {
  const absoluteTo = path.resolve("test/fixtures/duplicate-1.jpg");
  const resolvedPath = await resolvePath(absoluteTo, {
    basePath: "test/fixtures",
  });
  t.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("absolute basePath + loadPaths", async t => {
  const resolvedPath = await resolvePath("picture.png", {
    basePath: path.resolve("test/fixtures"),
    loadPaths: [
      path.resolve("test/fixtures/fonts"),
      path.resolve("test/fixtures/images"),
    ],
  });
  t.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
});

test("non-existing file", async t => {
  try {
    await resolvePath("non-existing.gif");
    t.unreachable();
  } catch (err) {
    t.truthy(err instanceof Error);
    t.is(err.message, "Asset not found or unreadable: non-existing.gif");
  }
});

test("prioritize basePath over the loadPaths", async t => {
  const resolvedPath = await resolvePath("duplicate-1.jpg", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  t.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("prioritize firsts loadPaths over the lasts", async t => {
  const resolvedPath = await resolvePath("duplicate-2.txt", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  t.is(resolvedPath, path.resolve("test/fixtures/fonts/duplicate-2.txt"));
});

test("node-style callback w/ options", (t) => {
  return new Promise((resolve) => {
    resolvePath("test/fixtures/duplicate-1.jpg", (err, resolvedPath) => {
      t.is(err, null);
      t.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
      resolve();
    });
  });
});

test("node-style callback w/o options", (t) => {
  return new Promise((resolve) => {
    resolvePath(
      "duplicate-1.jpg",
      {
        basePath: "test/fixtures",
      },
      (err, resolvedPath) => {
        t.is(err, null);
        t.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
        resolve();
      }
    );
  });
});

test("node-style callback + non-existing file", (t) => {
  return new Promise((resolve) => {
    resolvePath("non-existing.gif", (err, resolvedPath) => {
      t.truthy(err instanceof Error);
      t.is(err.message, "Asset not found or unreadable: non-existing.gif");
      t.is(resolvedPath, undefined);
      resolve();
    });
  });
});
