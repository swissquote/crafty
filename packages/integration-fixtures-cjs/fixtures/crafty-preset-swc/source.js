(function(e, t) {
  if ("object" === typeof exports && "object" === typeof module)
    module.exports = t();
  else if ("function" === typeof define && define.amd) define([], t);
  else {
    var n = t();
    for (var r in n) ("object" === typeof exports ? exports : e)[r] = n[r];
  }
})(window, function() {
  return (function(e) {
    var t = {};
    function n(r) {
      if (t[r]) return t[r].exports;
      var o = (t[r] = { i: r, l: !1, exports: {} });
      return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
    }
    return (
      (n.m = e),
      (n.c = t),
      (n.d = function(e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
      }),
      (n.r = function(e) {
        "undefined" !== typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      (n.t = function(e, t) {
        if ((1 & t && (e = n(e)), 8 & t)) return e;
        if (4 & t && "object" === typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (
          (n.r(r),
          Object.defineProperty(r, "default", { enumerable: !0, value: e }),
          2 & t && "string" != typeof e)
        )
          for (var o in e)
            n.d(
              r,
              o,
              function(t) {
                return e[t];
              }.bind(null, o)
            );
        return r;
      }),
      (n.n = function(e) {
        var t =
          e && e.__esModule
            ? function() {
                return e.default;
              }
            : function() {
                return e;
              };
        return n.d(t, "a", t), t;
      }),
      (n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (n.p = ""),
      n((n.s = 0))
    );
  })([
    function(e, t, n) {
      e.exports = n(1);
    },
    function(e, t, n) {
      "use strict";
      function r(e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      }
      function o(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            "value" in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function u(e, t, n) {
        return t && o(e.prototype, t), n && o(e, n), e;
      }
      n.r(t);
      var i = (function() {
        function e() {
          r(this, e);
        }
        return (
          u(e, [
            {
              key: "someMethod",
              value: function() {
                alert("From class A");
              },
            },
          ]),
          e
        );
      })();
      (function() {
        function e() {
          r(this, e);
        }
        u(e, [
          {
            key: "someMethod",
            value: function() {
              alert("From class B");
            },
          },
        ]);
      })();
      new i().someMethod();
    },
  ]);
});
