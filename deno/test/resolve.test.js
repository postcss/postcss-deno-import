import checkFixture from "./check-fixture.js";

Deno.test("should resolve relative to cwd", () =>
  checkFixture("resolve-cwd", {
    path: null,
  }));

Deno.test(`should resolve relative to 'root' option`, () =>
  checkFixture("resolve-root", {
    root: "test/fixtures",
    path: null,
  }));

Deno.test(
  `should resolve relative to postcss 'from' option`,
  () =>
    checkFixture(
      "resolve-from",
      { path: null },
      { from: "test/fixtures/file.css" },
    ),
);

Deno.test(
  `should resolve relative to 'path' which resolved with cwd`,
  () =>
    checkFixture(
      "resolve-path-cwd",
      { path: "test/fixtures/imports" },
    ),
);

Deno.test(
  `should resolve relative to 'path' which resolved with 'root'`,
  () =>
    checkFixture(
      "resolve-path-root",
      { root: "test/fixtures", path: "imports" },
    ),
);
