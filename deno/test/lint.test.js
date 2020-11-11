import { assertEquals } from "./deps.js";
import { postcss } from "../lib/deps.js";
import atImport from "../mod.js";

const processor = postcss().use(atImport());

Deno.test("should warn when not @charset and not @import statement before", () => {
  return Promise.all([
    processor.process(`a {} @import "";`, { from: undefined }),
    processor.process(`@media {} @import "";`, { from: undefined }),
  ]).then((results) => {
    results.forEach((result) => {
      const warnings = result.warnings();
      assertEquals(warnings.length, 1);
      assertEquals(
        warnings[0].text,
        "@import must precede all other statements (besides @charset)",
      );
    });
  });
});

Deno.test("should warn about all imports after some other CSS declaration", () => {
  return processor
    .process(
      `
        a {}
        @import "a.css";
        @import "b.css";
      `,
      { from: undefined },
    )
    .then((result) => {
      result.warnings().forEach((warning) => {
        assertEquals(
          warning.text,
          "@import must precede all other statements (besides @charset)",
        );
      });
    });
});

Deno.test("should not warn if comments before @import", () => {
  return processor
    .process(`/* skipped comment */ @import "";`, { from: undefined })
    .then((result) => {
      const warnings = result.warnings();
      assertEquals(warnings.length, 1);
      assertEquals(warnings[0].text, `Unable to find uri in '@import ""'`);
    });
});

Deno.test("should warn if something before comments", (t) => {
  return processor
    .process(`a{} /* skipped comment */ @import "";`, { from: undefined })
    .then((result) => {
      assertEquals(result.warnings().length, 1);
    });
});

Deno.test("should not warn when @charset or @import statement before", () => {
  return Promise.all([
    processor.process(`@import "bar.css"; @import "bar.css";`, {
      from: "test/fixtures/imports/foo.css",
    }),
    processor.process(`@charset "bar.css"; @import "bar.css";`, {
      from: "test/fixtures/imports/foo.css",
    }),
  ]).then((results) => {
    results.forEach((result) => {
      assertEquals(result.warnings().length, 0);
    });
  });
});

Deno.test("should warn when a user didn't close an import with ;", () => {
  return processor
    .process(`@import url('http://') :root{}`, { from: undefined })
    .then((result) => {
      const warnings = result.warnings();
      assertEquals(warnings.length, 1);
      assertEquals(
        warnings[0].text,
        "It looks like you didn't end your @import statement correctly. " +
          "Child nodes are attached to it.",
      );
    });
});

Deno.test("should warn on invalid url", () => {
  return processor
    .process(
      `
      @import foo-bar;
      @import ;
      @import '';
      @import "";
      @import url();
      @import url('');
      @import url("");
      `,
      { from: undefined },
    )
    .then((result) => {
      const warnings = result.warnings();
      assertEquals(warnings.length, 7);
      assertEquals(warnings[0].text, `Unable to find uri in '@import foo-bar'`);
      assertEquals(warnings[1].text, `Unable to find uri in '@import '`);
      assertEquals(warnings[2].text, `Unable to find uri in '@import '''`);
      assertEquals(warnings[3].text, `Unable to find uri in '@import ""'`);
      assertEquals(warnings[4].text, `Unable to find uri in '@import url()'`);
      assertEquals(warnings[5].text, `Unable to find uri in '@import url('')'`);
      assertEquals(warnings[6].text, `Unable to find uri in '@import url("")'`);
    });
});

Deno.test("should not warn when a user closed an import with ;", () => {
  return processor
    .process(`@import url('http://');`, { from: undefined })
    .then((result) => {
      assertEquals(result.warnings().length, 0);
    });
});
