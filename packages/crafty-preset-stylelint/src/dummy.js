module.exports = {
  cosmiconfig(name, options) {
    return {
      load(searchPath) {
        const config = require(searchPath);

        return options.transform({ config });
      },
      search() {
        return null;
      }
    };
  }
};
