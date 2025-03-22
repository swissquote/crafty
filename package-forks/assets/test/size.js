const path = require("path");
const { test } = require("node:test");
const { expect } = require("expect");

const resolveSize = require("../lib/size");

test("w/o options", async (t) => {
  const size = await resolveSize("test/fixtures/duplicate-1.jpg");

  expect(size).toEqual({ width: 200, height: 114 });
});

test("basePath + loadPaths", async (t) => {
  const size = await resolveSize("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });

  expect(size).toEqual({ width: 200, height: 57 });
});

test("non-existing file", async (t) => {
  try {
    await resolveSize("non-existing.gif");
    t.fail();
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("Asset not found or unreadable: non-existing.gif");
  }
});

test("nonsupported file type", async (t) => {
  try {
    await resolveSize("test/fixtures/fonts/empty-sans.woff");
    t.fail();
  } catch (err) {
    const absolutePath = path.resolve("test/fixtures/fonts/empty-sans.woff");
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe(`Empty file: ${absolutePath}`);
  }
});

test("invalid file", async (t) => {
  try {
    await resolveSize("test/fixtures/invalid.jpg");
    t.fail();
  } catch (err) {
    const absolutePath = path.resolve("test/fixtures/invalid.jpg");
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe(`Invalid JPG, no size found: ${absolutePath}`);
  }
});

test("node-style callback w/o options", (t) => {
  return new Promise((resolve) => {
    resolveSize("test/fixtures/duplicate-1.jpg", (err, size) => {
      expect(size).toEqual({ width: 200, height: 114 });
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
        expect(size).toEqual({ width: 200, height: 57 });
        resolve();
      }
    );
  });
});

test("node-style callback + non-existing file", (t) => {
  return new Promise((resolve) => {
    resolveSize("non-existing.gif", (err, size) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Asset not found or unreadable: non-existing.gif");
      expect(size).toBeUndefined();
      resolve();
    });
  });
});
