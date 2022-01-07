"use strict";

const test = require("ava");

var noop = require("./util").noop,
  Crafty = require("@swissquote/crafty/src/Crafty"),
  Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");

  const gulp = new Gulp(new Crafty({}));

var plumber = require("../");
var fixturesGlob = ["./test/fixtures/*"];


test("in non-flowing mode", (t) => {
  return new Promise((done) => {
    var lastNoop = noop();
    var mario = plumber();
    gulp
      .src(fixturesGlob)
      .pipe(mario)
      .pipe(noop())
      .pipe(noop())
      .pipe(lastNoop)
      .on("end", function() {
        t.truthy(lastNoop._plumbed);
        done();
      });
  });
});

test("in flowing mode", (t) => {
  return new Promise((done) => {
    var lastNoop = noop();
    var mario = plumber();
    gulp
      .src(fixturesGlob)
      .pipe(mario)
      .on("data", function(file) {
        t.truthy(file);
      })
      .pipe(noop())
      .pipe(noop())
      .pipe(lastNoop)
      .on("end", function() {
        t.truthy(lastNoop._plumbed);
        done();
      });
  });
});
