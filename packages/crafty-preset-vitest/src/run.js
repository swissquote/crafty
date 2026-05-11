const { parseCLI, startVitest } = require("vitest/node");

async function main() {
  const { filter, options } = parseCLI(["vitest", "run", ...process.argv.slice(2)]);
  const vitest = await startVitest("test", filter, options);

  if (vitest && !vitest.shouldKeepServer()) {
    await vitest.exit();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});