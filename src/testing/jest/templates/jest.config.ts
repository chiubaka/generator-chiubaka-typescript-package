import type { Config } from "jest";

const config: Config = {
  coverageDirectory: "<rootDir>/reports/coverage",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};

export default config;
