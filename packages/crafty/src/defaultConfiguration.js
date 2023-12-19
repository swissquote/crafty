const path = require("path");
const browserslist = require("@swissquote/crafty-commons/packages/browserslist");

const hasOwnProperty = Object.prototype.hasOwnProperty;

const defaultBrowsers = [
  "Edge >= 96",
  "Safari >= 15",
  "iOS >= 15",
  "Chrome >= 96",
  "and_chr >= 96",
  "Firefox >= 94",
  "> 1%",
  "not dead",
  "not op_mini all"
].join(", ");

function getDefaultBrowsers() {
  // There seems to be a bug with browserslist's data
  for (var name in browserslist.data) {
    if (hasOwnProperty.call(browserslist.data, name)) {
      browserslist.data[name].released.sort((a, b) => Number(a) - Number(b));
    }
  }

  const config = browserslist.loadConfig({ path: path.resolve(".") });
  return config ? config : defaultBrowsers;
}

module.exports = {
  // Add empty bundleTypes
  bundleTypes: {},
  // Define the supported browsers so that tools needing them can be consistent
  browsers: getDefaultBrowsers()
};
