import { RunResult } from "yeoman-test";

export const toHaveDevDependencyWithComment = (
  result: RunResult,
  dependencyName: string,
  dependencyVersion?: string
) => {
  expect(result).toHaveDevDependency(dependencyName, dependencyVersion);
  expect(result).toHaveDevDependencyComment(dependencyName);

  const dependencyDescription = dependencyVersion
    ? `${dependencyName} v${dependencyVersion}`
    : dependencyName;

  return {
    pass: true,
    message: () =>
      `Expected run result package.json to have devDependency ${dependencyDescription} with a comment`,
  };
};
