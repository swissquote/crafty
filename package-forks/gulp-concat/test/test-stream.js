const { Readable } = require('node:stream');
const File = require('vinyl');

module.exports = function (...args) {
  let i = 0;

  function create(contents) {
    return new File({
      cwd: '/home/contra/',
      base: '/home/contra/test',
      path: '/home/contra/test/file' + (i++).toString() + '.js',
      contents: Buffer.from(contents),
      stat: {mode: 0o666}
    });
  }

  return Readable.from(args.map(create))
};
