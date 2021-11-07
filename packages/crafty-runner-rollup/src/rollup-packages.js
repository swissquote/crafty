function rollupPluginCommonJs() {
    return require("@rollup/plugin-commonjs");
}

function rollupPluginJson() {
    return require("@rollup/plugin-json");
}

function rollupPluginNodeResolve() {
    return require("@rollup/plugin-node-resolve");
}

function rollupPluginReplace() {
    return require("@rollup/plugin-replace");
}

function rollupPluginPNPResolve() {
    return require("rollup-plugin-pnp-resolve");
}

/*function rollupPluginTerser() {
    return require("rollup-plugin-terser");
}*/

function rollup() {
    return require("rollup");
}

module.exports = {
    rollupPluginCommonJs,
    rollupPluginJson,
    rollupPluginNodeResolve,
    rollupPluginReplace,
    rollupPluginPNPResolve,
    //rollupPluginTerser,
    rollup
}