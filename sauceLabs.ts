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
  build: process.env.TRAVIS_BUILD_NUMBER,
};

export const sauceLaunchers: Record<string, SauceLauncher> = {
  slChrome: {
    base: "SauceLabs",
    browserName: "chrome",
    version: "latest",
    platform: "Windows 10",
  },
  slFirefox: {
    base: "SauceLabs",
    browserName: "firefox",
    version: "latest",
    platform: "Windows 10",
  },
  slSafari: {
    base: "SauceLabs",
    browserName: "safari",
    version: "latest",
  },
  slIE: {
    base: "SauceLabs",
    browserName: "internet explorer",
    platform: "Windows 10",
    version: "latest",
  },
};
