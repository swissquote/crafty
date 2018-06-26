This module is a crafty preset to compress images if they're jpg, png, gif or
svg

## Installation

```bash
npm install @swissquote/crafty-preset-images --save-dev
```

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-images",
    "@swissquote/crafty-runner-gulp"
  ]
};
```

## Behind a corporate proxy

If you are behind a corporate proxy, or your build machine doesn't have internet
access, this preset's dependencies will fail.

### The problem

jpg/png/gif compression tools are not bundled with their NPM packages, but
downloaded from GitHub directly.

### Open issues about that

- https://github.com/imagemin/optipng-bin/issues/71
- https://github.com/imagemin/jpegtran-bin (no open issue, same issue as
  `optipng-bin`)
- https://github.com/imagemin/gifsicle-bin/issues/77

### The alternative

You can use [`crafty-preset-images-simple`](./05_crafty-preset-images-simple.md)
instead that will provide the same feature for SVG, but will copy other images
over to the destination directory.
