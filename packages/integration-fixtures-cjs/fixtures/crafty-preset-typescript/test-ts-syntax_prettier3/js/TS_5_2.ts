// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management
class TempFile implements Disposable {
  #path: string;
  constructor(path: string) {
    this.#path = path;
  }
  // other methods
  [Symbol.dispose]() {
    // Close the file and delete it.
    console.log("Disposing of", this.#path);
  }
}

export function usingDeclaration() {
  using file = new TempFile(".some_temp_file");

  console.log("Got file", file);
}
