import {
  extname,
  join,
  resolve as pathResolve,
} from "https://deno.land/std/path/mod.ts";
export { default as valueParser } from "https://dev.jspm.io/postcss-value-parser";
export * as path from "https://deno.land/std/node/path.ts";
export * as fs from "https://deno.land/std/node/fs.ts";
export { default as postcss } from "https://deno.land/x/postcss/mod.js";

export function resolve(id, options, cb) {
  options.paths = options.paths || [];

  const file = checkFile(id, options.basedir);

  if (file) {
    return cb(null, file);
  }

  for (const path of options.paths) {
    const file = checkFile(id, path);

    if (file) {
      return cb(null, file);
    }
  }

  for (const moduleDir of options.moduleDirectory) {
    const file = checkFile(id, join(options.basedir, moduleDir));

    if (file) {
      return cb(null, file);
    }
  }

  cb(`${id} not resolved`);
}

function checkFile(id, directory) {
  let file = join(directory, id);

  try {
    const info = Deno.statSync(file);

    if (info.isDirectory) {
      file = join(file, "index");
    } else {
      return file;
    }
  } catch (err) {
    if (extname(file)) {
      return false;
    }
  }

  file = `${file}.css`;

  try {
    const info = Deno.statSync(file);

    if (info.isFile) {
      return file;
    }
  } catch (err) {
    return false;
  }
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
