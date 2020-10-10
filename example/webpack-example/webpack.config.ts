const path = require("path");
const webpack = require("webpack");
const _  = require("lodash");

const config = {
  mode: "production",

  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: undefined, // will be set later
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
          configFile: "tsconfig.json",
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "process.env.TEXT_ENCODING": "undefined",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "process.env.TEXT_DECODER": "undefined",
    }),
  ],

  optimization: {
    noEmitOnErrors: true,
    minimize: false,
  },

  // We don't need NodeJS stuff on browsers!
  // https://webpack.js.org/configuration/node/
  node: false,

  devtool: "source-map",
};

module.exports = [
  ((config) => {
    config.output.filename = "bundle.min.js";
    config.optimization.minimize = true;
    return config;
  })(_.cloneDeep(config)),

  ((config) => {
    config.output.filename = "bundle.js";
    config.optimization.minimize = false;
    return config;
  })(_.cloneDeep(config)),
];
