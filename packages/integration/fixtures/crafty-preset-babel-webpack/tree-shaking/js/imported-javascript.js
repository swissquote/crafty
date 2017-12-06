/* eslint-disable */
// This file comes from a Rollup output

var classCallCheck = function (e, n) {
        if (!(e instanceof n))
            throw new TypeError("Cannot call a class as a function");
    },
    createClass = (function () {
        function e(e, n) {
            for (var t = 0; t < n.length; t++) {
                var r = n[t];
                (r.enumerable = r.enumerable || !1),
                    (r.configurable = !0),
                    "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r);
            }
        }
        return function (n, t, r) {
            return t && e(n.prototype, t), r && e(n, r), n;
        };
    })(),
    A = 
    /*#__PURE__*/
    (function () {
        function e() {
            classCallCheck(this, e), console.log("Something happens here");
        }
        return (
            createClass(e, [
                {
                    key: "someMethod",
                    value: function () {
                        alert("From class A");
                    }
                }
            ]),
            e
        );
    })(),
    B = 
    /*#__PURE__*/
    (function () {
        function e() {
            classCallCheck(this, e), console.log("Something else happens here");
        }
        return (
            createClass(e, [
                {
                    key: "someMethod",
                    value: function () {
                        alert("From class B");
                    }
                }
            ]),
            e
        );
    })();
export { A, B };
