/* global it, expect */

const { prepareESLint, lint } = require("../../test_utils");

const engine = prepareESLint("recommended", "node");

it("Doesn't warn on console.log", async () => {
  const result = await lint(engine, `console.log("Yeah");\n`);

  expect(result.messages).toEqual([], "no messages");
  expect(result.warningCount).toBe(0, "no warnings");
  expect(result.errorCount).toBe(0, "no errors");
});

it("Works with ES6", async () => {
  const result = await lint(
    engine,
    `
const something = [];

something.push("a value");

console.log(something);
`
  );

  expect(result.messages).toEqual([], "no messages");
  expect(result.warningCount).toBe(0, "no warnings");
  expect(result.errorCount).toBe(0, "no errors");
});

it("Works with TypeScript", async () => {
  const result = await lint(
    engine,
    `
import useSWROrig from "swr";

export type UnPromisify<T> = T extends Promise<infer U> ? U : T;

export function obviousString(): string {
  const myString: string = "a string";
  console.log(myString);
  return myString;
}

export function useSWR<T, Error = any>(
  url
): {
  data?: T;
  error?: Error;
  revalidate: () => Promise<boolean>;
  isValidating: boolean;
} {
  // Skip it on the server side.
  if (typeof window === undefined) {
    return {
      async revalidate() {
        return true;
      },
      isValidating: true
    };
  }

  return useSWROrig<T, Error>(
    url,
    async (u): Promise<T> => {
      const result = await fetch(u);

      if (result.status == 200) {
        return await result.json();
      }

      throw new Error(result.statusText);
    },
    {}
  );
}
`,
    "utils.ts"
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(0, "no warnings");
  expect(result.errorCount).toBe(4, "no errors");
});
