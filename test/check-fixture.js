import { assertEquals } from "./deps.js";
import { fs, postcss } from "../lib/deps.js";
import atImport from "../mod.js";

function read(name, ext) {
  ext = ext || ".css";
  return fs.readFileSync(`test/fixtures/${name}${ext}`, "utf8");
}

export default async function (file, opts, postcssOpts, warnings = []) {
  opts = { path: "test/fixtures/imports", ...opts };
  postcssOpts = { from: undefined, ...postcssOpts };

  if (typeof file === "string") {
    file = { name: file, ext: ".css" };
  }

  const { name, ext } = file;
  const result = await postcss(atImport(opts)).process(
    read(name, ext),
    postcssOpts || {},
  );
  const expected = read(`${name}.expected`);

  assertEquals(result.css, expected);

  result.warnings().forEach((warning, index) => {
    assertEquals(
      warning.text,
      warnings[index],
      `unexpected warning: "${warning.text}"`,
    );
  });
}
