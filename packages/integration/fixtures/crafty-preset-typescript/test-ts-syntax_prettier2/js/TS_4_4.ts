// TypeScript 4.4

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html#static-blocks-in-classes
export class StaticClassBlock {
  static count = 0;

  // This is a static block:
  static {
    if (StaticClassBlock.count === 0) {
      StaticClassBlock.count++;
    }
  }
}
