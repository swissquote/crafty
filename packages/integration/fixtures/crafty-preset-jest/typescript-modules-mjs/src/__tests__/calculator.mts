import { it } from "@jest/globals";
import { doSomeMath } from "../calculator.mjs";
import { add } from "../math.mjs";

// Actual .mjs files should still resolve to mjs
import json5 from "json5/dist/index.mjs";

// Actual .cjs files should still resolve to cjs
import { _ as _interop_require_default } from "@swc/helpers/cjs/_interop_require_default.cjs"

it("adds two numbers", () => {
    expect(add(2,2)).toEqual(4);
});

it("advanced math", () => {
    expect(doSomeMath()).toEqual(6);
});

it("works with imported cjs libs", () => {
    expect(_interop_require_default("boom")).toEqual({default: "boom"});
})

it("works with imported mjs libs", () => {
    expect(json5.parse('{"one": 1}')).toEqual({one: 1});
});