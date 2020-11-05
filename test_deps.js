import * as asserts from "https://deno.land/std/testing/asserts.ts";
export * from "../deps.js";

export { readFileSync } from "https://deno.land/std/node/fs.ts";

const t = { ...asserts };
t.is = asserts.equal;

export function test(name, fn, ...args) {
  Deno.test({
    fn: () => fn(t, ...args),
    name,
    sanitizeOps: true,
    sanitizeResources: true,
  });
}
