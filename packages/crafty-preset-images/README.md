This module is a crafty preset to compress images if they're webp, jpg, png, gif or
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

## WebAssembly

Starting with version 1.14 of Crafty, this preset comes bundled with WebAssembly versions of the various tools used for image reduction.
This means that they don't need to be downloaded from the internet and thus will work in any environment even behind a Corporate Proxy.

Currently we embed the binaries for PNG, JPEG and WEBP.
GIF has no binary for the moment (it will just copy the files without compressing them)
SVG is handled through a different system

The binaries are taken from https://github.com/GoogleChromeLabs/squoosh/tree/dev/codecs by using the same technique as https://github.com/vercel/next.js/tree/v10.0.8/packages/next/next-server/server/lib/squoosh.
