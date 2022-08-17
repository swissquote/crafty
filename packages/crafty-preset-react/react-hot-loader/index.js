"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./production.js");
} else if (process.env.NODE_ENV === "test") {
  module.exports = require("./production.js");
} else if (typeof window === "undefined") {
  // this is just server environment
  module.exports = require("./production.js");
} else if (!module.hot) {
  module.exports = require("./production.js");
} else {
  console.warn("You seem to import 'react-hot-loader' in your application, but are using react-fast-refresh. You don't need these imports anymore.");

  module.exports = require("./production.js");
}
