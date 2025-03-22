const path = require("path");
const { test } = require("node:test");
const { expect } = require("expect");

const resolvePath = require("../lib/path");

test("w/o options", async () => {
  const resolvedPath = await resolvePath("test/fixtures/duplicate-1.jpg");

  expect(resolvedPath).toBe(path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("basePath", async () => {
  const resolvedPath = await resolvePath("duplicate-1.jpg", {
    basePath: "test/fixtures",
  });
  expect(resolvedPath).toBe(path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("loadPaths", async () => {
  const resolvedPath = await resolvePath("picture.png", {
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });
  expect(resolvedPath).toBe(path.resolve("test/fixtures/images/picture.png"));
});

test("loadPaths string", async () => {
  const resolvedPath = await resolvePath("picture.png", {
    loadPaths: "test/fixtures/images",
  });
  expect(resolvedPath).toBe(path.resolve("test/fixtures/images/picture.png"));
});

test("loadPaths glob", async () => {
  const resolvedPath = await resolvePath("picture.png", {
    loadPaths: "test/fixtures/*",
  });
  expect(resolvedPath).toBe(path.resolve("test/fixtures/images/picture.png"));
});

test("basePath + loadPaths", async () => {
  const resolvedPath = await resolvePath("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  expect(resolvedPath).toBe(path.resolve("test/fixtures/images/picture.png"));
});

test("absolute needle + basePath", async () => {
  const absoluteTo = path.resolve("test/fixtures/duplicate-1.jpg");
  const resolvedPath = await resolvePath(absoluteTo, {
    basePath: "test/fixtures",
  });
  expect(resolvedPath).toBe(path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("absolute basePath + loadPaths", async () => {
  const resolvedPath = await resolvePath("picture.png", {
    basePath: path.resolve("test/fixtures"),
    loadPaths: [
      path.resolve("test/fixtures/fonts"),
      path.resolve("test/fixtures/images"),
    ],
  });
  expect(resolvedPath).toBe(path.resolve("test/fixtures/images/picture.png"));
});

test("non-existing file", async () => {
  await expect(() => resolvePath("non-existing.gif")).rejects.toThrow(
    "Asset not found or unreadable: non-existing.gif"
  );
});

test("prioritize basePath over the loadPaths", async () => {
  const resolvedPath = await resolvePath("duplicate-1.jpg", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  expect(resolvedPath).toBe(path.resolve("test/fixtures/duplicate-1.jpg"));
});

test("prioritize firsts loadPaths over the lasts", async () => {
  const resolvedPath = await resolvePath("duplicate-2.txt", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  expect(resolvedPath).toBe(path.resolve("test/fixtures/fonts/duplicate-2.txt"));
});

test("node-style callback w/ options", (t, done) => {
  resolvePath("test/fixtures/duplicate-1.jpg", (err, resolvedPath) => {
    expect(err).toBeNull();
    expect(resolvedPath).toBe(path.resolve("test/fixtures/duplicate-1.jpg"));
    done();
  });
});

test("node-style callback w/o options", (t, done) => {
  resolvePath(
    "duplicate-1.jpg",
    {
      basePath: "test/fixtures",
    },
    (err, resolvedPath) => {
      expect(err).toBeNull();
      expect(resolvedPath).toBe(path.resolve("test/fixtures/duplicate-1.jpg"));
      done();
    }
  );
});

test("node-style callback + non-existing file", (t, done) => {
  resolvePath("non-existing.gif", (err, resolvedPath) => {
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("Asset not found or unreadable: non-existing.gif");
    expect(resolvedPath).toBeUndefined();
    done();
  });
});
