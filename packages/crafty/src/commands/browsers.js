const colors = require("@swissquote/crafty-commons/packages/ansi-colors");

const hasOwnProperty = Object.prototype.hasOwnProperty;

exports.description = "List supported browsers";
exports.command = async function run(crafty /* , input, cli */) {
  const browserslist = require("@swissquote/crafty-commons/packages/browserslist");

  console.log(`Your browserslist query:\n    '${crafty.config.browsers}'`);

  const list = browserslist(crafty.config.browsers);

  let totalBrowsers = 0;
  const browsers = {};
  list.forEach(tuple => {
    totalBrowsers++;
    const [browser, version] = tuple.split(/\s/);

    if (!hasOwnProperty.call(browsers, browser)) {
      browsers[browser] = [];
    }

    browsers[browser].push(version);
  });

  const { agents } = require("caniuse-lite/dist/unpacker/agents");

  const getBrowserName = browser => agents[browser].browser;

  const maxLength =
    Object.keys(browsers).reduce(
      (current, browser) => Math.max(current, getBrowserName(browser).length),
      0
    ) + 2;

  console.log(
    `Contains ${colors.blue(totalBrowsers)} browsers covering ${colors.blue(
      browserslist.coverage(list).toFixed(2)
    )}% of global usage.`
  );
  console.log();

  Object.keys(browsers).forEach(browser => {
    const name = getBrowserName(browser);
    const remainingLength = maxLength - name.length;

    console.log(
      colors.bold(getBrowserName(browser) + " ".repeat(remainingLength)),
      browsers[browser].join(", ")
    );
  });

  return 0;
};
