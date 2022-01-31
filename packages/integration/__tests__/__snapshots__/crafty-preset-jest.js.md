# Snapshot report for `__tests__/crafty-preset-jest.js`

The actual snapshot is saved in `crafty-preset-jest.js.snap`.

Generated by [AVA](https://avajs.dev).

## Succeeds without transpiling

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      PASS src/__tests__/math.js␊
        ✓ adds two numbers (__ms)␊
      ␊
      Test Suites: 1 passed, 1 total␊
      Tests:       1 passed, 1 total␊
      Snapshots:   0 total␊
      Time:        _____s␊
      Ran all test suites.␊
      `,
    }

## Creates IDE Integration files

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      Written jest.config.js␊
      Written .gitignore␊
      `,
    }

> Snapshot 2

    `// This configuration was generated by Crafty␊
    // This file is generated to improve IDE Integration␊
    // You don't need to commit this file, nor need it to run \`crafty test\`␊
    ␊
    module.exports = {␊
        "moduleDirectories": [ /* Ignored paths for diff */ ],␊
        "moduleFileExtensions": [␊
            "js",␊
            "json"␊
        ],␊
        "testPathIgnorePatterns": [␊
            "/node_modules/",␊
            "__PATH__/packages/integration/fixtures/crafty-preset-jest/ide/dist"␊
        ],␊
        "moduleNameMapper": {␊
            "\\\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "__PATH__/packages/crafty-preset-jest/src/file-mock.js",␊
            "\\\\.(css|less|sass|scss)$": "__PATH__/packages/crafty-preset-jest/src/style-mock.js"␊
        },␊
        "bail": true,␊
        "roots": [␊
            "__PATH__/packages/integration/fixtures/crafty-preset-jest/ide"␊
        ],␊
        "transform": {␊
            "[/\\\\\\\\]node_modules[/\\\\\\\\].+\\\\.m?js$": "__PATH__/packages/crafty-preset-jest/src/esm-transformer.js"␊
        },␊
        "globals": {},␊
        "transformIgnorePatterns": [],␊
        "testRegex": "(/__tests__/.*|(\\\\.|/)(test|spec))\\\\.(js)$"␊
    };␊
    `

> Snapshot 3

    `/jest.config.js␊
    `

## Creates IDE Integration files with Babel

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      Written jest.config.js␊
      Written .gitignore␊
      `,
    }

> Snapshot 2

    `// This configuration was generated by Crafty␊
    // This file is generated to improve IDE Integration␊
    // You don't need to commit this file, nor need it to run \`crafty test\`␊
    ␊
    module.exports = {␊
        "moduleDirectories": [ /* Ignored paths for diff */ ],␊
        "moduleFileExtensions": [␊
            "js",␊
            "json"␊
        ],␊
        "testPathIgnorePatterns": [␊
            "/node_modules/",␊
            "__PATH__/packages/integration/fixtures/crafty-preset-jest/ide-babel/dist"␊
        ],␊
        "moduleNameMapper": {␊
            "\\\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "__PATH__/packages/crafty-preset-jest/src/file-mock.js",␊
            "\\\\.(css|less|sass|scss)$": "__PATH__/packages/crafty-preset-jest/src/style-mock.js"␊
        },␊
        "bail": true,␊
        "roots": [␊
            "__PATH__/packages/integration/fixtures/crafty-preset-jest/ide-babel"␊
        ],␊
        "transform": {␊
            "[/\\\\\\\\]node_modules[/\\\\\\\\].+\\\\.m?js$": "__PATH__/packages/crafty-preset-jest/src/esm-transformer.js"␊
        },␊
        "globals": {},␊
        "transformIgnorePatterns": [],␊
        "testRegex": "(/__tests__/.*|(\\\\.|/)(test|spec))\\\\.(js)$"␊
    };␊
    `

## Succeeds with typescript

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      ts-jest[versions] (WARN) Module jest is not installed. If you're experiencing issues, consider installing a supported version (>=27.0.0 <28.0.0-0).␊
      PASS src/__tests__/math.ts␊
        ✓ adds two numbers (__ms)␊
      ␊
      Test Suites: 1 passed, 1 total␊
      Tests:       1 passed, 1 total␊
      Snapshots:   0 total␊
      Time:        _____s␊
      Ran all test suites.␊
      `,
    }

## Succeeds with babel

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      PASS src/__tests__/math.js␊
        ✓ adds two numbers (__ms)␊
      ␊
      Test Suites: 1 passed, 1 total␊
      Tests:       1 passed, 1 total␊
      Snapshots:   0 total␊
      Time:        _____s␊
      Ran all test suites.␊
      `,
    }

## Fails with babel

> Snapshot 1

    {
      status: 1,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      FAIL src/__tests__/math.js␊
        ✕ adds two numbers (__ms)␊
      ␊
        ● adds two numbers␊
      ␊
          expect(received).toEqual(expected) // deep equality␊
      ␊
          Expected: 5␊
          Received: 4␊
      ␊
            3 |␊
            4 | it("adds two numbers", () => {␊
          > 5 |     expect(add(2,2)).toEqual(5);␊
              |                      ^␊
            6 | })␊
      ␊
            ...stacktrace...␊
      ␊
      Test Suites: 1 failed, 1 total␊
      Tests:       1 failed, 1 total␊
      Snapshots:   0 total␊
      Time:        _____s␊
      Ran all test suites.␊
      `,
    }

## Succeeds with babel and React

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      PASS src/__tests__/MyComponent.jsx␊
        <MyComponent />␊
          ✓ renders three <Foo /> components (__ms)␊
          ✓ renders an \`.icon-star\` (__ms)␊
          ✓ renders children when passed in (__ms)␊
        <Counter />␊
          ✓ can render and update a counter (__ms)␊
      ␊
      Test Suites: 1 passed, 1 total␊
      Tests:       4 passed, 4 total␊
      Snapshots:   0 total␊
      Time:        _____s␊
      Ran all test suites.␊
      `,
    }

## Succeeds with esm module

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      PASS src/__tests__/math.js␊
        ✓ adds two numbers (__ms)␊
      ␊
      Test Suites: 1 passed, 1 total␊
      Tests:       1 passed, 1 total␊
      Snapshots:   0 total␊
      Time:        _____s␊
      Ran all test suites.␊
      `,
    }

## Succeeds with esm module and babel

> Snapshot 1

    {
      status: 0,
      stdall: `␊
      [__:__:__] Starting Crafty __version__...␊
      PASS src/__tests__/math.js␊
        ✓ adds two numbers (__ms)␊
      ␊
      Test Suites: 1 passed, 1 total␊
      Tests:       1 passed, 1 total␊
      Snapshots:   0 total␊
      Time:        _____s␊
      Ran all test suites.␊
      `,
    }