import { resolveConfig, getFileInfo, format } from "../dist/prettier/index.mjs";

export default {
    resolveConfig(path, config) {
        return resolveConfig(path, config);
    },
    getFileInfo(path, config) {
        return getFileInfo(path, config);
    },
    format(source, options) {
        return format(source, options);
    }
}