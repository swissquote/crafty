import test from "node:test";
import { expect } from "expect";
import initSnapshot from "@onigoetz/ntr-expect-snapshot";

import { prepareESLint } from "../../test_utils.js";

initSnapshot(import.meta.url);

const lint = prepareESLint("legacy");

test("Doesn't work with ES6", async t => {
  const result = await lint(
    `
const something = [];

something.push("a value");
`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(1);
});

test("Gives no warning on correct code", async t => {
  const result = await lint(
    `
/* global jQuery */
(function($) {
  "use strict";

  function getjQueryObject(string) {
    // Make string a vaild jQuery thing
    var jqObj = $("");
    try {
      jqObj = $(string);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      jqObj = $("<span />").html(string);
    }
    return jqObj;
  }

  $.print = $.fn.print = function(newOptions) {
    var defaults = {
      globalStyles: true,
      mediaPrint: false,
      someObject: "actuallyNot"
    };

    // Print a given set of elements
    var options = $.extend({}, defaults, newOptions || {});
    var $styles = getjQueryObject(options.someObject);
    if (options.globalStyles) {
      // Apply the stlyes from the current sheet to the printed page
      $styles = $("style, link, meta, base, title");
    } else if (options.mediaPrint) {
      // Apply the media-print stylesheet
      $styles = $("link[media=print]");
    }
    return $styles;
  };
})(jQuery);
`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(0);
});

test("Warns on wrong format", async t => {
  const result = await lint(
    `

function test() { "use strict"; fetch("This is spartaaa"); }

test()

`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(2);
});
