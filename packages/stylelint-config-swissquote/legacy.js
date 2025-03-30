import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default {
  extends: [require.resolve("./common.js")],
  rules: {}
};
