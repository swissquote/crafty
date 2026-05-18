import fs from "node:fs";

export default function defaultCachebuster(resolvedPath) {
  const mtime = fs.statSync(resolvedPath).mtime;
  return mtime.getTime().toString(16);
}
