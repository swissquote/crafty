var path = require("path");
const { printDependencySizeTree } = require("webpack-bundle-size-analyzer");

function modulePath(identifier) {
  // the format of module paths is
  //   '(<loader expression>!)?/path/to/module.js'
  var loaderRegex = /.*!/;
  return identifier.replace(loaderRegex, "");
}

function bundleSizeTree(stats) {
  var statsTree = {
    packageName: "<root>",
    size: 0,
    children: [],
  };
  if (stats.name) {
    statsTree.bundleName = stats.name;
  }
  // extract source path for each module
  var modules = stats.modules.map(function(mod) {
    return {
      path: modulePath(mod.identifier),
      size: mod.size,
    };
  });
  modules.sort(function(a, b) {
    if (a === b) {
      return 0;
    } else {
      return a < b ? -1 : 1;
    }
  });
  modules.forEach(function(mod) {
    // convert each module path into an array of package names, followed
    // by the trailing path within the last module:
    //
    // root/node_modules/parent/node_modules/child/file/path.js =>
    //  ['root', 'parent', 'child', 'file/path.js'
    var packages = mod.path.split(
      new RegExp(
        "\\" + path.sep + "(?:node_modules|package-forks)\\" + path.sep
      )
    );
    var filename = "";
    if (packages.length > 1) {
      var lastSegment = packages.pop();
      var lastPackageName = "";
      if (lastSegment[0] === "@") {
        // package is a scoped package
        var offset = lastSegment.indexOf(path.sep) + 1;
        lastPackageName = lastSegment.slice(
          0,
          offset + lastSegment.slice(offset).indexOf(path.sep)
        );
      } else {
        lastPackageName = lastSegment.slice(0, lastSegment.indexOf(path.sep));
      }
      packages.push(lastPackageName);
      filename = lastSegment.slice(lastPackageName.length + 1);
    } else {
      filename = packages[0];
    }
    packages.shift();
    var parent = statsTree;
    parent.size += mod.size;
    packages.forEach(function(pkg) {
      var existing = parent.children.filter(function(child) {
        return child.packageName === pkg;
      });
      if (existing.length > 0) {
        existing[0].size += mod.size;
        parent = existing[0];
      } else {
        var newChild = {
          packageName: pkg,
          size: mod.size,
          children: [],
        };
        parent.children.push(newChild);
        parent = newChild;
      }
    });
  });
  return statsTree;
}

module.exports = function printStats(bundleStats) {
  const depTrees = [bundleSizeTree(bundleStats)];
  depTrees.forEach((tree) => printDependencySizeTree(tree, false));
};
