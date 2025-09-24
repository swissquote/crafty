// ESLint prints a warning when it encounters a .eslintignore file
// However we want to support that file, so we need to ignore the warning
const originalEmitWarning = process.emitWarning;
process.emitWarning = (...args) => {
  if (args[1] === "ESLintIgnoreWarning") {
    return;
  }
  originalEmitWarning.apply(process, args);
};
