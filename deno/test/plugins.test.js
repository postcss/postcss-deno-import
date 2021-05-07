import { assertEquals, postcss } from "./deps.js";
import atImport from "../mod.js";
import checkFixture from "./check-fixture.js";

Deno.test("should apply plugins to root", () => {
  const atRules = [];
  const rules = [];
  return checkFixture("plugins", {
    plugins: [
      (css) => {
        css.walk((node) => {
          if (node.type === "rule") {
            rules.push(node.selector);
            if (node.selector === "bar") node.remove();
            else node.selector += "-converted";
          }
          if (node.type === "atrule") atRules.push(node.name);
        });
      },
    ],
  }).then(() => {
    assertEquals(atRules, ["import"]);
    assertEquals(rules, ["foo", "bar"]);
  });
});

Deno.test("should error when value is not an array", () => {
  return postcss()
    .use(atImport({ plugins: "foo" }))
    .process("", { from: undefined })
    .catch((error) =>
      assertEquals(error.message, "plugins option must be an array")
    );
});

Deno.test("should remain silent when value is an empty array", () => {
  return postcss()
    .use(atImport({ plugins: [] }))
    .process("", { from: undefined })
    .then((result) => assertEquals(result.css, ""));
});
