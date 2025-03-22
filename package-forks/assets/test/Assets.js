const sinon = require("sinon");
const { expect } = require("expect");
const { test, beforeAll, afterAll } = require("node:test");

const Assets = require("..");

beforeAll(() => {
  sinon.stub(Assets, "data");
  sinon.stub(Assets, "path");
  sinon.stub(Assets, "size");
  sinon.stub(Assets, "url");
});

afterAll(() => {
  Assets.data.restore();
  Assets.path.restore();
  Assets.size.restore();
  Assets.url.restore();
});

test("constructor", () => {
  expect(typeof Assets).toBe("function");
  // eslint-disable-next-line new-cap
  expect(new Assets()).toBeInstanceOf(Assets);
  expect(Object.isFrozen(new Assets())).toBe(true);
});

test(".options", () => {
  const options = { basePath: "source" };
  expect(new Assets().options).toEqual({});
  expect(new Assets(options).options.basePath).toBe("source");
  expect(new Assets(options).options).not.toBe(options);
});

test(".data()", () => {
  const instance = new Assets();
  instance.data();
  expect(Assets.data.called).toBe(true);
});

test(".path()", () => {
  const instance = new Assets();
  instance.path();
  expect(Assets.path.called).toBe(true);
});

test(".size()", () => {
  const instance = new Assets();
  instance.size();
  expect(Assets.size.called).toBe(true);
});

test(".url()", () => {
  const instance = new Assets();
  instance.url();
  expect(Assets.url.called).toBe(true);
});
