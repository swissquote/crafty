const path = require("path");
const browserslist = require("browserslist");

const defaultBrowsers = [
  "> 0.25%",
  "Firefox ESR",
  "Edge >= 13",
  "Safari >= 7.1",
  "iOS >= 7.1",
  "Chrome >= 32",
  "Firefox >= 24",
  "Opera >= 24",
  "IE >= 9"
].join(", ");

function getDefaultBrowsers() {
  const config = browserslist.loadConfig({ path: path.resolve(".") });
  return config ? config : defaultBrowsers;
}

module.exports = {
  // Add empty bundleTypes
  bundleTypes: {},
  // Autoprefixer
  browsers: getDefaultBrowsers()
};
