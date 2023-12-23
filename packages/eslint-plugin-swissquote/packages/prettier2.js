const prettier = require("../dist/prettier2/index.js");

module.exports = {
    /**
     * @param {string} path 
     * @param {any} config 
     * @returns {Promise<{ ignored: boolean, inferredParser: string }>}
     */
    getFileInfo(path, config) {
        return prettier.getFileInfo.sync(path, config);
    },
    /**
     * @param {string} source 
     * @param {any} options 
     * @returns {Promise<string>}
     */
    format(source, options) {
        return prettier.format(source, options);
    }
}