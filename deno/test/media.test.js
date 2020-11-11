import checkFixture from "./check-fixture.js";

Deno.test(
  "should resolve media queries of import statements",
  () => checkFixture("media-import"),
);

Deno.test("should resolve media queries", () => checkFixture("media-query"));

Deno.test(
  "should resolve content inside import with media queries",
  () => checkFixture("media-content"),
);

Deno.test("should join correctly media queries", () =>
  checkFixture("media-join"));
