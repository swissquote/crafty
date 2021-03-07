const { promises: fsp } = require("fs");
const path = require("path");
const { instantiateEmscriptenWasm, pathify } = require("./emscripten-utils.js");
const { execOnce } = require("./utils.js");

// MozJPEG
const mozEnc = require("./mozjpeg/mozjpeg_node_enc.js");

const mozEncWasm = path.resolve(__dirname, "./mozjpeg/mozjpeg_node_enc.wasm");
const mozDec = require("./mozjpeg/mozjpeg_node_dec.js");

const mozDecWasm = path.resolve(__dirname, "./mozjpeg/mozjpeg_node_dec.wasm");

// WebP
const webpEnc = require("./webp/webp_node_enc.js");

const webpEncWasm = path.resolve(__dirname, "./webp/webp_node_enc.wasm");
const webpDec = require("./webp/webp_node_dec.js");

const webpDecWasm = path.resolve(__dirname, "./webp/webp_node_dec.wasm");

// PNG
const pngEncDec = require("./png/squoosh_png.js");

const pngEncDecWasm = path.resolve(__dirname, "./png/squoosh_png_bg.wasm");
const pngEncDecInit = execOnce(() =>
  pngEncDec.default(fsp.readFile(pathify(pngEncDecWasm)))
);

// OxiPNG
const oxipng = require("./png/squoosh_oxipng.js");

const oxipngWasm = path.resolve(__dirname, "./png/squoosh_oxipng_bg.wasm");
const oxipngInit = execOnce(() =>
  oxipng.default(fsp.readFile(pathify(oxipngWasm)))
);

const ImageData = require("./image_data.js");

global.ImageData = ImageData; // mandatory for wasm binaries

const codecs = {
  mozjpeg: {
    name: "MozJPEG",
    extension: "jpg",
    detectors: [/^\xFF\xD8\xFF/],
    dec: () => instantiateEmscriptenWasm(mozDec, mozDecWasm),
    enc: () => instantiateEmscriptenWasm(mozEnc, mozEncWasm),
    defaultEncoderOptions: {
      quality: 75,
      baseline: false,
      arithmetic: false,
      progressive: true,
      optimize_coding: true,
      smoothing: 0,
      color_space: 3 /*YCbCr*/,
      quant_table: 3,
      trellis_multipass: false,
      trellis_opt_zero: false,
      trellis_opt_table: false,
      trellis_loops: 1,
      auto_subsample: true,
      chroma_subsample: 2,
      separate_chroma_quality: false,
      chroma_quality: 75
    },
    autoOptimize: {
      option: "quality",
      min: 0,
      max: 100
    }
  },
  webp: {
    name: "WebP",
    extension: "webp",
    detectors: [/^RIFF....WEBPVP8[LX ]/],
    dec: () => instantiateEmscriptenWasm(webpDec, webpDecWasm),
    enc: () => instantiateEmscriptenWasm(webpEnc, webpEncWasm),
    defaultEncoderOptions: {
      quality: 75,
      target_size: 0,
      target_PSNR: 0,
      method: 4,
      sns_strength: 50,
      filter_strength: 60,
      filter_sharpness: 0,
      filter_type: 1,
      partitions: 0,
      segments: 4,
      pass: 1,
      show_compressed: 0,
      preprocessing: 0,
      autofilter: 0,
      partition_limit: 0,
      alpha_compression: 1,
      alpha_filtering: 1,
      alpha_quality: 100,
      lossless: 0,
      exact: 0,
      image_hint: 0,
      emulate_jpeg_size: 0,
      thread_level: 0,
      low_memory: 0,
      near_lossless: 100,
      use_delta_palette: 0,
      use_sharp_yuv: 0
    },
    autoOptimize: {
      option: "quality",
      min: 0,
      max: 100
    }
  },
  oxipng: {
    name: "OxiPNG",
    extension: "png",
    // eslint-disable-next-line no-control-regex
    detectors: [/^\x89PNG\x0D\x0A\x1A\x0A/],
    dec: async () => {
      await pngEncDecInit();
      return { decode: pngEncDec.decode };
    },
    enc: async () => {
      await pngEncDecInit();
      await oxipngInit();
      return {
        encode: (buffer, width, height, opts) => {
          const simplePng = pngEncDec.encode(
            new Uint8Array(buffer),
            width,
            height
          );
          return oxipng.optimise(simplePng, opts.level);
        }
      };
    },
    defaultEncoderOptions: {
      level: 2
    },
    autoOptimize: {
      option: "level",
      min: 6,
      max: 1
    }
  }
};

module.exports = {
  codecs
};
