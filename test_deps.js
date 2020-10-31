import * as asserts from "https://deno.land/std/testing/asserts.ts";
export * from "../deps.js";

export { readFileSync } from "https://deno.land/std/node/fs.ts";

export function test(name, fn) {
  Deno.test(name, () => fn(asserts));
}
