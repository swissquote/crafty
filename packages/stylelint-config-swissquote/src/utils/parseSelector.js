const selectorParser = require("postcss-selector-parser");

function parseSelector(resolvedSelector) {
  const container = selectorParser.selector();
  for (const part of resolvedSelector) {
    const parsed = selectorParser().astSync(part.selector);
    parsed.nodes[0].each((node) => {
      node.originalNode = part.node;
      container.append(node);
    });
  }

  const root = selectorParser.root();
  root.append(container);

  return root;
}

module.exports = parseSelector;
