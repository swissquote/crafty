const test = require("ava");

const { prepareESLint, lint } = require("../../test_utils");

const engine = prepareESLint("recommended", "node");

test("Doesn't warn on console.log", async t => {
  const result = await lint(engine, `console.log("Yeah");\n`);

  t.is(result.messages.length, 0);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 0);
});

test("Works with ES6", async t => {
  const result = await lint(
    engine,
    `
const something = [];

something.push("a value");

console.log(something);
`
  );

  t.is(result.messages.length, 0);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 0);
});

test("Works with TypeScript", async t => {
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

  t.snapshot(result.messages);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 4);
});
