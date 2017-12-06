
Linting in TypeScript is less advanced than in JavaScript, there are less available rules and features.
This is also less of a problem because the language itself prevents errors with the help of types.

We use [Tslint](https://palantir.github.io/tslint/) to lint our TypeScript code.

## Disable linting on parts of files

There are many ways to disable the linting on the part of a file

- `/* tslint:disable */` - Disable all rules for the rest of the file
- `/* tslint:enable */` - Enable all rules for the rest of the file
- `/* tslint:disable:rule1 rule2 rule3... */` - Disable the listed rules for the rest of the file
- `/* tslint:enable:rule1 rule2 rule3... */` - Enable the listed rules for the rest of the file
- `// tslint:disable-next-line` - Disables all rules for the following line
- `someCode(); // tslint:disable-line` - Disables all rules for the current line
- `// tslint:disable-next-line:rule1 rule2 rule3...` - Disables the listed rules for the next line

## Customize the rules

TSLint [contains many rules](https://palantir.github.io/tslint/rules/).

We created a default set of rules , but if your project wants stricter rules, you can enable them like that in your `crafty.config.js` :

```javascript
module.exports = {
    tslint: {
        rules: {
            "member-access": true
        }
    }
};
```
