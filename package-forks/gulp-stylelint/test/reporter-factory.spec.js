const test = require("ava");

const fancyLog = require("fancy-log");
const sinon = require("sinon");

const reporterFactory = require("../src/reporter-factory");

test.beforeEach((t) => {
  t.context.fancyLogInfo = sinon.stub(fancyLog, "info");
});

test.afterEach((t) => {
  t.context.fancyLogInfo.restore();
});

test.serial("reporter factory should return a function", (t) => {
  t.plan(1);
  t.is(typeof reporterFactory(), "function");
});

test.serial("reporter should return a promise", (t) => {
  t.plan(1);

  const reporter = reporterFactory({
    formatter() {
      // empty formatter
    },
  });

  t.is(typeof reporter({}).then, "function");
});

test.serial(
  "reporter should write to console if console param is true",
  (t) => {
    t.plan(1);

    const reporter = reporterFactory({
      formatter() {
        return "foo";
      },
      console: true,
    });

    reporter({});

    t.truthy(fancyLog.info.calledWith("\nfoo\n"));
  }
);

test.serial(
  "reporter should NOT write to console if console param is false",
  (t) => {
    t.plan(1);
    const reporter = reporterFactory({
      formatter() {
        return "foo";
      },
      console: false,
    });

    reporter({});

    t.falsy(fancyLog.info.called);
  }
);

test.serial(
  "reporter should NOT write to console if formatter returned only whitespace",
  (t) => {
    t.plan(1);
    const reporter = reporterFactory({
      formatter() {
        return "  \n";
      },
      console: true,
    });

    reporter({});

    t.falsy(fancyLog.info.called);
  }
);

test.serial("reporter should NOT write to console by default", (t) => {
  t.plan(1);
  const reporter = reporterFactory({
    formatter() {
      return "foo";
    },
  });

  reporter({});

  t.falsy(fancyLog.info.called);
});
