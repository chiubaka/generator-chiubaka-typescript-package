import { RunResult } from "yeoman-test";

export const toHavePackageJson = (result: RunResult) => {
  expect(result).toBeYeomanTestRunResult();

  const hasPackageJson = result.fs.exists("package.json");

  const message = "Expected run result to contain a package.json file";

  return {
    pass: hasPackageJson,
    message: () => message,
  };
};
