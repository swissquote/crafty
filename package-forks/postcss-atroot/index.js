module.exports = () => {
  return {
    postcssPlugin: "postcss-atroot",
    Rule(rule) {
      // Using `Rule(rule) { rule.each(child => { /* logic here */ })}`
      // instead of `{AtRule: {'at-rule': function(rule) { /* logic here */ }}}`
      // This way postcss-atroot can handle the rule before postcss-nested which chokes
      // on the postcss-atroot syntax
      rule.each(child => {
        if (child.type !== "atrule" || child.name !== "at-root") {
          return;
        }

        // Find first node from root to move child nodes after it
        let p = rule;
        while (p && p.parent && p.parent.type !== "root") {
          p = p.parent;
        }

        child.root().insertBefore(p, child.nodes);
        child.remove();
      });
    }
  };
};

module.exports.postcss = true;
