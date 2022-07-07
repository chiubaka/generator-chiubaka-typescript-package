import { RunResult } from "yeoman-test";

export const toHaveDevDependency = (
  result: RunResult,
  dependencyName: string,
  dependencyVersion?: string
) => {
  if (!result.assertJsonFileContent) {
    return {
      pass: false,
      message: () => {
        return `Expected ${result.toString()} to be a YeomanTest.RunResult`;
      },
    };
  }

  const hasPackageJson = result.fs.exists("package.json");

  if (!hasPackageJson) {
    return {
      pass: false,
      message: () => "Expected run result to contain a package.json file",
    };
  }

  const packageJsonString = result.fs.read("package.json");

  const packageJson = JSON.parse(packageJsonString) as Record<string, any>;

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
