// https://saucelabs.com/platforms

const IS_LOCAL = !process.env["TRAVIS_BUILD_NUMBER"];

export type SauceLauncher = {
  base: "SauceLabs";
  browserName: string;
  platformName?: string;

  // for PC
  browserVersion?: string;

  // for mobile
  deviceOrientation?: string,
  deviceName?: string;
  appiumVersion?: string;
  platformVersion?: string;
};

export const sauceLabs = {
  testName: "@msgpack/msgpack unit tests",
  tags: ["msgpack-javascript"],
  recordVideo: IS_LOCAL,
  recordScreenshots: IS_LOCAL,
  browserDisconnectTolerance: 5,

  // Only master branch are logged to the SauceLabs builds, which updates the browser-matrix badge.
  build:
    process.env["TRAVIS_BRANCH"] === "master" && process.env["TRAVIS_EVENT_TYPE"] !== "pull_request"
      ? process.env["TRAVIS_BUILD_NUMBER"]
      : undefined,
};

export const sauceLaunchers: Record<string, SauceLauncher> = {
  slChrome: {
    base: "SauceLabs",
    browserName: "chrome",
    browserVersion: "latest",
    platformName: "Windows 10",
  },
  slFirefox: {
    base: "SauceLabs",
    browserName: "Firefox",
    browserVersion: "latest",
    platformName: "Windows 10",
  },
  slSafari: {
    base: "SauceLabs",
    browserName: "Safari",
    browserVersion: "latest",
    platformName: "macOS 10.15",
  },
  slEdge: {
    base: "SauceLabs",
    browserName: "MicrosoftEdge",
    browserVersion: "latest",
    platformName: "Windows 10",
  },
  slIE: {
    base: "SauceLabs",
    browserName: "Internet Explorer",
    browserVersion: "11.285",
    platformName: "Windows 10",
  },

  slIos: {
    base: "SauceLabs",
    browserName: "Safari",
    platformName: "iOS",
    platformVersion: "13.4",
    deviceName: "iPhone Simulator",
  },

  slAndroid: {
    base: "SauceLabs",
    browserName: "Chrome",
    platformName: "Android",
    platformVersion: "11.0",
    deviceName: "Android GoogleAPI Emulator",
  },
};
