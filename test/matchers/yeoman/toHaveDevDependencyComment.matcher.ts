import { RunResult } from "yeoman-test";

import { RunResultUtils } from "../../utils";

export const toHaveDevDependencyComment = (
  result: RunResult,
  dependencyName: string
) => {
  expect(result).toHavePackageJson();

  const packageJson = RunResultUtils.readPackageJson(result);

  if (packageJson.devDependenciesComments === undefined) {
    return {
      pass: false,
      message: () => {
        return "Expected run result package.json to have a devDependenciesComments key";
      },
    };
  }

  const devDependenciesComments = packageJson.devDependenciesComments as Record<
    string,
    string
  >;

  // eslint-disable-next-line security/detect-object-injection
  const pass = devDependenciesComments[dependencyName] !== undefined;
  const message = `Expected run result package.json to have a devDependency comment for ${dependencyName}`;

  return {
    pass,
    message: () => message,
  };
};
