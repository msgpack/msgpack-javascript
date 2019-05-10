const webpackConfig = require("./webpack.config.js");

export default function configure(config: any) {
  config.set({
    browsers: ["FirefoxHeadless", "ChromeHeadless"],

    basePath: "",
    frameworks: ["mocha"],
    files: ["./test/karma-run.ts"],
    exclude: [],
    preprocessors: {
      "**/*.ts": ["webpack", "sourcemap"],
    },
    reporters: ["mocha"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: 2,

    webpack: {
      mode: "development",
      node: {
        assert: false,
        util: false,
        buffer: false,
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
              transpileOnly: true,
            },
          },
        ],
      },
      optimization: {
        minimize: false,
      },
      devtool: "inline-source-map",
    },
    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },
  });
}
