// TypeScript 4.3
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#separate-write-types-on-properties
export class SeparateWriteType {
  #size = 0;

  get size(): number {
    return this.#size;
  }

  set size(value: string | number | boolean) {
    const num = Number(value);

    // Don't allow NaN and stuff.
    if (!Number.isFinite(num)) {
      this.#size = 0;
      return;
    }

    this.#size = num;
  }
}

// TypeScript 4.3
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#static-index-signatures
export class StaticIndexSignatures {
  static hello = "hello";
  static world = 1234;
  static [propName: string]: string | number | undefined;
}

// TypeScript 4.3
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the---noimplicitoverride-flag
class SomeComponent {
  show() {
    // Show
  }
  hide() {
    // Hide
  }
}

export class ExplicitOverride extends SomeComponent {
  override show() {
    // ...
  }
  override hide() {
    // ...
  }
}
