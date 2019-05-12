// import "util" first,
// because core-js breaks the util polyfll (https://github.com/browserify/node-util) on IE11.
import "util";

import "core-js";

const testsContext = (require as any).context(".", true, /\.test\.ts$/);

testsContext.keys().forEach(testsContext);
