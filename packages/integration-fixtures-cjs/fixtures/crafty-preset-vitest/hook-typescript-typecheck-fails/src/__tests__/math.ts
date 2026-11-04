import { add } from "../math";

test("passes at runtime, but has a type error", () => {
  const sum: string = add(5, 6);

  expect(sum).toBe(11);
});
