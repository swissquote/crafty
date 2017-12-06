/* global __webpack_require__, __resourceQuery */

// When requiring a hot reload, webpack will use "__webpack_require__.p" as the base url.
// but this variable corresponds to the url of the current package.
// This file is here to "patch" this url to be able to request hot reloaded modules from
// the middleware directly
__webpack_require__.p = `${__resourceQuery.substr(1)}/`;
