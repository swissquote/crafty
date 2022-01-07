const test = require("ava");

const { prepareESLint, lint } = require("../../test_utils");

const engine = prepareESLint("legacy");

test("Doesn't work with ES6", async (t) => {
  const result = await lint(
    engine,
    `
const something = [];

something.push("a value");
`
  );

  t.snapshot(result.messages);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 1);
});

  test("Gives no warning on correct code", async (t) => {
    const result = await lint(
      engine,
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

    t.snapshot(result.messages);
    t.is(result.warningCount, 0);
    t.is(result.errorCount, 0);
  });

  test("Warns on wrong format", async (t) => {
    const result = await lint(
      engine,
      `

function test() { "use strict"; fetch("This is spartaaa"); }

test()

`
    );

    t.snapshot(result.messages);
    t.is(result.warningCount, 0);
    t.is(result.errorCount, 2);
  });
