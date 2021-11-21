var postcss = require('postcss');
var fs = require('fs');
var pseudoelements = require('../index.js')

describe('test', function() {

  it('should default to one colon per pseudo element', function() {
    var input = fs.readFileSync(__dirname + '/input.css', 'utf-8');
    var expected = fs.readFileSync(__dirname + '/expected-single.css', 'utf-8');

    var out = postcss(pseudoelements()).process(input);

    expect(out.css).toEqual(expected);
  });

  it('should default to two colons per pseudo element', function() {
    var input = fs.readFileSync(__dirname + '/input.css', 'utf-8');
    var expected = fs.readFileSync(__dirname + '/expected-double.css', 'utf-8');
    var options = {
      single: false,
    }

    var out = postcss(pseudoelements(options)).process(input);

    expect(out.css).toEqual(expected);
  });
});
