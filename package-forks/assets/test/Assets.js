const sinon = require("sinon");
const { test } = require("uvu");
const assert = require("uvu/assert");

const Assets = require("..");

test.before(() => {
  sinon.stub(Assets, "data");
  sinon.stub(Assets, "path");
  sinon.stub(Assets, "size");
  sinon.stub(Assets, "url");
});

test.after(() => {
  Assets.data.restore();
  Assets.path.restore();
  Assets.size.restore();
  Assets.url.restore();
});

test("constructor", () => {
  assert.equal(typeof Assets, "function", "is a function");
  // eslint-disable-next-line new-cap
  assert.instance(Assets(), Assets, "instantiable without new");
  assert.is(Object.isFrozen(new Assets()), true, "is frozen");
});

test(".options", () => {
  const options = { basePath: "source" };
  assert.equal(new Assets().options, {}, "defaults to an empty object");
  assert.equal(new Assets(options).options.basePath, "source", "is initiable");
  assert.is.not(new Assets(options).options, options, "breaks the reference");
});

test(".data()", () => {
  const instance = new Assets();
  instance.data();
  assert.is(Assets.data.called, true);
});

test(".path()", () => {
  const instance = new Assets();
  instance.path();
  assert.is(Assets.path.called, true);
});

test(".size()", () => {
  const instance = new Assets();
  instance.size();
  assert.is(Assets.size.called, true);
});

test(".url()", () => {
  const instance = new Assets();
  instance.url();
  assert.is(Assets.url.called, true);
});

test.run();
