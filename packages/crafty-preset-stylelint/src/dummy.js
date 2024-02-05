export default {
  cosmiconfig(name, options) {
    return {
      async load(searchPath) {
        const config = await import(searchPath);

        return options.transform({ config });
      },
      search() {
        return null;
      }
    };
  }
};
