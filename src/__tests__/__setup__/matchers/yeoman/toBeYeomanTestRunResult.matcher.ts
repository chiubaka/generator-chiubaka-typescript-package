import { RunResult } from "yeoman-test";

export const toBeYeomanTestRunResult = (result: RunResult) => {
  const message = `Expected ${result.toString()} to be a YeomanTest.RunResult`;

  const pass = result.assertJsonFileContent !== undefined;

  return {
    pass,
    message: () => message,
  };
};
