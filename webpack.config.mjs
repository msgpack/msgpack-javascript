import path from "node:path";
import url from "node:url";
import webpack from "webpack";
import _ from "lodash";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

const config = {
  mode: "production",

  entry: "./src/index.ts",
  target: ["web", "es2020"],
  output: {
    path: path.resolve(dirname, "dist.umd"),
    library: "MessagePack",
    libraryTarget: "umd",
    globalObject: "this",
    filename: undefined,
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
          transpileOnly: true,
          configFile: "tsconfig.dist.webpack.json",
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.TEXT_ENCODING": "undefined",
      "process.env.TEXT_DECODER": "undefined",
    }),
  ],

  optimization: {
    minimize: undefined,
  },

  // We don't need NodeJS stuff on browsers!
  // https://webpack.js.org/configuration/node/
  node: false,

  devtool: "source-map",
};


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
