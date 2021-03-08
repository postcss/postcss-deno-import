// builtin tooling
import { path } from "./deps.js";

// external tooling
import { postcss } from "./deps.js";

export default function processContent(result, content, filename, options) {
  const { plugins } = options;
  const ext = path.extname(filename);

  const parserList = [];

  // SugarSS support:
  if (ext === ".sss") {
    throw new Error("SugarSS not supported");
  }

  // Syntax support:
  if (result.opts.syntax && result.opts.syntax.parse) {
    parserList.push(result.opts.syntax.parse);
  }

  // Parser support:
  if (result.opts.parser) parserList.push(result.opts.parser);
  // Try the default as a last resort:
  parserList.push(null);

  return runPostcss(content, filename, plugins, parserList);
}

function runPostcss(content, filename, plugins, parsers, index) {
  if (!index) index = 0;
  return postcss(plugins)
    .process(content, {
      from: filename,
      parser: parsers[index],
    })
    .catch((err) => {
      // If there's an error, try the next parser
      index++;
      // If there are no parsers left, throw it
      if (index === parsers.length) throw err;
      return runPostcss(content, filename, plugins, parsers, index);
    });
}
