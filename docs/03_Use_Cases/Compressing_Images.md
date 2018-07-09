All websites or webapps today have images. We have a preset in Crafty to handle
compressing images and SVG's optimally for your web needs.

## Installing

```bash
cd src/main/frontend
npm install @swissquote/crafty @swissquote/crafty-preset-images @swissquote/crafty-runner-gulp --save
```

In your `crafty.config.js` file, you must add the following presets

```javascript
module.exports = {
  presets: [
    "@swissquote/crafty-preset-images",
    "@swissquote/crafty-runner-gulp"
  ]
};
```

## Features

### Bitmaps (jpg, png, jpg)

You can drop your images in any sub-folder of `src/main/frontend/images` and it
will copy it over to the destination folder after applying the best possible
compression algorithms to the images

### SVG

There is also an automatic process for SVG that will apply the best possible
compression to your svg source file (remove comments and useless spaces)

## Known issues

- Downloading jpg/png/gif compression tools is done from GitHub directly and
  fails on machines that don't have internet access or a corporate proxy. You
  can use
  [`crafty-preset-images-simple`](05_Packages/05_crafty-preset-images-simple.md)
  instead to work around this issue.
  [`Read More`](05_Packages/05_crafty-preset-images.md)
