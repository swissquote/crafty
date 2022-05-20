var assert = require("assert");

var { distance } = require("fastest-levenshtein");

function similarTasks(registry, queryTask) {
  if (typeof queryTask !== "string") {
    return [];
  }

  var tasks = registry.tasks();
  var possibleSimilarTasks = [];
  for (var task in tasks) {
    if (tasks.hasOwnProperty(task)) {
      var dist = distance(task, queryTask);
      var allowedDistance = Math.floor(0.4 * task.length) + 1;
      if (dist < allowedDistance) {
        possibleSimilarTasks.push(task);
      }
    }
  }
  return possibleSimilarTasks;
}

function normalizeArgs(registry, args) {
  function getFunction(task) {
    if (typeof task === "function") {
      return task;
    }

    var fn = registry.get(task);
    if (!fn) {
      var similar = similarTasks(registry, task);
      if (similar.length > 0) {
        assert(
          false,
          `Task never defined: ${task} - did you mean? ${similar.join(", ")}`
        );
      } else {
        assert(false, `Task never defined: ${task}`);
      }
    }
    return fn;
  }

  var flattenArgs = args.flat();
  assert(
    flattenArgs.length,
    "One or more tasks should be combined using series or parallel"
  );

  return flattenArgs.map(getFunction);
}

module.exports = normalizeArgs;
