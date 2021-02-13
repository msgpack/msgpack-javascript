import { sauceLabs, sauceLaunchers } from "./sauceLabs";
const path = require("path");
const webpack = require("webpack");

// eslint-disable-next-line import/no-default-export
export default function configure(config: any) {
  config.set({
    customLaunchers: {
      ...sauceLaunchers,

      // To debug it wih IE11,
      // Install `karma-virtualbox-ie11-launcher`,
      // and configure custom launchers like this:
      // IE11: {
      //   base: "VirtualBoxIE11",
      //   keepAlive: true,
      //   vmName: "IE11 - Win10",
      // },
    },
    sauceLabs,
    browsers: ["ChromeHeadless", "FirefoxHeadless"],

    basePath: "",
    frameworks: ["mocha"],
    files: ["./test/karma-run.ts"],
    exclude: [],
    preprocessors: {
      "**/*.ts": ["webpack", "sourcemap"],
    },
    reporters: ["dots", "saucelabs"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: 1,
    browserNoActivityTimeout: 60_000,

    webpack: {
      mode: "production",

      resolve: {
        extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".wasm"],
        alias: {
          "@msgpack/msgpack": path.resolve(__dirname, "src"),
        },
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.test-karma.json",
              // FIXME: some types for dependencies cannot be resolved, so ignore type checking for now.
              transpileOnly: true,
            },
          },
        ],
      },
      plugins: [],
      optimization: {
        minimize: false,
      },
      performance: {
        hints: false,
      },
      devtool: "inline-source-map",
    },
    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },
    client: {
      mocha: {
        timeout: 15_000,
      },
    },
  });
}
