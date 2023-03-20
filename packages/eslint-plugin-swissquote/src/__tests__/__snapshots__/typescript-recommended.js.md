# Snapshot report for `src/__tests__/typescript-recommended.js`

The actual snapshot is saved in `typescript-recommended.js.snap`.

Generated by [AVA](https://avajs.dev).

## Warns on console.log

> Snapshot 1

    [
      {
        column: 3,
        endColumn: 14,
        endLine: 5,
        line: 5,
        message: 'Unexpected console statement.',
        messageId: 'unexpected',
        nodeType: 'MemberExpression',
        ruleId: 'no-console',
        severity: 1,
      },
    ]

## Uses sonar plugin

> Snapshot 1

    [
      {
        column: 10,
        endColumn: 22,
        endLine: 3,
        line: 3,
        message: '\'changeWindow\' is defined but never used.',
        messageId: 'unusedVar',
        nodeType: 'Identifier',
        ruleId: '@swissquote/swissquote/@typescript-eslint/no-unused-vars',
        severity: 2,
      },
    ]

## Works with complex types

> Snapshot 1

    []