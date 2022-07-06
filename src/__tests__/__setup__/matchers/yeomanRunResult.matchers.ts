import { RunResult } from "yeoman-test";

export const yeomanRunResultMatchers = {
  toHaveDevDependency(
    result: RunResult,
    dependencyName: string,
    dependencyVersion: string
  ) {
    if (!result.assertJsonFileContent) {
      return {
        pass: false,
        message: () =>
          `Expected ${result.toString()} to be YeomanTest.RunResult`,
      };
    }

    let message = `Expected ${result.toString()} to have devDependency ${dependencyName} with version ${dependencyVersion}`;

    try {
      result.assertJsonFileContent("package.json", {
        devDependencies: {
          [dependencyName]: dependencyVersion,
        },
      });

      return {
        pass: true,
        message: () => message,
      };
    } catch (error: any) {
      if (typeof error === "string") {
        message = error;
      }
      if (error instanceof Error) {
        message = error.message;
      }

      return {
        pass: false,
        message: () => message,
      };
    }
  },
};
