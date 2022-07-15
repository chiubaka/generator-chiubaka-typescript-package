import type { Config } from "jest";

const config: Config = {
  coverageDirectory: "<rootDir>/reports/coverage",
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/test/setup/jest.setup.ts"],
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};

export default config;
