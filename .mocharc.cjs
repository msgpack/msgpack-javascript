'use strict';

require("ts-node/register");
require("tsconfig-paths/register");

module.exports = {
  diff: true,
  extension: ['mts'],
  package: '../package.json',
  timeout: 10000,

  "node-option": [
    "loader=ts-node/esm",
  ],
};
