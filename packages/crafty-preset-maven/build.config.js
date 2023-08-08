import { getExternals } from "../../utils/externals.js";

export default [
  (builder) =>
    builder("index").options({esm: true}).externals({
      ...getExternals(),
    }),
];
