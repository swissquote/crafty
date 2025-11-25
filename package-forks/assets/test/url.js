const fs = require("fs");
const path = require("path");
const { test, mock } = require("node:test");
const { expect } = require("expect");

const resolveUrl = require("../lib/url");

let mockedStatSync = null;

test.before(() => {
  mockedStatSync = mock.method(fs, "statSync", () => {
    return {
      mtime: new Date(Date.UTC(1991, 7, 24)),
    }
  });
});

test.after(() => {
  mockedStatSync.mock.restore();
});

test("w/o options", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg");

  expect(resolvedUrl).toBe("/test/fixtures/duplicate-1.jpg");
});

test("basePath", async () => {
  const resolvedUrl = await resolveUrl("duplicate-1.jpg", {
    basePath: "test/fixtures",
  });
  expect(resolvedUrl).toBe("/duplicate-1.jpg");
});

test("baseUrl", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    baseUrl: "http://example.com/wp-content/themes",
  });
  expect(resolvedUrl).toBe(
    "http://example.com/wp-content/themes/test/fixtures/duplicate-1.jpg"
  );
});

test("loadPaths", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });
  expect(resolvedUrl).toBe("/test/fixtures/images/picture.png");
});

test("relativeTo", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/images/picture.png", {
    relativeTo: "test/fixtures/fonts",
  });
  expect(resolvedUrl).toBe("../images/picture.png");
});

test("basePath + baseUrl", async () => {
  const resolvedUrl = await resolveUrl("duplicate-1.jpg", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
  });
  expect(resolvedUrl).toBe(
    "http://example.com/wp-content/themes/duplicate-1.jpg"
  );
});

test("basePath + loadPaths", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  expect(resolvedUrl).toBe("/images/picture.png");
});

test("basePath + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("images/picture.png", {
    basePath: "test/fixtures",
    relativeTo: "fonts",
  });
  expect(resolvedUrl).toBe("../images/picture.png");
});

test("baseUrl + loadPaths", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });
  expect(resolvedUrl).toBe(
    "http://example.com/wp-content/themes/test/fixtures/images/picture.png"
  );
});

test("baseUrl + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/images/picture.png", {
    baseUrl: "http://example.com/wp-content/themes",
    relativeTo: "test/fixtures/fonts",
  });
  expect(resolvedUrl).toBe("../images/picture.png");
});

test("loadPaths + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
    relativeTo: "test/fixtures/fonts",
  });
  expect(resolvedUrl).toBe("../images/picture.png");
});

test("basePath + baseUrl + loadPaths", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
  });
  expect(resolvedUrl).toBe(
    "http://example.com/wp-content/themes/images/picture.png"
  );
});

test("basePath + baseUrl + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("images/picture.png", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    relativeTo: "fonts",
  });
  expect(resolvedUrl).toBe("../images/picture.png");
});

test("basePath + loadPaths + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
    relativeTo: "fonts",
  });
  expect(resolvedUrl).toBe("../images/picture.png");
});

test("baseUrl + loadPaths + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
    relativeTo: "test/fixtures/fonts",
  });
  expect(resolvedUrl).toBe("../images/picture.png");
});

test("basePath + baseUrl + loadPaths + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
    relativeTo: "fonts",
  });
  expect(resolvedUrl).toBe("../images/picture.png");
});

test("absolute basePath + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("images/picture.png", {
    basePath: path.resolve("test/fixtures"),
    relativeTo: path.resolve("test/fixtures/fonts"),
  });
  expect(resolvedUrl).toBe("../images/picture.png");
});

test("non-existing file", async () => {
  await expect(() => resolveUrl("non-existing.gif")).rejects.toThrow(
    "Asset not found or unreadable: non-existing.gif"
  );
});

test("baseUrl w/ trailing slash", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/images/picture.png", {
    baseUrl: "http://example.com/wp-content/themes/",
  });
  expect(resolvedUrl).toBe(
    "http://example.com/wp-content/themes/test/fixtures/images/picture.png"
  );
});

test("default cachebuster", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster: true,
  });
  expect(resolvedUrl).toBe("/test/fixtures/duplicate-1.jpg?9f057edc00");
});

test("custom cachebuster w/ falsy result", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {},
  });
  expect(resolvedUrl).toBe("/test/fixtures/duplicate-1.jpg");
});

test("custom cachebuster w/ string result", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return "bust";
    },
  });
  expect(resolvedUrl).toBe("/test/fixtures/duplicate-1.jpg?bust");
});

test("custom cachebuster w/ number result", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return 42;
    },
  });
  expect(resolvedUrl).toBe("/test/fixtures/duplicate-1.jpg?42");
});

test("custom cachebuster w/ pathname", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return { pathname: "/foo.png" };
    }, // TODO leading slash
  });
  expect(resolvedUrl).toBe("/foo.png");
});

test("custom cachebuster w/ query", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return { query: "bust" };
    },
  });
  expect(resolvedUrl).toBe("/test/fixtures/duplicate-1.jpg?bust");
});

test("custom cachebuster w/ pathname + query", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return { pathname: "/foo.png", query: "bust" };
    }, // TODO leading slash
  });
  expect(resolvedUrl).toBe("/foo.png?bust");
});

test("custom cachebuster arguments", async () => {
  const cachebuster = mock.fn();
  await resolveUrl("duplicate-1.jpg", {
    basePath: "test/fixtures",
    cachebuster,
  });

  expect(cachebuster.mock.callCount()).toBe(1);
  expect(cachebuster.mock.calls[0].arguments).toEqual([
    path.resolve("test/fixtures/duplicate-1.jpg"),
    "/duplicate-1.jpg"
  ]);
});

test("query + hash", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  expect(resolvedUrl).toBe(
    "/test/fixtures/images/picture.png?foo=bar&baz#hash"
  );
});

test("query + hash w/ default cachebuster", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster: true,
    }
  );
  expect(resolvedUrl).toBe(
    "/test/fixtures/images/picture.png?foo=bar&baz&9f057edc00#hash"
  );
});

test("query + hash w/ custom cachebuster w/ falsy result", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster() {},
    }
  );
  expect(resolvedUrl).toBe(
    "/test/fixtures/images/picture.png?foo=bar&baz#hash"
  );
});

test("query + hash w/ custom cachebuster w/ string result", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster() {
        return "bust";
      },
    }
  );
  expect(resolvedUrl).toBe(
    "/test/fixtures/images/picture.png?foo=bar&baz&bust#hash"
  );
});

test("query + hash w/ custom cachebuster w/ pathname", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster() {
        return { pathname: "/foo.png" };
      }, // TODO leading slash
    }
  );
  expect(resolvedUrl).toBe("/foo.png?foo=bar&baz#hash");
});

test("query + hash w/ custom cachebuster w/ query", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster() {
        return { query: "bust" };
      },
    }
  );
  expect(resolvedUrl).toBe(
    "/test/fixtures/images/picture.png?foo=bar&baz&bust#hash"
  );
});

test("query + hash w/ custom cachebuster w/ pathname + query", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster() {
        return { pathname: "/foo.png", query: "bust" };
      }, // TODO leading slash
    }
  );
  expect(resolvedUrl).toBe("/foo.png?foo=bar&baz&bust#hash");
});

test("query + hash w/ relativeTo", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      relativeTo: "test/fixtures/fonts",
    }
  );
  expect(resolvedUrl).toBe("../images/picture.png?foo=bar&baz#hash");
});

test("URI-encoded needle", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/white%20space.txt");
  expect(resolvedUrl).toBe("/test/fixtures/white%20space.txt");
});
