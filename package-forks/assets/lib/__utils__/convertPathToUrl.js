import { sep } from "node:path";

export default function convertPathToUrl(path) {
  return path.split(sep).join("/");
}
