# Snapshot report for `__tests__/crafty-preset-lightningcss-webpack.js`

The actual snapshot is saved in `crafty-preset-lightningcss-webpack.js.snap`.

Generated by [AVA](https://avajs.dev).

## Compiles CSS within webpack

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-lightningcss-webpack/compiles/dist/css␊
                 js: __PATH__/packages/integration/fixtures/crafty-preset-lightningcss-webpack/compiles/dist/js␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'js' ...␊
      [__:__:__] Starting 'js_myBundle' ...␊
      asset myBundle.min.js ___ KiB [emitted] [minimized] (name: default)␊
        sourceMap myBundle.min.js.map ___ KiB [emitted] [dev] (auxiliary name: default)␊
      Entrypoint default ___ KiB (___ KiB) = myBundle.min.js 1 auxiliary asset␊
      chunk (runtime: default) myBundle.min.js (default) ___ KiB (javascript) ___ KiB (runtime) [entry] [rendered]␊
        dependent modules ___ KiB [dependent] 10 modules␊
        runtime modules ___ KiB 5 modules␊
        ./js/app.js + 1 modules ___ KiB [built] [code generated]␊
      ␊
        Compiled successfully!␊
        Δt ____ms␊
      ␊
      [__:__:__] Finished 'js_myBundle' after ____ ms␊
      [__:__:__] Finished 'js' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }

> Snapshot 2

    `!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var t=n();for(var r in t)("object"==typeof exports?exports:e)[r]=t[r]}}(self,function(){return function(){"use strict";var e={659:function(e){e.exports=function(e){var n=[];return n.toString=function(){return this.map(function(n){var t="",r=void 0!==n[5];return n[4]&&(t+="@supports (".concat(n[4],") {")),n[2]&&(t+="@media ".concat(n[2]," {")),r&&(t+="@layer".concat(n[5].length>0?" ".concat(n[5]):""," {")),t+=e(n),r&&(t+="}"),n[2]&&(t+="}"),n[4]&&(t+="}"),t}).join("")},n.i=function(e,t,r,o,a){"string"==typeof e&&(e=[[null,e,void 0]]);var i={};if(r)for(var c=0;c<this.length;c++){var u=this[c][0];null!=u&&(i[u]=!0)}for(var s=0;s<e.length;s++){var f=[].concat(e[s]);r&&i[f[0]]||(void 0!==a&&(void 0===f[5]||(f[1]="@layer".concat(f[5].length>0?" ".concat(f[5]):""," {").concat(f[1],"}")),f[5]=a),t&&(f[2]&&(f[1]="@media ".concat(f[2]," {").concat(f[1],"}")),f[2]=t),o&&(f[4]?(f[1]="@supports (".concat(f[4],") {").concat(f[1],"}"),f[4]=o):f[4]="".concat(o)),n.push(f))}},n}},986:function(e){e.exports=function(e){return e[1]}},184:function(e){var n=[];function t(e){for(var t=-1,r=0;r<n.length;r++)if(n[r].identifier===e){t=r;break}return t}function r(e,r){for(var o={},a=[],i=0;i<e.length;i++){var c=e[i],u=r.base?c[0]+r.base:c[0],s=o[u]||0,f="".concat(u," ").concat(s);o[u]=s+1;var l=t(f),d={css:c[1],media:c[2],sourceMap:c[3],supports:c[4],layer:c[5]};if(-1!==l)n[l].references++,n[l].updater(d);else{var p=function(e,n){var t=n.domAPI(n);return t.update(e),function(n){n?(n.css!==e.css||n.media!==e.media||n.sourceMap!==e.sourceMap||n.supports!==e.supports||n.layer!==e.layer)&&t.update(e=n):t.remove()}}(d,r);r.byIndex=i,n.splice(i,0,{identifier:f,updater:p,references:1})}a.push(f)}return a}e.exports=function(e,o){var a=r(e=e||[],o=o||{});return function(e){e=e||[];for(var i=0;i<a.length;i++){var c=t(a[i]);n[c].references--}for(var u=r(e,o),s=0;s<a.length;s++){var f=t(a[s]);0===n[f].references&&(n[f].updater(),n.splice(f,1))}a=u}}},219:function(e){var n={};e.exports=function(e,t){var r=function(e){if(void 0===n[e]){var t=document.querySelector(e);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}n[e]=t}return n[e]}(e);if(!r)throw Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(t)}},332:function(e){e.exports=function(e){var n=document.createElement("style");return e.setAttributes(n,e.attributes),e.insert(n,e.options),n}},416:function(e,n,t){e.exports=function(e){var n=t.nc;n&&e.setAttribute("nonce",n)}},113:function(e){e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var n=e.insertStyleElement(e);return{update:function(t){var r,o,a;r="",t.supports&&(r+="@supports (".concat(t.supports,") {")),t.media&&(r+="@media ".concat(t.media," {")),(o=void 0!==t.layer)&&(r+="@layer".concat(t.layer.length>0?" ".concat(t.layer):""," {")),r+=t.css,o&&(r+="}"),t.media&&(r+="}"),t.supports&&(r+="}"),(a=t.sourceMap)&&"undefined"!=typeof btoa&&(r+="\\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),e.styleTagTransform(r,n,e.options)},remove:function(){var e;null!==(e=n).parentNode&&e.parentNode.removeChild(e)}}}},401:function(e){e.exports=function(e,n){if(n.styleSheet)n.styleSheet.cssText=e;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(e))}}},599:function(e,n,t){var r=t(986),o=/*#__PURE__*/t.n(r),a=t(659),i=/*#__PURE__*/t.n(a)()(o());i.push([e.id,"a {\\n  color: #00f;\\n}\\n",""]),n.A=i},916:function(e,n,t){var r=t(986),o=/*#__PURE__*/t.n(r),a=t(659),i=/*#__PURE__*/t.n(a),c=t(599),u=i()(o());u.i(c.A),u.push([e.id,".Parent {\\n  background: #fff;\\n}\\n\\n.Parent--before {\\n  color: #333;\\n}\\n\\n.Parent .Child {\\n  background: #000;\\n}\\n\\n.Parent--after {\\n  color: #eee;\\n}\\n\\n:root {\\n  --color: red;\\n}\\n\\n.MenuLink {\\n  color: var(--color);\\n}\\n",""]),n.A=u}},n={};function t(r){var o=n[r];if(void 0!==o)return o.exports;var a=n[r]={id:r,exports:{}};return e[r](a,a.exports,t),a.exports}t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,{a:n}),n},t.d=function(e,n){for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.nc=void 0;var r={};t.r(r),t.d(r,{default:function(){return b}});var o=t(184),a=/*#__PURE__*/t.n(o),i=t(113),c=/*#__PURE__*/t.n(i),u=t(219),s=/*#__PURE__*/t.n(u),f=t(416),l=/*#__PURE__*/t.n(f),d=t(332),p=/*#__PURE__*/t.n(d),v=t(401),m=/*#__PURE__*/t.n(v),y=t(916),h={};h.styleTagTransform=m(),h.setAttributes=l(),h.insert=s().bind(null,"head"),h.domAPI=c(),h.insertStyleElement=p(),a()(y.A,h),y.A&&y.A.locals&&y.A.locals;class b{}return r}()});␊
    //# sourceMappingURL=myBundle.min.js.map`

## Fails gracefully on broken markup

> Snapshot 1

    {
      status: 1,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-lightningcss-webpack/fails/dist/css␊
                 js: __PATH__/packages/integration/fixtures/crafty-preset-lightningcss-webpack/fails/dist/js␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'js' ...␊
      [__:__:__] Starting 'js_myBundle' ...␊
      assets by status ___ KiB [cached] 1 asset␊
      Entrypoint default = myBundle.min.js 1 auxiliary asset␊
      chunk (runtime: default) myBundle.min.js (default) ___ KiB (javascript) ___ KiB (runtime) [entry] [rendered]␊
        dependent modules ___ KiB [dependent] 7 modules␊
        runtime modules ___ KiB 5 modules␊
        ./js/app.js + 1 modules ___ KiB [built] [code generated]␊
      ␊
        Failed to compile.␊
      ␊
      SyntaxError: Unexpected end of input␊
          ...stacktrace...␊
      ␊
        Δt ____ms ✖ 1 problem (1 error, 0 warnings)␊
      ␊
      [__:__:__] 'js_myBundle' errored after ____ ms␊
      [__:__:__] Webpack compilation failed␊
      [__:__:__] 'js' errored after ____ ms␊
      [__:__:__] 'default' errored after ____ ms␊
      `,
    }

## Compiles CSS within webpack, extracts CSS ('extractCSS' boolean option)

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-lightningcss-webpack/extract-boolean/dist/css␊
                 js: __PATH__/packages/integration/fixtures/crafty-preset-lightningcss-webpack/extract-boolean/dist/js␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'js' ...␊
      [__:__:__] Starting 'js_myBundle' ...␊
      asset myBundle.min.js ___ KiB [emitted] [minimized] (name: default)␊
        sourceMap myBundle.min.js.map ___ KiB [emitted] [dev] (auxiliary name: default)␊
      asset myBundle-default.min.css ___ KiB [emitted] [minimized] (name: default)␊
        sourceMap myBundle-default.min.css.map ___ KiB [emitted] [dev] (auxiliary name: default)␊
      Entrypoint default ___ KiB (___ KiB) = myBundle-default.min.css ___ KiB myBundle.min.js ___ KiB 2 auxiliary assets␊
      chunk (runtime: default) myBundle-default.min.css, myBundle.min.js (default) ___ KiB (javascript) ___ KiB (css/mini-extract) ___ KiB (runtime) [entry] [rendered]␊
        runtime modules ___ KiB 3 modules␊
        dependent modules ___ KiB [dependent] 2 modules␊
        ./js/app.js + 1 modules ___ KiB [built] [code generated]␊
      ␊
        Compiled successfully!␊
        Δt ____ms␊
      ␊
      [__:__:__] Finished 'js_myBundle' after ____ ms␊
      [__:__:__] Finished 'js' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }

> Snapshot 2

    `!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var o=t();for(var n in o)("object"==typeof exports?exports:e)[n]=o[n]}}(self,function(){return function(){"use strict";var e={};e.d=function(t,o){for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},e.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},e.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var t={};e.r(t),e.d(t,{default:function(){return o}});class o{}return t}()});␊
    //# sourceMappingURL=myBundle.min.js.map`

> Snapshot 3

    `!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var o=t();for(var n in o)("object"==typeof exports?exports:e)[n]=o[n]}}(self,function(){return function(){"use strict";var e={};e.d=function(t,o){for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},e.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},e.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var t={};e.r(t),e.d(t,{default:function(){return o}});class o{}return t}()});␊
    //# sourceMappingURL=myBundle.min.js.map`

> Snapshot 4

    `a{color:#00f}.Parent{background:#fff}.Parent--before{color:#333}.Parent .Child{background:#000}.Parent--after{color:#eee}:root{--color:red}.MenuLink{color:var(--color)}␊
    /*# sourceMappingURL=myBundle-default.min.css.map*/`

## Compiles CSS within webpack, extracts CSS ('extractCSS' string option)

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-lightningcss-webpack/extract-string/dist/css␊
                 js: __PATH__/packages/integration/fixtures/crafty-preset-lightningcss-webpack/extract-string/dist/js␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'js' ...␊
      [__:__:__] Starting 'js_myBundle' ...␊
      asset myBundle.min.js ___ KiB [emitted] [minimized] (name: default)␊
        sourceMap myBundle.min.js.map ___ KiB [emitted] [dev] (auxiliary name: default)␊
      asset myBundle-string.min.css ___ KiB [emitted] [minimized] (name: default)␊
        sourceMap myBundle-string.min.css.map ___ KiB [emitted] [dev] (auxiliary name: default)␊
      Entrypoint default ___ KiB (___ KiB) = myBundle-string.min.css ___ KiB myBundle.min.js ___ KiB 2 auxiliary assets␊
      chunk (runtime: default) myBundle-string.min.css, myBundle.min.js (default) ___ KiB (javascript) ___ KiB (css/mini-extract) ___ KiB (runtime) [entry] [rendered]␊
        runtime modules ___ KiB 3 modules␊
        dependent modules ___ KiB [dependent] 2 modules␊
        ./js/app.js + 1 modules ___ KiB [built] [code generated]␊
      ␊
        Compiled successfully!␊
        Δt ____ms␊
      ␊
      [__:__:__] Finished 'js_myBundle' after ____ ms␊
      [__:__:__] Finished 'js' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }

> Snapshot 2

    `!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var o=t();for(var n in o)("object"==typeof exports?exports:e)[n]=o[n]}}(self,function(){return function(){"use strict";var e={};e.d=function(t,o){for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},e.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},e.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var t={};e.r(t),e.d(t,{default:function(){return o}});class o{}return t}()});␊
    //# sourceMappingURL=myBundle.min.js.map`

> Snapshot 3

    `!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var o=t();for(var n in o)("object"==typeof exports?exports:e)[n]=o[n]}}(self,function(){return function(){"use strict";var e={};e.d=function(t,o){for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},e.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},e.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var t={};e.r(t),e.d(t,{default:function(){return o}});class o{}return t}()});␊
    //# sourceMappingURL=myBundle.min.js.map`

> Snapshot 4

    `a{color:#00f}.Parent{background:#fff}.Parent--before{color:#333}.Parent .Child{background:#000}.Parent--after{color:#eee}:root{--color:red}.MenuLink{color:var(--color)}␊
    /*# sourceMappingURL=myBundle-string.min.css.map*/`

## Compiles CSS within webpack, extracts CSS ('extractCSS' object option)

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  css: __PATH__/packages/integration/fixtures/crafty-preset-lightningcss-webpack/extract-object/dist/css␊
                 js: __PATH__/packages/integration/fixtures/crafty-preset-lightningcss-webpack/extract-object/dist/js␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'js' ...␊
      [__:__:__] Starting 'js_myBundle' ...␊
      asset myBundle.min.js ___ KiB [emitted] [minimized] (name: default)␊
        sourceMap myBundle.min.js.map ___ KiB [emitted] [dev] (auxiliary name: default)␊
      asset myBundle-object.min.css ___ KiB [emitted] [minimized] (name: default)␊
        sourceMap myBundle-object.min.css.map ___ KiB [emitted] [dev] (auxiliary name: default)␊
      Entrypoint default ___ KiB (___ KiB) = myBundle-object.min.css ___ KiB myBundle.min.js ___ KiB 2 auxiliary assets␊
      chunk (runtime: default) myBundle-object.min.css, myBundle.min.js (default) ___ KiB (javascript) ___ KiB (css/mini-extract) ___ KiB (runtime) [entry] [rendered]␊
        runtime modules ___ KiB 3 modules␊
        dependent modules ___ KiB [dependent] 2 modules␊
        ./js/app.js + 1 modules ___ KiB [built] [code generated]␊
      ␊
        Compiled successfully!␊
        Δt ____ms␊
      ␊
      [__:__:__] Finished 'js_myBundle' after ____ ms␊
      [__:__:__] Finished 'js' after ____ ms␊
      [__:__:__] Finished 'default' after ____ ms␊
      `,
    }

> Snapshot 2

    `!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var o=t();for(var n in o)("object"==typeof exports?exports:e)[n]=o[n]}}(self,function(){return function(){"use strict";var e={};e.d=function(t,o){for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},e.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},e.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var t={};e.r(t),e.d(t,{default:function(){return o}});class o{}return t}()});␊
    //# sourceMappingURL=myBundle.min.js.map`

> Snapshot 3

    `!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var o=t();for(var n in o)("object"==typeof exports?exports:e)[n]=o[n]}}(self,function(){return function(){"use strict";var e={};e.d=function(t,o){for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},e.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},e.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var t={};e.r(t),e.d(t,{default:function(){return o}});class o{}return t}()});␊
    //# sourceMappingURL=myBundle.min.js.map`

> Snapshot 4

    `a{color:#00f}.Parent{background:#fff}.Parent--before{color:#333}.Parent .Child{background:#000}.Parent--after{color:#eee}:root{--color:red}.MenuLink{color:var(--color)}␊
    /*# sourceMappingURL=myBundle-object.min.css.map*/`
