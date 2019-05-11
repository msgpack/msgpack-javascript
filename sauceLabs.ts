// https://saucelabs.com/platforms

export type SauceLauncher = {
  base: "SauceLabs";
  browserName: string;

  platform?: string;
  version?: string;
  deviceName?: string;
};

export const sauceLabs = {
  testName: "@msgpack/msgpack unit tests",
  tags: ["msgpack-javascript"],
  recordVideo: true,
  recordScreenshots: true,
  maxDuration: 120,
};

export const sauceLaunchers: Record<string, SauceLauncher> = {
  slChrome: {
    base: "SauceLabs",
    browserName: "chrome",
    version: "latest",
    platform: "Windows 10",
  },
  // slFirefox66: {
  //   base: "SauceLabs",
  //   browserName: "firefox",
  //   version: "latest",
  //   platform: "Windows 10",
  // },

  // TODO: Something's wrong?
  // slSafari12: {
  //   base: "SauceLabs",
  //   browserName: "safari",
  //   version: "12.0",
  // },

  // TODO: Requires commonjs-assert 2.0 with downlevel compilation
  // https://github.com/browserify/commonjs-assert/pull/44/files#r283082666
  // slIE11: {
  //   base: "SauceLabs",
  //   browserName: "internet explorer",
  //   platform: "Windows 10",
  //   version: "11.285",
  // },
};
