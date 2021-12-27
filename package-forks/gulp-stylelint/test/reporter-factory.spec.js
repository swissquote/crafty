"use strict";

const fancyLog = require("fancy-log");
const { stub } = require("sinon");

const reporterFactory = require("../src/reporter-factory");

beforeEach(() => {
  stub(fancyLog, "info");
});

afterEach(() => {
  fancyLog.info.restore();
});

test("reporter factory should return a function", () => {
  expect.assertions(1);
  expect(typeof reporterFactory()).toEqual("function");
});

test("reporter should return a promise", () => {
  expect.assertions(1);

  const reporter = reporterFactory({
    formatter() {
      // empty formatter
    },
  });

  expect(typeof reporter({}).then).toEqual("function");
});

test("reporter should write to console if console param is true", () => {
  expect.assertions(1);

  const reporter = reporterFactory({
    formatter() {
      return "foo";
    },
    console: true,
  });

  reporter({});

  expect(fancyLog.info.calledWith("\nfoo\n")).toBe(true);
});

test("reporter should NOT write to console if console param is false", () => {
  expect.assertions(1);
  const reporter = reporterFactory({
    formatter() {
      return "foo";
    },
    console: false,
  });

  reporter({});

  expect(fancyLog.info.called).toEqual(false);
});

test("reporter should NOT write to console if formatter returned only whitespace", () => {
  expect.assertions(1);
  const reporter = reporterFactory({
    formatter() {
      return "  \n";
    },
    console: true,
  });

  reporter({});

  expect(fancyLog.info.called).toEqual(false);
});

test("reporter should NOT write to console by default", () => {
  expect.assertions(1);
  const reporter = reporterFactory({
    formatter() {
      return "foo";
    },
  });

  reporter({});

  expect(fancyLog.info.called).toBe(false);
});
