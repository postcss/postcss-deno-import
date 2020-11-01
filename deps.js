import {
  extname,
  join,
  resolve as pathResolve,
} from "https://deno.land/std/path/mod.ts";
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

  let result;

  if (options.paths && options.paths.length) {
    result = join(options.paths[0], file);
  } else if (options.basedir) {
    result = join(options.basedir, file);
  } else {
    result = join(Deno.cwd(), file);
  }

  if (!extname(result)) {
    try {
      const info = Deno.statSync(result);

      if (info.isDirectory) {
        result = join(result, "index.css");
      }
    } catch (err) {
      result = `${result}.css`;
    }
  }

  if (!cb) {
    return Promise.resolve(result);
  }

  cb(null, result);
}

const cache = new Map();

export async function readCache(filename) {
  filename = pathResolve(filename);

  try {
    const stats = await Deno.stat(filename);
    const item = cache.get(filename);

    if (item && item.mtime.getTime() === stats.mtime.getTime()) {
      return item.content;
    }

    const content = await Deno.readTextFile(filename);

    cache.set(filename, {
      mtime: stats.mtime,
      content,
    });

    return content;
  } catch (err) {
    return Promise.reject(new Error(filename));
  }
}
