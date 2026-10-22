import { imageSizeFromFile } from "image-size/fromFile";
import resolvePath from "./path.js";

export default async function size(to, options) {
  const resolvedPath = await resolvePath(to, options);

  try {
    const { width, height } = await imageSizeFromFile(resolvedPath);
    return { width, height };
  } catch (errInternal) {
    throw new Error(`${errInternal.message}: ${resolvedPath}`);
  }
}
