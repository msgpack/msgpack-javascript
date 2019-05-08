"use strict";

const path = require("path");
const { CheckEsVersionPlugin } = require("@bitjourney/check-es-version-webpack-plugin");
module.exports = {
  mode: "production",

  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist.es5"),
    filename: "msgpack.js",
    libraryTarget: "commonjs",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".wasm"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.dist.webpack.json",
        },
      },
    ],
  },

  // We use webpack just to reduce filesystem accesses
  optimization: {
    noEmitOnErrors: true,
    minimize: false,
  },

  // We don't need NodeJS stuff on browsers!
  // https://webpack.js.org/configuration/node/
  node: false,

  plugins: [
    new CheckEsVersionPlugin({
      esVersion: 5, // for IE11 support
    }),
  ],

  devtool: "source-map",
};
