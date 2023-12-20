type Colors = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<Colors, string | RGB>;

export const redComponent = palette.red.at(0);
export const greenNormalized = palette.green.toUpperCase();

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#a-nameauto-accessors-in-classes-auto-accessors-in-classes
//TODO :: not supported by swc
//export class Person {
//  accessor name: string;
//  constructor(name: string) {
//    this.name = name;
//  }
//}
