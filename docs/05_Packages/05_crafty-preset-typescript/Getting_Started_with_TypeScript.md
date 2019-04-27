Like for an EcmaScript 2015 bundle, you must set `webpack: true` in your `crafty.config.js` for your bundle.

## Prerequisite

To make the compilation work with TypeScript, you need to add a `tsconfig.json` file at the root of your project with the following content.

```json
{
  "exclude": ["node_modules", "node"],
  "compilerOptions": {
    "moduleResolution": "node",
    "charset": "UTF-8",
    "jsx": "react",
    "module": "esnext", // Enables Tree shaking for Webpack and rollup.js
    "sourceMap": true,
    "target": "es5",
    "lib": ["DOM", "ES2017", "DOM.Iterable", "ScriptHost"] // Makes it easier to write ES6, be careful to include mixins accordingly.
  }
}
```

[All configuration options](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

### If you plan to create a library

You can ask TypeScript to also export all Type definitions along with the code, this is how you do it:

```json
{
  "compilerOptions": {
    "declaration": true
  }
}
```

> Note that if you use Webpack, requesting the creation of declaration disables an internal 
> optimization that uses workers to check the validity of your TypeScript files.
> So make sure that you actually need declarations as they have a non-negligible generation cost.

## Most basic example

Create a bundle like this:

```javascript
{
    yourBundleName: {
        webpack: true,
        source: "js/main.ts"
    }
}
```

Then create a `js/main.ts` file with the following content

```typescript
interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

var user = { firstName: "Jane", lastName: "User" };

console.log(greeter(user));
```

When running Gulp, you will get your compiled TypeScript file in `js/yourBundleName.min.js`

[More features](TypeScript_Features.md)

## Using Typings

To leverage external libraries in your project, you need to configure TypeScript to be able to read your definition files.

If you use Typings from the `@types` scoped packages you don't need this configuration.

But for the definitions downloaded with `typings` or your own, you need to tell TypeScript to load them.

for this, you need to create a `tsconfig.json` next to your `crafty.config.js` and add a `"files"` array inside.

```json
{
  "files": ["./typings/index.d.ts"]
}
```

[Read more about Typings](TypeScript_Typings.md)
