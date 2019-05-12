import { sauceLabs, sauceLaunchers } from "./sauceLabs";

const webpackConfig = require("./webpack.config.js");

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
    reporters: ["mocha", "saucelabs"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: 1,
    browserNoActivityTimeout: 60_000,

    webpack: {
      mode: "production",

      // Handles NodeJS polyfills
      // https://webpack.js.org/configuration/node
      // Note that the dependencies in https://github.com/webpack/node-libs-browser are sometimes too old.
      node: {
        assert: false,
        util: false,
      },
      resolve: {
        ...webpackConfig.resolve,
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.karma.json",
              // FIXME: some types for dependencies cannot be resolved, so ignore type checking for now.
              transpileOnly: true,
            },
          },
        ],
      },
      optimization: {
        minimize: false,
      },
      performance: {
        maxEntrypointSize: 50 * 1024 ** 2,
        maxAssetSize: 50 * 1024 ** 2,
      },
      devtool: "inline-source-map",
    },
    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },
  });
}
