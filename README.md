# Postcss-import for Deno

Scripts to transform the source code of postcss-import plugin for Deno compatibility.

```sh
sh run.sh
```

To import Postcss in your Deno project:

```js
import postcss from "https://deno.land/x/postcss/mod.js";
import postcssImport from "https://deno.land/x/postcss-import/mod.js";

const result = await postcss([postcssImport]).process(css);
```
