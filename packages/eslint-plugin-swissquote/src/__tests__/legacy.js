/* global describe, it, expect */

const { prepareCLIEngine, lint } = require("../../test_utils");
const engine = prepareCLIEngine("legacy");

it("Doesn't work with ES6", () => {
  const result = lint(
    engine,
    `
const something = [];

something.push("a value");
`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(0);
  expect(result.errorCount).toBe(1);
});

describe("ES5 formatting", () => {
  it("Gives no warning on correct code", () => {
    const result = lint(
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

    expect(result.messages).toMatchSnapshot();
    expect(result.warningCount).toBe(0);
    expect(result.errorCount).toBe(0);
  });

  it("Warns on wrong format", () => {
    const result = lint(
      engine,
      `

function test() { "use strict"; fetch("This is spartaaa"); }

test()

`
    );

    expect(result.messages).toMatchSnapshot();
    expect(result.warningCount).toBe(0);
    expect(result.errorCount).toBe(2);
  });
});
