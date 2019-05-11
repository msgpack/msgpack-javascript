// https://saucelabs.com/platforms

const IS_LOCAL = !!process.env.TRAVIS_BUILD_NUMBER;

export type SauceLauncher = {
  base: "SauceLabs";
  browserName: string;

  platform?: string;
  version?: string;
};

export const sauceLabs = {
  testName: "@msgpack/msgpack unit tests",
  tags: ["msgpack-javascript"],
  recordVideo: IS_LOCAL,
  recordScreenshots: IS_LOCAL,
  browserDisconnectTolerance: 5,

  // Only master branch are logged to the SauceLabs builds, which updates the browser-matrix badge.
  build:
    process.env.TRAVIS_BRANCH === "master" && process.env.TRAVIS_EVENT_TYPE !== "pull_request"
      ? process.env.TRAVIS_BUILD_NUMBER
      : undefined,
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
    browserName: "Firefox",
    version: "latest",
    platform: "Windows 10",
  },
  slSafari: {
    base: "SauceLabs",
    browserName: "Safari",
    version: "latest",
    // "macOS 10.14" is unstable for now
    platform: "macOS 10.13",
  },
  slEdge: {
    base: "SauceLabs",
    browserName: "MicrosoftEdge",
    version: "latest",
    platform: "Windows 10",
  },
  slIE: {
    base: "SauceLabs",
    browserName: "Internet Explorer",
    version: "latest",
    platform: "Windows 10",
  },
};
