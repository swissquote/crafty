/* global window */

if (typeof Promise === "undefined") {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require("promise/lib/rejection-tracking").enable();
  window.Promise = require("promise/lib/es6-extensions");
}

// Array polyfills
if (!Array.from) {
  require("./polyfill.array.from");
}

// Core-js Polyfills
require("core-js/modules/es6.symbol");
require("core-js/modules/es6.array.iterator");
//require('core-js/modules/es6.array.from'); // We use a separate one, much smaller

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require("object-assign");
