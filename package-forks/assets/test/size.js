const { test } = require("node:test");
const { expect } = require("expect");

const resolveSize = require("../lib/size");

test("w/o options", async () => {
  const size = await resolveSize("test/fixtures/duplicate-1.jpg");

  expect(size).toEqual({ width: 200, height: 114 });
});

test("basePath + loadPaths", async () => {
  const size = await resolveSize("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });

  expect(size).toEqual({ width: 200, height: 57 });
});

test("non-existing file", async () => {
  await expect(() => resolveSize("non-existing.gif"))
    .rejects.toThrow("Asset not found or unreadable: non-existing.gif");
});

test("nonsupported file type", async () => {
  await expect(() => resolveSize("test/fixtures/fonts/empty-sans.woff"))
    .rejects.toThrow(/Empty file: .+empty-sans\.woff/);
});

test("invalid file", async () => {
  await expect(() => resolveSize("test/fixtures/invalid.jpg"))
    .rejects.toThrow(/Invalid JPG, no size found: .+invalid\.jpg/);
});

test("node-style callback w/o options", (t, done) => {
  resolveSize("test/fixtures/duplicate-1.jpg", (err, size) => {
    expect(size).toEqual({ width: 200, height: 114 });
    done();
  });
});

test("node-style callback w/ options", (t, done) => {
  resolveSize(
    "picture.png",
    {
      basePath: "test/fixtures",
      loadPaths: ["fonts", "images"],
    },
    (err, size) => {
      expect(size).toEqual({ width: 200, height: 57 });
      done();
    }
  );
});

test("node-style callback + non-existing file", (t, done) => {

  resolveSize("non-existing.gif", (err, size) => {
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("Asset not found or unreadable: non-existing.gif");
    expect(size).toBeUndefined();
    done();
  });
});
