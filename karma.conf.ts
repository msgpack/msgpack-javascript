import { sauceLabs, sauceLaunchers, SauceLauncher } from "./sauceLabs";

const webpackConfig = require("./webpack.config.js");

export default function configure(config: any) {
  const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
  const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;

  const browsers = config.browsers;
  const customLaunchers: Record<string, SauceLauncher> = {};
  if (process.env.SAUCELABS === "true") {
    if (!(SAUCE_USERNAME && SAUCE_ACCESS_KEY)) {
      throw new Error("Missing SAUCE_USER or SAUCE_ACCESS_KEY");
    } else {
      Object.assign(customLaunchers, sauceLaunchers);

      browsers.length = 0;
      browsers.push(...Object.keys(customLaunchers));

      // eslint-disable-next-line no-console
      console.log("Setup launchers for SauceLabs", customLaunchers);
    }
  }

  config.set({
    browsers,
    customLaunchers,
    sauceLabs,

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
        alias: {
          assert$: "assert/assert.js",
        },
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
