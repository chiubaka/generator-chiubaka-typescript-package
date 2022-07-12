import { RunResult } from "yeoman-test";

import { RunResultUtils } from "../../../__utils__";

export const toHaveDevDependency = (
  result: RunResult,
  dependencyName: string,
  dependencyVersion?: string
) => {
  expect(result).toHavePackageJson();

  const packageJson = RunResultUtils.readPackageJson(result);

  if (packageJson.devDependencies === undefined) {
    return {
      pass: false,
      message: () => {
        return "Expected run result package.json to have a devDependencies key";
      },
    };
  }

  const devDependencies = packageJson.devDependencies as Record<string, string>;

  const pass = dependencyVersion
    ? // eslint-disable-next-line security/detect-object-injection
      devDependencies[dependencyName] === dependencyVersion
    : // eslint-disable-next-line security/detect-object-injection
      devDependencies[dependencyName] !== undefined;

  let message = `Expected run result package.json to have devDependency ${dependencyName}`;

  if (dependencyVersion) {
    message += ` with version ${dependencyVersion}`;
  }

  return {
    pass,
    message: () => message,
  };
};
