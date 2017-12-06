Once `npm install` was executed, you can either do `crafty run` or `crafty
watch`

While developing, prefer `crafty watch`

This will run Crafty in watch mode, in this mode, each change you make to your
files will be detected and the relevant assets will be compiled.

This works with the following :

* A change in a CSS file
* A change in a JavaScript or TypeScript file
* Adding or replacing images
* in any runner (Gulp, Webpack and rollup.js)

It's strongly recommended to let it run in the background in your IDE while
you're developing, it streamlines the process a lot !

## Hot Module Replacement

Hot Module Replacement allows to change the JavaScript on the page without
reloading it.

We provide a documentation on how to get started in a React application.

Read more [here](05_Packages/05_crafty-preset-react.md)
