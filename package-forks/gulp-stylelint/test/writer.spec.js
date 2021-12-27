'use strict';

const colors = require('ansi-colors');
const fs = require('fs');
const path = require('path');

const writer = require('../src/writer');

const tmpDir = path.resolve(__dirname, '../tmp');

let spy

beforeEach(() => {
  spy = jest.spyOn(process, 'cwd');
  spy.mockReturnValue(tmpDir);
})

afterEach(() => {
  spy.mockRestore();
})

test('writer should write to cwd if base dir is not specified', () => {
  
  const reportFilePath = path.join(process.cwd(), 'foo.txt');

  expect.assertions(2);

  return writer('footext', 'foo.txt')
    .then(() => {
      expect(
        fs.statSync(reportFilePath).isFile()
      ).toBe(true);
      expect(
        fs.readFileSync(reportFilePath, 'utf8')).toEqual(
        'footext'
      );
    })
    .catch((error) => expect(error).toBeUndefined())
    .then(() => {
      
      fs.unlinkSync(reportFilePath);
    });
});

test('writer should write to a base folder if it is specified', () => {
  const reportDirPath = path.join(process.cwd(), 'foodir');
  const reportSubdirPath = path.join(reportDirPath, '/subdir');
  const reportFilePath = path.join(reportSubdirPath, 'foo.txt');

  expect.assertions(2);

  return writer('footext', 'foo.txt', reportSubdirPath)
    .then(() => {
      expect(
        fs.statSync(reportFilePath).isFile()).toBe(true);
      expect(
        fs.readFileSync(reportFilePath, 'utf8')).toEqual(
        'footext'
      );
    })
    .catch((error) => expect(error).toBeUndefined())
    .then(() => {
      fs.unlinkSync(reportFilePath);
      fs.rmdirSync(reportSubdirPath);
      fs.rmdirSync(reportDirPath);
    });
});

test('writer should strip colors from formatted output', () => {
  const reportFilePath = path.join(process.cwd(), 'foo.txt');

  expect.assertions(1);

  return writer(colors.blue('footext'), 'foo.txt')
    .then(() => {
      expect(
        fs.readFileSync(reportFilePath, 'utf8')).toEqual(
        'footext'
      );
    })
    .catch((error) => expect(error).toBeUndefined())
    .then(() => {
      fs.unlinkSync(reportFilePath);
    });
});
