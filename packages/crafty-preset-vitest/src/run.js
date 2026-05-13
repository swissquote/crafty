const util = require("node:util");
const { parseCLI, resolveConfig, startVitest } = require("vitest/node");

function printConfig(config) {
  console.log(
    util.inspect(config, {
      depth: null,
      colors: process.stdout.isTTY,
      compact: false,
      sorted: true
    })
  );
}

async function main() {
  const { filter, options } = parseCLI([
    "vitest",
    "run",
    ...process.argv.slice(2)
  ]);

  if (options.help) {
    return;
  }

  if (options.showConfig) {
    const resolved = await resolveConfig(options);
    printConfig(resolved.vitestConfig);
    return;
  }

  const vitest = await startVitest("test", filter, options);

  if (vitest && !vitest.shouldKeepServer()) {
    await vitest.exit();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
