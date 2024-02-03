import { getExternals } from "../../utils/externals.js";

export default [
  (builder) =>
    builder("index").esm().externals({
      ...getExternals(),
    }),
];
