import { sum, multiply } from "../typescript_sum";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("multiply somethgin", () =>{
  expect(multiply(2, 2)).toBe(4);
} );
