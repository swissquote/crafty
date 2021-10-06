const path = require("path");
const browserslist = require("browserslist");

const defaultBrowsers = [
  "> 0.25%",
  "Edge >= 17",
  "Safari >= 11",
  "iOS >= 11",
  "Chrome >= 66",
  "and_chr >= 66",
  "Firefox >= 60",
  "IE >= 11",
  "not op_mini all"
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
