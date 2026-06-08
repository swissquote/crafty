module.exports = function() {
  return {
    visitor: {
      Identifier(path) {
        if (
          path.node.name === "__BABEL_MAGIC__" &&
          !path.scope.hasBinding("__BABEL_MAGIC__")
        ) {
          path.replaceWithSourceString(JSON.stringify("babel-hooked"));
        }
      }
    }
  };
};