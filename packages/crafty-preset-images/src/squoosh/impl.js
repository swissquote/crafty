/* eslint-disable no-param-reassign */
const { codecs: supportedFormats } = require("./codecs");
const ImageData = require("./image_data");

async function decodeBuffer(_buffer) {
  const buffer = Buffer.from(_buffer);
  const firstChunk = buffer.slice(0, 16);
  const firstChunkString = Array.from(firstChunk)
    .map(v => String.fromCodePoint(v))
    .join("");
  const key = Object.entries(supportedFormats).find(([, { detectors }]) =>
    detectors.some(detector => detector.exec(firstChunkString))
  );
  if (!key) {
    throw Error(`Buffer has an unsupported format`);
  }
  const d = await supportedFormats[key[0]].dec();
  return d.decode(new Uint8Array(buffer));
}

async function encodeJpeg(image, { quality }) {
  image = ImageData.from(image);

  const e = supportedFormats.mozjpeg;
  const m = await e.enc();
  const r = await m.encode(image.data, image.width, image.height, {
    ...e.defaultEncoderOptions,
    quality
  });
  return Buffer.from(r);
}

async function encodeWebp(image, { quality }) {
  image = ImageData.from(image);

  const e = supportedFormats.webp;
  const m = await e.enc();
  const r = await m.encode(image.data, image.width, image.height, {
    ...e.defaultEncoderOptions,
    quality
  });
  return Buffer.from(r);
}

async function encodePng(image) {
  image = ImageData.from(image);

  const e = supportedFormats.oxipng;
  const m = await e.enc();
  const r = await m.encode(image.data, image.width, image.height, {
    ...e.defaultEncoderOptions
  });
  return Buffer.from(r);
}

module.exports = {
  decodeBuffer,
  encodeJpeg,
  encodeWebp,
  encodePng
};
