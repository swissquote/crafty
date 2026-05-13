import { statSync } from "node:fs";

export default function generateFileUniqueId(resolvedPath) {
  const { mtime } = statSync(resolvedPath);
  return mtime.getTime().toString(16);
}
