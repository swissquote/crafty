/* eslint-disable */
// This file comes from a Rollup output

var C = /** @class */ (function () {
  function e() {
    console.log("Something happens here");
  }
  return (
    (e.prototype.someMethod = function () {
      alert("From class C");
    }),
    e
  );
})();

var D = /** @class */ (function () {
  function e() {
    console.log("Something else happens here");
  }
  return (
    (e.prototype.someMethod = function () {
      alert("From class D");
    }),
    e
  );
})();

export { C, D };