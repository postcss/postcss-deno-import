import { path } from "../lib/deps.js";
import checkFixture from "./check-fixture.js";

Deno.test(`should order nested imports correctly`, () => {
  let first = true;

  return checkFixture("order", {
    path: "test/fixtures/imports",
    resolve: (id) => {
      return new Promise((res) => {
        const doResolve = () => res(path.resolve("test/fixtures/imports", id));

        if (first) {
          // Delay the first import so the second gets loaded first
          setTimeout(doResolve, 100);
          first = false;
        } else doResolve();
      });
    },
  });
});
