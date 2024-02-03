import { getExternals } from "../../utils/externals.js";

const externals = {
  // Provided by other Crafty packages
  ...getExternals(),
  stylelint: "stylelint"
};

export default [
  (builder) => builder("@ronilaukkarinen/gulp-stylelint")
      .rspack()
      .esm()
      .package()
      .externals(externals)
];
