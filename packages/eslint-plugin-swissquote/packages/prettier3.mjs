import { getFileInfo, format } from "../dist/prettier/index.mjs";

export default {
    /**
     * @param {string} path 
     * @param {any} config 
     * @returns {Promise<{ ignored: boolean, inferredParser: string }>}
     */
    getFileInfo(path, config) {
        return getFileInfo(path, config);
    },
    /**
     * @param {string} source 
     * @param {any} options 
     * @returns {Promise<string>}
     */
    format(source, options) {
        return format(source, options);
    }
}