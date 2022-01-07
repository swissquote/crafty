const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const test = require("ava");

const resolveUrl = require("../lib/url");

test.before(() => {
  sinon.stub(fs, "statSync").returns({
    mtime: new Date(Date.UTC(1991, 7, 24)),
  });
});

test.after(() => {
  fs.statSync.restore();
});

test("w/o options", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg");

  t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg");
});

test("basePath", async t => {
  const resolvedUrl = await resolveUrl("duplicate-1.jpg", {
    basePath: "test/fixtures",
  });
  t.is(resolvedUrl, "/duplicate-1.jpg");
});

test("baseUrl", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    baseUrl: "http://example.com/wp-content/themes",
  });
  t.is(
    resolvedUrl,
    "http://example.com/wp-content/themes/test/fixtures/duplicate-1.jpg"
  );
});

test("loadPaths", async t => {
  const resolvedUrl = await resolveUrl("picture.png", {
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });
  t.is(resolvedUrl, "/test/fixtures/images/picture.png");
});

test("relativeTo", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/images/picture.png", {
    relativeTo: "test/fixtures/fonts",
  });
  t.is(resolvedUrl, "../images/picture.png");
});

test("basePath + baseUrl", async t => {
  const resolvedUrl = await resolveUrl("duplicate-1.jpg", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
  });
  t.is(
    resolvedUrl,
    "http://example.com/wp-content/themes/duplicate-1.jpg"
  );
});

test("basePath + loadPaths", async t => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });
  t.is(resolvedUrl, "/images/picture.png");
});

test("basePath + relativeTo", async t => {
  const resolvedUrl = await resolveUrl("images/picture.png", {
    basePath: "test/fixtures",
    relativeTo: "fonts",
  });
  t.is(resolvedUrl, "../images/picture.png");
});

test("baseUrl + loadPaths", async t => {
  const resolvedUrl = await resolveUrl("picture.png", {
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });
  t.is(
    resolvedUrl,
    "http://example.com/wp-content/themes/test/fixtures/images/picture.png"
  );
});

test("baseUrl + relativeTo", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/images/picture.png", {
    baseUrl: "http://example.com/wp-content/themes",
    relativeTo: "test/fixtures/fonts",
  });
  t.is(resolvedUrl, "../images/picture.png");
});

test("loadPaths + relativeTo", async t => {
  const resolvedUrl = await resolveUrl("picture.png", {
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
    relativeTo: "test/fixtures/fonts",
  });
  t.is(resolvedUrl, "../images/picture.png");
});

test("basePath + baseUrl + loadPaths", async t => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
  });
  t.is(
    resolvedUrl,
    "http://example.com/wp-content/themes/images/picture.png"
  );
});

test("basePath + baseUrl + relativeTo", async t => {
  const resolvedUrl = await resolveUrl("images/picture.png", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    relativeTo: "fonts",
  });
  t.is(resolvedUrl, "../images/picture.png");
});

test("basePath + loadPaths + relativeTo", async t => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
    relativeTo: "fonts",
  });
  t.is(resolvedUrl, "../images/picture.png");
});

test("baseUrl + loadPaths + relativeTo", async t => {
  const resolvedUrl = await resolveUrl("picture.png", {
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
    relativeTo: "test/fixtures/fonts",
  });
  t.is(resolvedUrl, "../images/picture.png");
});

test("basePath + baseUrl + loadPaths + relativeTo", async t => {
  const resolvedUrl = await resolveUrl("picture.png", {
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
    relativeTo: "fonts",
  });
  t.is(resolvedUrl, "../images/picture.png");
});

test("absolute basePath + relativeTo", async t => {
  const resolvedUrl = await resolveUrl("images/picture.png", {
    basePath: path.resolve("test/fixtures"),
    relativeTo: path.resolve("test/fixtures/fonts"),
  });
  t.is(resolvedUrl, "../images/picture.png");
});

test("non-existing file", async t => {
  try {
    await resolveUrl("non-existing.gif");
    t.unreachable();
  } catch (err) {
    t.truthy(err instanceof Error);
    t.is(err.message, "Asset not found or unreadable: non-existing.gif");
  }
});

test("baseUrl w/ trailing slash", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/images/picture.png", {
    baseUrl: "http://example.com/wp-content/themes/",
  });
  t.is(
    resolvedUrl,
    "http://example.com/wp-content/themes/test/fixtures/images/picture.png"
  );
});

test("default cachebuster", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster: true,
  });
  t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?9f057edc00");
});

test("custom cachebuster w/ falsy result", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {},
  });
  t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg");
});

test("custom cachebuster w/ string result", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return "bust";
    },
  });
  t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?bust");
});

test("custom cachebuster w/ number result", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return 42;
    },
  });
  t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?42");
});

test("custom cachebuster w/ pathname", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return { pathname: "/foo.png" };
    }, // TODO leading slash
  });
  t.is(resolvedUrl, "/foo.png");
});

test("custom cachebuster w/ query", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return { query: "bust" };
    },
  });
  t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?bust");
});

test("custom cachebuster w/ pathname + query", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/duplicate-1.jpg", {
    cachebuster() {
      return { pathname: "/foo.png", query: "bust" };
    }, // TODO leading slash
  });
  t.is(resolvedUrl, "/foo.png?bust");
});

test("custom cachebuster arguments", async t => {
  const cachebuster = sinon.spy();
  await resolveUrl("duplicate-1.jpg", {
    basePath: "test/fixtures",
    cachebuster,
  });

  t.is(cachebuster.calledOnce, true);
  t.is(cachebuster.lastCall.args.length, 2);
  t.is(
    cachebuster.lastCall.args[0],
    path.resolve("test/fixtures/duplicate-1.jpg")
  );
  t.is(cachebuster.lastCall.args[1], "/duplicate-1.jpg");
});

test("query + hash", async t => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  t.is(resolvedUrl, "/test/fixtures/images/picture.png?foo=bar&baz#hash");
});

test("query + hash w/ default cachebuster", async t => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster: true,
    }
  );
  t.is(
    resolvedUrl,
    "/test/fixtures/images/picture.png?foo=bar&baz&9f057edc00#hash"
  );
});

test("query + hash w/ custom cachebuster w/ falsy result", async t => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster() {},
    }
  );
  t.is(resolvedUrl, "/test/fixtures/images/picture.png?foo=bar&baz#hash");
});

test("query + hash w/ custom cachebuster w/ string result", async t => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster() {
        return "bust";
      },
    }
  );
  t.is(
    resolvedUrl,
    "/test/fixtures/images/picture.png?foo=bar&baz&bust#hash"
  );
});

test("query + hash w/ custom cachebuster w/ pathname", async t => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster() {
        return { pathname: "/foo.png" };
      }, // TODO leading slash
    }
  );
  t.is(resolvedUrl, "/foo.png?foo=bar&baz#hash");
});

test("query + hash w/ custom cachebuster w/ query", async t => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster() {
        return { query: "bust" };
      },
    }
  );
  t.is(
    resolvedUrl,
    "/test/fixtures/images/picture.png?foo=bar&baz&bust#hash"
  );
});

test("query + hash w/ custom cachebuster w/ pathname + query", async t => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      cachebuster() {
        return { pathname: "/foo.png", query: "bust" };
      }, // TODO leading slash
    }
  );
  t.is(resolvedUrl, "/foo.png?foo=bar&baz&bust#hash");
});

test("query + hash w/ relativeTo", async t => {
  const resolvedUrl = await resolveUrl(
    "test/fixtures/images/picture.png?foo=bar&baz#hash",
    {
      relativeTo: "test/fixtures/fonts",
    }
  );
  t.is(resolvedUrl, "../images/picture.png?foo=bar&baz#hash");
});

test("URI-encoded needle", async t => {
  const resolvedUrl = await resolveUrl("test/fixtures/white%20space.txt");
  t.is(resolvedUrl, "/test/fixtures/white%20space.txt");
});

test("node-style callback w/o options", (t) => {
  return new Promise((resolve) => {
    resolveUrl("test/fixtures/duplicate-1.jpg", (err, resolvedUrl) => {
      t.is(err, null);
      t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg");
      resolve();
    });
  });
});

test("node-style callback w/ options", (t) => {
  return new Promise((resolve) => {
    resolveUrl(
      "duplicate-1.jpg",
      {
        basePath: "test/fixtures",
      },
      (err, resolvedUrl) => {
        t.is(err, null);
        t.is(resolvedUrl, "/duplicate-1.jpg");
        resolve();
      }
    );
  });
});

test("node-style callback + non-existing file", (t) => {
  return new Promise((resolve, reject) => {
    resolveUrl("non-existing.gif", (err, resolvedUrl) => {
      t.truthy(err instanceof Error);
      t.is(err.message, "Asset not found or unreadable: non-existing.gif");
      t.is(resolvedUrl, undefined);

      resolve();
    });
  });
});
