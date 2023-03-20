# Snapshot report for `__tests__/crafty-runner-webpack.js`

The actual snapshot is saved in `crafty-runner-webpack.js.snap`.

Generated by [AVA](https://avajs.dev).

## Compiles Only with Webpack

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  js: dist/js␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'js' ...␊
      [__:__:__] Starting 'js_myBundle' ...␊
      asset myBundle.min.js ___ KiB [emitted] [minimized] (name: default)␊
        sourceMap myBundle.min.js.map ___ KiB [emitted] [dev] (auxiliary name: default)␊
      asset 690.myBundle.min.js ___ KiB [emitted] [minimized]␊
        sourceMap 690.myBundle.min.js.map ___ KiB [emitted] [dev]␊
      Entrypoint default ___ KiB (___ KiB) = myBundle.min.js 1 auxiliary asset␊
      chunk (runtime: default) 690.myBundle.min.js ___ KiB [rendered]␊
        ./js/SomeClass.js ___ KiB [built] [code generated]␊
      chunk (runtime: default) myBundle.min.js (default) ___ KiB (javascript) ___ KiB (runtime) [entry] [rendered]␊
        runtime modules ___ KiB 9 modules␊
        ./js/script.js ___ KiB [built] [code generated]␊
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

    `!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var n in r)("object"==typeof exports?exports:e)[n]=r[n]}}(self,function(){return function(){"use strict";var e,t,r,n,o,i={},u={};function c(e){var t=u[e];if(void 0!==t)return t.exports;var r=u[e]={exports:{}};return i[e](r,r.exports,c),r.exports}c.m=i,c.d=function(e,t){for(var r in t)c.o(t,r)&&!c.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},c.f={},c.e=function(e){return Promise.all(Object.keys(c.f).reduce(function(t,r){return c.f[r](e,t),t},[]))},c.u=function(e){return""+e+".myBundle.min.js"},c.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},e={},t="UNIQID:",c.l=function(r,n,o,i){if(e[r]){e[r].push(n);return}if(void 0!==o)for(var u,a,f=document.getElementsByTagName("script"),l=0;l<f.length;l++){var s=f[l];if(s.getAttribute("src")==r||s.getAttribute("data-webpack")==t+o){u=s;break}}u||(a=!0,(u=document.createElement("script")).charset="utf-8",u.timeout=120,c.nc&&u.setAttribute("nonce",c.nc),u.setAttribute("data-webpack",t+o),u.src=r),e[r]=[n];var d=function(t,n){u.onerror=u.onload=null,clearTimeout(p);var o=e[r];if(delete e[r],u.parentNode&&u.parentNode.removeChild(u),o&&o.forEach(function(e){return e(n)}),t)return t(n)},p=setTimeout(d.bind(null,void 0,{type:"timeout",target:u}),12e4);u.onerror=d.bind(null,u.onerror),u.onload=d.bind(null,u.onload),a&&document.head.appendChild(u)},c.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){c.g.importScripts&&(e=c.g.location+"");var e,t=c.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\\?.*$/,"").replace(/\\/[^\\/]+$/,"/"),c.p=e}(),r={913:0},c.f.j=function(e,t){var n=c.o(r,e)?r[e]:void 0;if(0!==n){if(n)t.push(n[2]);else{var o=new Promise(function(t,o){n=r[e]=[t,o]});t.push(n[2]=o);var i=c.p+c.u(e),u=Error();c.l(i,function(t){if(c.o(r,e)&&(0!==(n=r[e])&&(r[e]=void 0),n)){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;u.message="Loading chunk "+e+" failed.\\n("+o+": "+i+")",u.name="ChunkLoadError",u.type=o,u.request=i,n[1](u)}},"chunk-"+e,e)}}},n=function(e,t){var n,o,i=t[0],u=t[1],a=t[2],f=0;if(i.some(function(e){return 0!==r[e]})){for(n in u)c.o(u,n)&&(c.m[n]=u[n]);a&&a(c)}for(e&&e(t);f<i.length;f++)o=i[f],c.o(r,o)&&r[o]&&r[o][0](),r[o]=0},(o=self.webpackChunkUNIQID=self.webpackChunkUNIQID||[]).forEach(n.bind(null,0)),o.push=n.bind(null,o.push.bind(o));var a={};c.r(a),c.d(a,{default:function(){return f}});class f{constructor(){console.log("init class")}method(){c.e(690).then(c.bind(c,690)).then(function(e){let t=new e.default("Bill");t.sayHi()})}}return a}()});␊
    //# sourceMappingURL=myBundle.min.js.map`

> Snapshot 3

    `!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var n in r)("object"==typeof exports?exports:e)[n]=r[n]}}(self,function(){return function(){"use strict";var e,t,r,n,o,i={},u={};function c(e){var t=u[e];if(void 0!==t)return t.exports;var r=u[e]={exports:{}};return i[e](r,r.exports,c),r.exports}c.m=i,c.d=function(e,t){for(var r in t)c.o(t,r)&&!c.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},c.f={},c.e=function(e){return Promise.all(Object.keys(c.f).reduce(function(t,r){return c.f[r](e,t),t},[]))},c.u=function(e){return""+e+".myBundle.min.js"},c.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},e={},t="UNIQID:",c.l=function(r,n,o,i){if(e[r]){e[r].push(n);return}if(void 0!==o)for(var u,a,f=document.getElementsByTagName("script"),l=0;l<f.length;l++){var s=f[l];if(s.getAttribute("src")==r||s.getAttribute("data-webpack")==t+o){u=s;break}}u||(a=!0,(u=document.createElement("script")).charset="utf-8",u.timeout=120,c.nc&&u.setAttribute("nonce",c.nc),u.setAttribute("data-webpack",t+o),u.src=r),e[r]=[n];var d=function(t,n){u.onerror=u.onload=null,clearTimeout(p);var o=e[r];if(delete e[r],u.parentNode&&u.parentNode.removeChild(u),o&&o.forEach(function(e){return e(n)}),t)return t(n)},p=setTimeout(d.bind(null,void 0,{type:"timeout",target:u}),12e4);u.onerror=d.bind(null,u.onerror),u.onload=d.bind(null,u.onload),a&&document.head.appendChild(u)},c.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){c.g.importScripts&&(e=c.g.location+"");var e,t=c.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\\?.*$/,"").replace(/\\/[^\\/]+$/,"/"),c.p=e}(),r={913:0},c.f.j=function(e,t){var n=c.o(r,e)?r[e]:void 0;if(0!==n){if(n)t.push(n[2]);else{var o=new Promise(function(t,o){n=r[e]=[t,o]});t.push(n[2]=o);var i=c.p+c.u(e),u=Error();c.l(i,function(t){if(c.o(r,e)&&(0!==(n=r[e])&&(r[e]=void 0),n)){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;u.message="Loading chunk "+e+" failed.\\n("+o+": "+i+")",u.name="ChunkLoadError",u.type=o,u.request=i,n[1](u)}},"chunk-"+e,e)}}},n=function(e,t){var n,o,i=t[0],u=t[1],a=t[2],f=0;if(i.some(function(e){return 0!==r[e]})){for(n in u)c.o(u,n)&&(c.m[n]=u[n]);a&&a(c)}for(e&&e(t);f<i.length;f++)o=i[f],c.o(r,o)&&r[o]&&r[o][0](),r[o]=0},(o=self.webpackChunkUNIQID=self.webpackChunkUNIQID||[]).forEach(n.bind(null,0)),o.push=n.bind(null,o.push.bind(o));var a={};c.r(a),c.d(a,{default:function(){return f}});class f{constructor(){console.log("init class")}method(){c.e(690).then(c.bind(c,690)).then(function(e){let t=new e.default("Bill");t.sayHi()})}}return a}()});␊
    //# sourceMappingURL=myBundle.min.js.map`

> Snapshot 4

    `"use strict";(self.webpackChunkUNIQID=self.webpackChunkUNIQID||[]).push([[690],{690:function(s,e,t){t.r(e),t.d(e,{default:function(){return c}});class c{constructor(s){this.field=s}sayHi(){console.log(this.field)}}}}]);␊
    //# sourceMappingURL=690.myBundle.min.js.map`

## Fails gracefully on broken markup

> Snapshot 1

    {
      status: 1,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      [__:__:__] Files will be stored in:␊
                  js: __PATH__/packages/integration/fixtures/crafty-runner-webpack/fails/dist/js␊
      [__:__:__] Starting 'default' ...␊
      [__:__:__] Starting 'js' ...␊
      [__:__:__] Starting 'js_myBundle' ...␊
      assets by status ___ KiB [cached] 1 asset␊
      Entrypoint default = myBundle.min.js 1 auxiliary asset␊
      chunk (runtime: default) myBundle.min.js (default) ___ KiB [entry] [rendered]␊
        ./js/script.js ___ KiB [built] [code generated] [1 error]␊
      ␊
        Failed to compile.␊
      ␊
      Module parse failed: Unexpected token (15:0)␊
      You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders␊
      |␊
      | }␊
      >␊
      ␊
        Δt ____ms ✖ 1 problem (1 error, 0 warnings)␊
      ␊
      [__:__:__] 'js_myBundle' errored after ____ ms␊
      [__:__:__] Webpack compilation failed␊
      [__:__:__] 'js' errored after ____ ms␊
      [__:__:__] 'default' errored after ____ ms␊
      `,
    }