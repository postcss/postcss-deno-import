import { convert } from "https://deno.land/x/nodedeno@v0.2.4/mod.js";

//Convert the code
await convert({
  src: "postcss-import",
  input: [
    "lib",
    "index.js",
  ],
  output: "deno",
  depsFiles: {
    "": "lib/deps.js",
  },
  copy: {
    "deps.js": "lib/deps.js",
    "test": "test",
    "postcss-import/test/fixtures": "test/fixtures",
    "postcss-import/test/sourcemap": "test/sourcemap",
    "postcss-import/README.md": "README.md",
    "postcss-import/CHANGELOG.md": "CHANGELOG.md",
    "postcss-import/LICENSE": "LICENSE",
  },
  modules: {
    "": "mod.js",
  },
  beforeConvert(src, { rename, replace }) {
    rename("index.js", "mod.js");

    replace(
      "lib/process-content.js",
      (code) =>
        code.replace(`// placeholder tooling\nlet sugarss`, "")
          .replace(
            `if (!sugarss) {\n      try {\n        sugarss = require("sugarss")\n      } catch {} // Ignore\n    }\n    if (sugarss) return runPostcss(content, filename, plugins, [sugarss])`,
            `throw new Error("SugarSS not supported");`,
          ),
    );

    replace(
      "test/import.js",
      (code) =>
        code.replace(
          `process.platform === "win32"`,
          `Deno.build.os === "windows"`,
        ),
    );
  },
});
