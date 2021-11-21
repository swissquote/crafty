var postcss = require('postcss')
var atroot = require('../')

function test (input, output, opts) {
  var result = postcss(atroot(opts)).process(input)
  expect(result.css).toEqual(output)
  expect(result.warnings().length).toEqual(0)
}

/*eslint no-undef: 0*/
describe('postcss-atroot', function () {
  it('places nodes before parent rule', function () {
    test(
      '.test {@at-root {.root {color: black}}}',
      '.root {color: black}.test {}'
    )
  })

  it('places nodes before parent rule, recursively', function () {
    test(
      '.test { .innertest { @at-root {.root {color: black}}}}',
      '.root {color: black}.test { .innertest {}}'
    )
  })

  it('places nodes before parent rule, keeps nested media', function () {
    test(
      '.test { .innertest { @at-root { @media(print) {.root {color: black}}}}}',
      ' @media(print) {.root {color: black}} .test { .innertest {}}'
    )
  })

  it('saves nodes order', function () {
    test(
      '.test {@at-root {color: white;color: black;color: green}}',
      'color: white;color: black;color: green;\n.test {}'
    )
  })
})
