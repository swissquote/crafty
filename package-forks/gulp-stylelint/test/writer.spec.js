"use strict";

const test = require("ava");
const sinon = require("sinon");
const colors = require("ansi-colors");
const fs = require("fs");
const path = require("path");

const writer = require("../src/writer");

const tmpDir = path.resolve(__dirname, "../tmp");

test.beforeEach((t) => {
  t.context.processCWDStub = sinon.stub(process, "cwd");
  t.context.processCWDStub.returns(tmpDir);
});

test.afterEach((t) => {
  t.context.processCWDStub.restore();
});

test.serial("writer should write to cwd if base dir is not specified", (t) => {
  const reportFilePath = path.join(process.cwd(), "foo.txt");

  t.plan(2);

  return writer("footext", "foo.txt")
    .then(() => {
      t.truthy(fs.statSync(reportFilePath).isFile());
      t.deepEqual(fs.readFileSync(reportFilePath, "utf8"), "footext");
    })
    .catch((error) => t.is(error, undefined))
    .then(() => {
      fs.unlinkSync(reportFilePath);
    });
});

test.serial("writer should write to a base folder if it is specified", (t) => {
  const reportDirPath = path.join(process.cwd(), "foodir");
  const reportSubdirPath = path.join(reportDirPath, "/subdir");
  const reportFilePath = path.join(reportSubdirPath, "foo.txt");

  t.plan(2);

  return writer("footext", "foo.txt", reportSubdirPath)
    .then(() => {
      t.truthy(fs.statSync(reportFilePath).isFile());
      t.deepEqual(fs.readFileSync(reportFilePath, "utf8"), "footext");
    })
    .catch((error) => t.is(error, undefined))
    .then(() => {
      fs.unlinkSync(reportFilePath);
      fs.rmdirSync(reportSubdirPath);
      fs.rmdirSync(reportDirPath);
    });
});

test.serial("writer should strip colors from formatted output", (t) => {
  const reportFilePath = path.join(process.cwd(), "foo.txt");

  t.plan(1);

  return writer(colors.blue("footext"), "foo.txt")
    .then(() => {
      t.deepEqual(fs.readFileSync(reportFilePath, "utf8"), "footext");
    })
    .catch((error) => t.is(error, undefined))
    .then(() => {
      fs.unlinkSync(reportFilePath);
    });
});
