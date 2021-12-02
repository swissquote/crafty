const { test } = require("uvu");
const assert = require("uvu/assert");

const resolveData = require("../lib/data");

test("w/o options", async () => {
  const resolvedDataUrl = await resolveData("test/fixtures/duplicate-1.jpg");
  assert.is(resolvedDataUrl.slice(0, 32), "data:image/jpeg;base64,/9j/4AAQS");
  assert.is(resolvedDataUrl.slice(-32), "GWbO3rSpUIsvhA1vsPh/WlSpVprP/9k=");
});

test("basePath + loadPaths", async () => {
  const resolvedDataUrl = await resolveData("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  assert.is(resolvedDataUrl.slice(0, 32), "data:image/png;base64,iVBORw0KGg");
  assert.is(resolvedDataUrl.slice(-32), "+BPCufaJraBKlQAAAABJRU5ErkJggg==");
});

test("discard query + preserve hash", async () => {
  const resolvedDataUrl = await resolveData(
    "test/fixtures/duplicate-1.jpg?foo=bar#hash"
  );
  assert.is(resolvedDataUrl.slice(0, 32), "data:image/jpeg;base64,/9j/4AAQS");
  assert.is(resolvedDataUrl.slice(-32), "rSpUIsvhA1vsPh/WlSpVprP/9k=#hash");
});

test("svg", async () => {
  const resolvedDataUrl = await resolveData("test/fixtures/images/vector.svg");
  assert.is(resolvedDataUrl.slice(0, 32), "data:image/svg+xml;charset=utf-8");
  assert.is(resolvedDataUrl.slice(-32), "0h80z%22%2F%3E%0D%0A%3C%2Fsvg%3E");
});

test("non-existing file", async () => {
  try {
    await resolveData("non-existing.gif");
    assert.unreachable();
  } catch (err) {
    assert.instance(err, Error);
    assert.is(err.message, "Asset not found or unreadable: non-existing.gif");
  }
});

test("node-style callback w/o options", () => {
  return new Promise((resolve) => {
    resolveData("test/fixtures/duplicate-1.jpg", (err, resolvedDataUrl) => {
      assert.is(err, null);
      assert.equal(
        resolvedDataUrl.slice(0, 32),
        "data:image/jpeg;base64,/9j/4AAQS"
      );
      resolve();
    });
  });
});

test("node-style callback w/ options", () => {
  return new Promise((resolve) => {
    resolveData(
      "picture.png",
      {
        basePath: "test/fixtures",
        loadPaths: ["fonts", "images"],
      },
      (err, resolvedDataUrl) => {
        assert.is(err, null);
        assert.is(
          resolvedDataUrl.slice(0, 32),
          "data:image/png;base64,iVBORw0KGg"
        );
        resolve();
      }
    );
  });
});

test("node-style callback + non-existing file", () => {
  return new Promise((resolve) => {
    resolveData("non-existing.gif", (err, resolvedDataUrl) => {
      assert.instance(err, Error);
      assert.is(err.message, "Asset not found or unreadable: non-existing.gif");
      assert.is(resolvedDataUrl, undefined);
      resolve();
    });
  });
});

test.run();
