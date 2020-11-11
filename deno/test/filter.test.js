import checkFixture from "./check-fixture.js";

Deno.test("should filter all imported stylesheets", () =>
  checkFixture("filter-all", {
    filter: () => false,
  }));

Deno.test("should filter some stylesheets", () =>
  checkFixture("filter-some", {
    filter: (url) => url !== "foobar.css",
  }));

Deno.test("shouldn't accept ignored stylesheets", () =>
  checkFixture("filter-ignore", {
    filter: () => true,
  }));
