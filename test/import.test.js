import { fs, path, postcss } from "../lib/deps.js";
import { assertEquals, assertThrowsAsync } from "./deps.js";
import atImport from "../mod.js";
import checkFixture from "./check-fixture.js";

Deno.test("should import stylsheets", () => checkFixture("simple"));

Deno.test("should not import a stylsheet twice", () =>
  checkFixture("no-duplicate"));

Deno.test("should be able to import a stylsheet twice", () =>
  checkFixture("duplicates", {
    skipDuplicates: false,
  }));

Deno.test("should import stylsheets with same content", () =>
  checkFixture("same"));

Deno.test("should ignore & adjust external import", () =>
  checkFixture("ignore"));

Deno.test("should not fail with only one absolute import", () => {
  const base = "@import url(http://)";
  return postcss()
    .use(atImport())
    .process(base, { from: undefined })
    .then((result) => {
      assertEquals(result.warnings().length, 0);
      assertEquals(result.css, base);
    });
});

Deno.test("should not fail with absolute and local import", () => {
  return postcss()
    .use(atImport())
    .process(
      "@import url('http://');\n@import 'test/fixtures/imports/foo.css';",
      { from: undefined },
    )
    .then((result) =>
      assertEquals(result.css, "@import url('http://');\nfoo{}")
    );
});

Deno.test("should error when file not found", () => {
  const file = "test/fixtures/imports/import-missing.css";

  assertThrowsAsync(
    postcss()
      .use(atImport())
      .process(fs.readFileSync(file), { from: file }),
  );
});

Deno.test("should contain a correct sourcemap", () => {
  return postcss()
    .use(atImport())
    .process(fs.readFileSync("test/sourcemap/in.css"), {
      from: "test/sourcemap/in.css",
      to: null,
      map: { inline: false },
    })
    .then((result) => {
      assertEquals(
        result.map.toString(),
        fs.readFileSync(
          Deno.build.os === "windows"
            ? "test/sourcemap/out.css.win.map"
            : "test/sourcemap/out.css.map",
          "utf8",
        ).trim(),
      );
    });
});

Deno.test("inlined @import should keep PostCSS AST references clean", () => {
  return postcss()
    .use(atImport())
    .process("@import 'test/fixtures/imports/foo.css';\nbar{}", {
      from: undefined,
    })
    .then((result) => {
      result.root.nodes.forEach((node) =>
        assertEquals(result.root, node.parent)
      );
    });
});

Deno.test(
  "should work with empty files",
  () =>
    checkFixture(
      "empty-and-useless",
      { path: "test/fixtures/imports" },
      null,
      [`${path.resolve("test/fixtures/imports/empty.css")} is empty`],
    ),
);

Deno.test("should work with no styles without throwing an error", () => {
  return postcss()
    .use(atImport())
    .process("", { from: undefined })
    .then((result) => {
      assertEquals(result.warnings().length, 0);
    });
});
