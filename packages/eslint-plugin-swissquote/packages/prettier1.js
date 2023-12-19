const prettier = require("../dist/prettier1/index.js");

module.exports = {
    resolveConfig(path, config) {
        return prettier.resolveConfig.sync(path, config);
    },
    getFileInfo(path, config) {
        return prettier.getFileInfo.sync(path, config);
    },
    format(source, options) {
        return prettier.format(source, options);
    }
}