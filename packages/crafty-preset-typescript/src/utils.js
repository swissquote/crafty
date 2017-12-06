const fs = require("fs");

const tmp = require("tmp");

function createTempFile(content) {
  const filename = tmp.fileSync({
    prefix: "tslint-config-",
    postfix: ".json"
  }).name;

  fs.writeFileSync(filename, content);

  return filename;
}

module.exports = {
  createTempFile: createTempFile
};
