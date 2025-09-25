import { getExternals } from "../../utils/externals.js";

const externals = {
  // Provided by other Crafty packages
  ...getExternals(true),
};

export default [
  (builder) => builder("gulp-stylelint-esm")
      .esm()
      .package()
      .externals(externals),
  (builder) => builder("stylelint-sarif-formatter")
      .esm()
      .package()
      .externals(externals)
];
