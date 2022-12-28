import * as path from "node:path";
import * as url from "node:url";

import webpack from "webpack";
import _ from "lodash";
// @ts-expect-error
import { CheckEsVersionPlugin } from "@bitjourney/check-es-version-webpack-plugin";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const config = {
  mode: "production",

  entry: "./src/index.mts",
  target: ["web", "es5"],
  output: {
    path: path.resolve(__dirname, "dist.es5+umd"),
    library: "MessagePack",
    libraryTarget: "umd",
    globalObject: "this",
    filename: undefined, // filled later
  },
  resolve: {
    extensions: [".mts", ".ts", ".tsx", ".mjs", ".js", ".json", ".wasm"],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
     },
  },
  module: {
    rules: [
      {
        test: /\.m?tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.dist.webpack.json",
        },
      },
    ],
  },

  plugins: [
    new CheckEsVersionPlugin({
      esVersion: 5, // for IE11 support
    }),
    new webpack.DefinePlugin({
      "process.env.TEXT_ENCODING": "undefined",
      "process.env.TEXT_DECODER": "undefined",
    }),
  ],

  optimization: {
    minimize: undefined, // filled later
  },

  // We don't need NodeJS stuff on browsers!
  // https://webpack.js.org/configuration/node/
  node: false,

  devtool: "source-map",
};

// eslint-disable-next-line import/no-default-export
export default [
  ((config) => {
    config.output.filename = "msgpack.min.js";
    config.optimization.minimize = true;
    return config;
  })(_.cloneDeep(config)),

  ((config) => {
    config.output.filename = "msgpack.js";
    config.optimization.minimize = false;
    return config;
  })(_.cloneDeep(config)),
];
