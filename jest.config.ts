import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["./src/__tests__/__setup__/jest.setup.ts"],
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "(src|generators)/__tests__/(__setup__|__fixtures__)/*",
  ],
};

export default config;
