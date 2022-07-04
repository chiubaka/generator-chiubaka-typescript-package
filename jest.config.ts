/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
};

export default config;
