# Snapshot report for `src/__tests__/typescript-format-prettier3.js`

The actual snapshot is saved in `typescript-format-prettier3.js.snap`.

Generated by [AVA](https://avajs.dev).

## Fails on badly formatted TypeScript code

> Snapshot 1

    [
      {
        column: 33,
        endColumn: 35,
        endLine: 1,
        fix: {
          range: [
            32,
            34,
          ],
          text: '',
        },
        line: 1,
        message: 'Delete `··`',
        messageId: 'delete',
        nodeType: null,
        ruleId: '@swissquote/swissquote/prettier/prettier',
        severity: 2,
      },
      {
        column: 1,
        endColumn: 2,
        endLine: 3,
        fix: {
          range: [
            99,
            100,
          ],
          text: '',
        },
        line: 3,
        message: 'Delete `·`',
        messageId: 'delete',
        nodeType: null,
        ruleId: '@swissquote/swissquote/prettier/prettier',
        severity: 2,
      },
      {
        column: 1,
        endColumn: 3,
        endLine: 8,
        fix: {
          range: [
            208,
            210,
          ],
          text: '',
        },
        line: 8,
        message: 'Delete `··`',
        messageId: 'delete',
        nodeType: null,
        ruleId: '@swissquote/swissquote/prettier/prettier',
        severity: 2,
      },
      {
        column: 7,
        endColumn: 9,
        endLine: 14,
        fix: {
          range: [
            372,
            374,
          ],
          text: '',
        },
        line: 14,
        message: 'Delete `··`',
        messageId: 'delete',
        nodeType: null,
        ruleId: '@swissquote/swissquote/prettier/prettier',
        severity: 2,
      },
      {
        column: 18,
        endColumn: 28,
        endLine: 17,
        fix: {
          range: [
            457,
            467,
          ],
          text: 'taskName',
        },
        line: 17,
        message: 'Replace `·taskName·` with `taskName`',
        messageId: 'replace',
        nodeType: null,
        ruleId: '@swissquote/swissquote/prettier/prettier',
        severity: 2,
      },
    ]

## Works with complex types

> Snapshot 1

    []

## Works with recent TypeScript features

> Snapshot 1

    []
