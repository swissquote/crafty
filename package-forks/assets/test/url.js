const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const { test } = require("uvu");
const assert = require("uvu/assert");

const resolveUrl = require("../lib/url");

test.before(() => {
  sinon.stub(fs, "statSync").returns({
    mtime: new Date(Date.UTC(1991, 7, 24)),
  });
});

test.after(() => {
  fs.statSync.restore();
});

test("w/o options", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg");

  assert.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg");
});

test("basePath", async () => {
  const resolvedUrl = await resolveUrl("duplicate-1.jpg", {
    basePath: "test/fixtures",
  });
  assert.is(resolvedUrl, "/duplicate-1.jpg");
});

test("baseUrl", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    baseUrl: "http://example.com/wp-content/themes",
  });
  assert.is(
    resolvedUrl,
    "http://example.com/wp-content/themes/test/fixtures/duplicate-1.jpg"
  );
});

test("loadPaths", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });
  assert.is(resolvedUrl, "/test/fixtures/images/picture.png");
});

test("relativeTo", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/images/picture.png", {
    relativeTo: "test/fixtures/fonts",
  });
  assert.is(resolvedUrl, "../images/picture.png");
});

test("basePath + baseUrl", async () => {
  const resolvedUrl = await resolveUrl("duplicate-1.jpg", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
  });
  assert.is(
    resolvedUrl,
    "http://example.com/wp-content/themes/duplicate-1.jpg"
  );
});

test("basePath + loadPaths", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  assert.is(resolvedUrl, "/images/picture.png");
});

test("basePath + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("images/picture.png", {
    basePath: "test/fixtures",
    relativeTo: "fonts",
  });
  assert.is(resolvedUrl, "../images/picture.png");
});

test("baseUrl + loadPaths", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });
  assert.is(
    resolvedUrl,
    "http://example.com/wp-content/themes/test/fixtures/images/picture.png"
  );
});

test("baseUrl + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/images/picture.png", {
    baseUrl: "http://example.com/wp-content/themes",
    relativeTo: "test/fixtures/fonts",
  });
  assert.is(resolvedUrl, "../images/picture.png");
});

test("loadPaths + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
    relativeTo: "test/fixtures/fonts",
  });
  assert.is(resolvedUrl, "../images/picture.png");
});

test("basePath + baseUrl + loadPaths", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
  });
  assert.is(
    resolvedUrl,
    "http://example.com/wp-content/themes/images/picture.png"
  );
});

test("basePath + baseUrl + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("images/picture.png", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    relativeTo: "fonts",
  });
  assert.is(resolvedUrl, "../images/picture.png");
});

test("basePath + loadPaths + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
    relativeTo: "fonts",
  });
  assert.is(resolvedUrl, "../images/picture.png");
});

test("baseUrl + loadPaths + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
    relativeTo: "test/fixtures/fonts",
  });
  assert.is(resolvedUrl, "../images/picture.png");
});

test("basePath + baseUrl + loadPaths + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
    relativeTo: "fonts",
  });
  assert.is(resolvedUrl, "../images/picture.png");
});

test("absolute basePath + relativeTo", async () => {
  const resolvedUrl = await resolveUrl("images/picture.png", {
    basePath: path.resolve("test/fixtures"),
    relativeTo: path.resolve("test/fixtures/fonts"),
  });
  assert.is(resolvedUrl, "../images/picture.png");
});

test("non-existing file", async () => {
  try {
    await resolveUrl("non-existing.gif");
    assert.unreachable();
  } catch (err) {
    assert.instance(err, Error);
    assert.is(err.message, "Asset not found or unreadable: non-existing.gif");
  }
});

test("baseUrl w/ trailing slash", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/images/picture.png", {
    baseUrl: "http://example.com/wp-content/themes/",
  });
  assert.is(
    resolvedUrl,
    "http://example.com/wp-content/themes/test/fixtures/images/picture.png"
  );
});

test("default cachebuster", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster: true,
  });
  assert.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?9f057edc00");
});

test("custom cachebuster w/ falsy result", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {},
  });
  assert.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg");
});

test("custom cachebuster w/ string result", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return "bust";
    },
  });
  assert.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?bust");
});

test("custom cachebuster w/ number result", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return 42;
    },
  });
  assert.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?42");
});

test("custom cachebuster w/ pathname", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return { pathname: "/foo.png" };
    }, // TODO leading slash
  });
  assert.is(resolvedUrl, "/foo.png");
});

test("custom cachebuster w/ query", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return { query: "bust" };
    },
  });
  assert.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?bust");
});

test("custom cachebuster w/ pathname + query", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return { pathname: "/foo.png", query: "bust" };
    }, // TODO leading slash
  });
  assert.is(resolvedUrl, "/foo.png?bust");
});

test("custom cachebuster arguments", async () => {
  const cachebuster = sinon.spy();
  await resolveUrl("duplicate-1.jpg", {
    basePath: "test/fixtures",
    cachebuster,
  });

  assert.is(cachebuster.calledOnce, true);
  assert.is(cachebuster.lastCall.args.length, 2);
  assert.is(
    cachebuster.lastCall.args[0],
    path.resolve("test/fixtures/duplicate-1.jpg")
  );
  assert.is(cachebuster.lastCall.args[1], "/duplicate-1.jpg");
});

test("query + hash", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  assert.is(resolvedUrl, "/test/fixtures/images/picture.png?foo=bar&baz#hash");
});

test("query + hash w/ default cachebuster", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster: true,
    }
  );
  assert.is(
    resolvedUrl,
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
  assert.is(resolvedUrl, "/test/fixtures/images/picture.png?foo=bar&baz#hash");
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
  assert.is(
    resolvedUrl,
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
  assert.is(resolvedUrl, "/foo.png?foo=bar&baz#hash");
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
  assert.is(
    resolvedUrl,
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
  assert.is(resolvedUrl, "/foo.png?foo=bar&baz&bust#hash");
});

test("query + hash w/ relativeTo", async () => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      relativeTo: "test/fixtures/fonts",
    }
  );
  assert.is(resolvedUrl, "../images/picture.png?foo=bar&baz#hash");
});

test("URI-encoded needle", async () => {
  const resolvedUrl = await resolveUrl("test/fixtures/white%20space.txt");
  assert.is(resolvedUrl, "/test/fixtures/white%20space.txt");
});

test("node-style callback w/o options", () => {
  return new Promise((resolve) => {
    resolveUrl("test/fixtures/duplicate-1.jpg", (err, resolvedUrl) => {
      assert.is(err, null);
      assert.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg");
      resolve();
    });
  });
});

test("node-style callback w/ options", () => {
  return new Promise((resolve) => {
    resolveUrl(
      "duplicate-1.jpg",
      {
        basePath: "test/fixtures",
      },
      (err, resolvedUrl) => {
        assert.is(err, null);
        assert.is(resolvedUrl, "/duplicate-1.jpg");
        resolve();
      }
    );
  });
});

test("node-style callback + non-existing file", () => {
  return new Promise((resolve, reject) => {
    resolveUrl("non-existing.gif", (err, resolvedUrl) => {
      assert.instance(err, Error);
      assert.is(err.message, "Asset not found or unreadable: non-existing.gif");
      assert.is(resolvedUrl, undefined);

      resolve();
    });
  });
});

test.run();
