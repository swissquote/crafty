> This preset isn't working for the moment, do not use it.

### Polyfills

Some features are supported in the new EcmaScript specifications, but compiling
them is not enough, you need a runtime code to actually use them.

We provide polyfills that are required to run EcmaScript 2015 features on the
majority of browsers.

* `promise` a default implementation that allows you to use promises out of the
  box.
* `Object.assign`. This will patch it for buggy browsers or polyfill it when not
  existent.
* `Array.from`. Necessary some destructuring features
* `Array.prototype.@@iterator`. Necessary for arrays support in for..of loops
* `Symbol`. Necessary for Iterators and for..of loops

We don't include more polyfills because this would create packages that are too
big. (100 KB before you add a single line of code.) In the future we will add a
way to declare which polyfills you want to add in your project or provide a
hosted "Polyfill as a service" server.
