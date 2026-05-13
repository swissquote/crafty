import fs from "node:fs";

export default async function exists(filePath) {
  return fs.promises.stat(filePath).then(
    () => true,
    () => false
  );
}
