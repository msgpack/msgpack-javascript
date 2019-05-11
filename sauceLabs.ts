// https://saucelabs.com/platforms

export type SauceLauncher = {
  base: "SauceLabs";
  browserName: string;

  platform?: string;
  version?: string | number;
  deviceName?: string;
};

export const sauceLabs = {
  testName: "@msgpack/msgpack unit tests",
  tags: ["msgpack-javascript"],
  recordVideo: false,
  recordScreenshots: false,
};

export const sauceLaunchers: Record<string, SauceLauncher> = {
  slChrome: {
    base: "SauceLabs",
    browserName: "chrome",
    version: 74,
  },

  // slSafari12: {
  //   base: "SauceLabs",
  //   browserName: "safari",
  //   version: 12,
  // },

  // slFirefox66: {
  //   base: "SauceLabs",
  //   browserName: "firefox",
  //   version: 66,
  // },

  // slIE11: {
  //   base: "SauceLabs",
  //   browserName: "internet explorer",
  //   version: 11,
  // },
};
