import { convert } from "https://deno.land/x/nodedeno@v0.2.0/mod.js";

//Convert the code
await convert({
  src: "postcss-import",
  input: [
    "lib",
    // "test",
    "index.js",
  ],
  output: "deno",
  depsFiles: {
    "": "deps.js",
    // "test": "test/deps.js",
  },
  copy: {
    "deps.js": "deps.js",
    // "test_deps.js": "test/deps.js",
    // "postcss-import/test/fixtures": "test/fixtures",
    // "postcss-import/test/node_modules": "test/node_modules",
    // "postcss-import/test/shared_modules": "test/shared_modules",
    // "postcss-import/test/sourcemap": "test/sourcemap",
    // "postcss-import/test/web_modules": "test/web_modules",
  },
  ignoredFiles: [
    "test/custom-syntax-parser.js",
    "test/order.js",
    "test/media.js",
    "test/plugins.js",
    // "test/import.js",
    "test/resolve.js",
    "test/custom-resolve.js",
    "test/filter.js",
    "test/custom-load.js",
    "test/import-events.js",
    "test/lint.js",
    "test/syntax-error.js",
  ],
  modules: {
    "": "mod.js",
  },
  beforeConvert(src) {
    rename(src, "index.js", "mod.js");

    replace(
      src,
      "lib/process-content.js",
      (code) =>
        code.replace(`// placeholder tooling\nlet sugarss`, "")
          .replace(
            `if (!sugarss) {\n      try {\n        sugarss = require("sugarss")\n      } catch {} // Ignore\n    }\n    if (sugarss) return runPostcss(content, filename, plugins, [sugarss])`,
            `throw new Error("SugarSS not supported");`,
          ),
    );

    replace(
      src,
      "test/import.js",
      (code) =>
        code.replace(
          `process.platform === "win32"`,
          `Deno.build.os === "windows"`,
        ),
    );

    for (const filename of src.keys()) {
      if (filename.match(/test\/[\w-]+\.js/)) {
        rename(src, filename, filename.replace(".js", ".test.js"));
      }
    }
  },
});

function rename(src, from, to) {
  if (!src.has(from)) {
    return;
  }

  src.set(to, src.get(from));
  src.delete(from);
}

function replace(src, file, cb) {
  if (!src.has(file)) {
    return;
  }

  const code = cb(src.get(file));
  src.set(file, code);
}
