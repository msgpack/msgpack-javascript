/* eslint-disable */
// the util module requires process.env
(globalThis as any).process = {
  env: {},
};

(globalThis as any).Buffer = require("buffer").Buffer;

// import "util" first,
// because core-js breaks the util polyfll (https://github.com/browserify/node-util) on IE11.
require("util");

require("core-js");

const testsContext = (require as any).context(".", true, /\.test\.ts$/);

testsContext.keys().forEach(testsContext);
