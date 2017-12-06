This module is a crafty preset to compress images if they're svg

Because of corporate proxy issues, this preset exists as a replacement for
[`crafty-preset-images`](./05_crafty-preset-images.md) if you can't install it.

## Installation

```bash
npm install @swissquote/crafty-preset-images-simple --save-dev
```

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-images-simple",
    "@swissquote/crafty-runner-gulp"
  ]
};
```
