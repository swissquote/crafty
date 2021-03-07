const ImageData = require("./image_data");

async function decodeBuffer(worker, buffer) {
  return ImageData.from(await worker.decodeBuffer(buffer));
}

async function encodeJpeg(worker, image, { quality }) {
  const o = await worker.encodeJpeg(image, { quality });
  return Buffer.from(o);
}

async function encodeWebp(worker, image, { quality }) {
  const o = await worker.encodeWebp(image, { quality });
  return Buffer.from(o);
}

async function encodePng(worker, image) {
  const o = await worker.encodePng(image);
  return Buffer.from(o);
}

module.exports = {
  decodeBuffer,
  encodeJpeg,
  encodeWebp,
  encodePng
};
