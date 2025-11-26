const { test } = require("node:test");
const { expect } = require("expect");

const resolveData = require("../lib/data");

test("w/o options", async () => {
  const resolvedDataUrl = await resolveData("test/fixtures/duplicate-1.jpg");
  expect(resolvedDataUrl.slice(0, 32)).toBe("data:image/jpeg;base64,/9j/4AAQS");
  expect(resolvedDataUrl.slice(-32)).toBe("GWbO3rSpUIsvhA1vsPh/WlSpVprP/9k=");
});

test("basePath + loadPaths", async () => {
  const resolvedDataUrl = await resolveData("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  expect(resolvedDataUrl.slice(0, 32)).toBe("data:image/png;base64,iVBORw0KGg");
  expect(resolvedDataUrl.slice(-32)).toBe("+BPCufaJraBKlQAAAABJRU5ErkJggg==");
});

test("discard query + preserve hash", async () => {
  const resolvedDataUrl = await resolveData(
    "test/fixtures/duplicate-1.jpg?foo=bar#hash"
  );
  expect(resolvedDataUrl.slice(0, 32)).toBe("data:image/jpeg;base64,/9j/4AAQS");
  expect(resolvedDataUrl.slice(-32)).toBe("rSpUIsvhA1vsPh/WlSpVprP/9k=#hash");
});

test("svg", async () => {
  const resolvedDataUrl = await resolveData("test/fixtures/images/vector.svg");
  expect(resolvedDataUrl.slice(0, 32)).toBe("data:image/svg+xml;charset=utf-8");
  expect(resolvedDataUrl.slice(-32)).toBe("-120h80z%22%2F%3E%0A%3C%2Fsvg%3E");
});

test("non-existing file", async () => {
  await expect(() => resolveData("non-existing.gif"))
    .rejects.toThrow("Asset not found or unreadable: non-existing.gif");
});
