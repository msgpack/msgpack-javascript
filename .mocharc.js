'use strict';

require("ts-node/register");
require("tsconfig-paths/register");

module.exports = {
  diff: true,
  extension: ['ts'],
  package: '../package.json',
  timeout: 10_000,
};
