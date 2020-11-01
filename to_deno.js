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
    let file = "lib/process-content.js";
    let code = src.get(file);
    code = code.replace(`// placeholder tooling\nlet sugarss`, "");
    code = code.replace(
      `if (!sugarss) {\n      try {\n        sugarss = require("sugarss")\n      } catch (e) {\n        // Ignore\n      }\n    }\n    if (sugarss) return runPostcss(content, filename, plugins, [sugarss])`,
      `throw new Error("SugarSS not supported");`,
    );
    src.set(file, code);

    code = src.get("index.js");
    src.set("mod.js", code);
    src.delete("index.js");
  },
});
