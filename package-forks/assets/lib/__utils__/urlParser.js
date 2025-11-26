const { URL, URLSearchParams } = require("node:url");

module.exports = function parse(rawUrl) {
  if (rawUrl.startsWith("http")) {
    return new URL(rawUrl);
  }

  // `url.parse()` used to work for files without a protocol
  // This is a replacement for it that is very simplistic but should suffice for our use case
  if (rawUrl.includes("?") || rawUrl.includes("#")) {
    const [baseUrl, hash] = rawUrl.split("#");
    const [pathname, searchParams] = baseUrl.split("?");

    return {
      pathname,
      searchParams: new URLSearchParams(searchParams),
      hash: hash ? `#${hash}` : null
    };
  }

  return {
    pathname: rawUrl,
    searchParams: new URLSearchParams()
  };
};
