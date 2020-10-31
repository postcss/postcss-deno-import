import { extname, join } from "https://deno.land/std/path/mod.ts";
export { default as valueParser } from "https://dev.jspm.io/postcss-value-parser";
export * as path from "https://deno.land/std/node/path.ts";
export * as fs from "https://deno.land/std/node/fs.ts";
export { default as postcss } from "https://deno.land/x/postcss/mod.js";

export function resolve(file, options, cb) {
  if (typeof options === "function") {
    cb = options;
    options = {};
  } else if (!options) {
    options = {};
  }

  const filename = extname(file) ? file : file + ".css";

  let result;

  if (options.paths && options.paths.length) {
    result = join(options.paths[0], filename);
  } else if (options.basedir) {
    result = join(options.basedir, filename);
  } else {
    result = join(Deno.cwd(), filename);
  }

  if (!cb) {
    return Promise.resolve(result);
  }

  cb(null, result);
}

export function readCache(filename) {
  return Deno.readTextFileSync(filename);
}
