const test = require("ava");

const resolveData = require("../lib/data");

test("w/o options", async t => {
  const resolvedDataUrl = await resolveData("test/fixtures/duplicate-1.jpg");
  t.is(resolvedDataUrl.slice(0, 32), "data:image/jpeg;base64,/9j/4AAQS");
  t.is(resolvedDataUrl.slice(-32), "GWbO3rSpUIsvhA1vsPh/WlSpVprP/9k=");
});

test("basePath + loadPaths", async t => {
  const resolvedDataUrl = await resolveData("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  t.is(resolvedDataUrl.slice(0, 32), "data:image/png;base64,iVBORw0KGg");
  t.is(resolvedDataUrl.slice(-32), "+BPCufaJraBKlQAAAABJRU5ErkJggg==");
});

test("discard query + preserve hash", async t => {
  const resolvedDataUrl = await resolveData(
    "test/fixtures/duplicate-1.jpg?foo=bar#hash"
  );
  t.is(resolvedDataUrl.slice(0, 32), "data:image/jpeg;base64,/9j/4AAQS");
  t.is(resolvedDataUrl.slice(-32), "rSpUIsvhA1vsPh/WlSpVprP/9k=#hash");
});

test("svg", async t => {
  const resolvedDataUrl = await resolveData("test/fixtures/images/vector.svg");
  t.is(resolvedDataUrl.slice(0, 32), "data:image/svg+xml;charset=utf-8");
  t.is(resolvedDataUrl.slice(-32), "-120h80z%22%2F%3E%0A%3C%2Fsvg%3E");
});

test("non-existing file", async t => {
  try {
    await resolveData("non-existing.gif");
    t.unreachable();
  } catch (err) {
    t.truthy(err instanceof Error);
    t.is(err.message, "Asset not found or unreadable: non-existing.gif");
  }
});

test("node-style callback w/o options", (t) => {
  return new Promise((resolve) => {
    resolveData("test/fixtures/duplicate-1.jpg", (err, resolvedDataUrl) => {
      t.is(err, null);
      t.deepEqual(
        resolvedDataUrl.slice(0, 32),
        "data:image/jpeg;base64,/9j/4AAQS"
      );
      resolve();
    });
  });
});

test("node-style callback w/ options", (t) => {
  return new Promise((resolve) => {
    resolveData(
      "picture.png",
      {
        basePath: "test/fixtures",
        loadPaths: ["fonts", "images"],
      },
      (err, resolvedDataUrl) => {
        t.is(err, null);
        t.is(
          resolvedDataUrl.slice(0, 32),
          "data:image/png;base64,iVBORw0KGg"
        );
        resolve();
      }
    );
  });
});

test("node-style callback + non-existing file", (t) => {
  return new Promise((resolve) => {
    resolveData("non-existing.gif", (err, resolvedDataUrl) => {
      t.truthy(err instanceof Error);
      t.is(err.message, "Asset not found or unreadable: non-existing.gif");
      t.is(resolvedDataUrl, undefined);
      resolve();
    });
  });
});
