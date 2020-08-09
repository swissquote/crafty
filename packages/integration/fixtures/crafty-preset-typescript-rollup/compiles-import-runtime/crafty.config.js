module.exports = {
  presets: ["@swissquote/crafty-preset-babel", "@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-rollup"],
  js: {
    myTSBundle: {
      source: "js/typescript.ts"
    }
  },
  rollup(crafty, bundle, rollupConfig) {
    //console.log(rollupConfig);
    delete rollupConfig.input.plugins.terser;
  }
};
