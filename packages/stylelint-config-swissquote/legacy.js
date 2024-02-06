import { fileURLToPath } from "url";
import path from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default {
  extends: [path.join(__dirname, "common.js")],
  rules: {}
};
