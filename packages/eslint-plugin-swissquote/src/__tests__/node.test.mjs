import test from "node:test";
import { expect } from "expect";
import initSnapshot from "@onigoetz/ntr-expect-snapshot";

import { prepareESLint } from "../../test_utils.js";

initSnapshot(import.meta.url);

const lint = prepareESLint("recommended", "node");

test("Doesn't warn on console.log", async t => {
  const result = await lint(`console.log("Yeah");\n`);

  expect(result.messages.length).toEqual(0);
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(0);
});

test("Works with ES6", async t => {
  const result = await lint(
    `
const something = [];

something.push("a value");

console.log(something);
`
  );

  expect(result.messages.length).toEqual(0);
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(0);
});

test("Works with TypeScript", async t => {
  const result = await lint(
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
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(5);
});
