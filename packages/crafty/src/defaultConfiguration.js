const path = require("path");
const browserslist = require("browserslist");

const defaultBrowsers = [
  "> 0.25%",
  "Edge >= 15",
  "Safari >= 10",
  "iOS >= 10",
  "Chrome >= 56",
  "Firefox >= 51",
  "IE >= 11",
  "not op_mini all",
  "not Safari 5.1",
  "not kaios 2.5"
].join(", ");

function getDefaultBrowsers() {
  // There seems to be a bug with browserslist's data
  for (var name in browserslist.data) {
    if (browserslist.data.hasOwnProperty(name)) {
      browserslist.data[name].released.sort((a, b) => Number(a) - Number(b));
    }
  }

  const config = browserslist.loadConfig({ path: path.resolve(".") });
  return config ? config : defaultBrowsers;
}

module.exports = {
  // Add empty bundleTypes
  bundleTypes: {},
  // Autoprefixer
  browsers: getDefaultBrowsers()
};
