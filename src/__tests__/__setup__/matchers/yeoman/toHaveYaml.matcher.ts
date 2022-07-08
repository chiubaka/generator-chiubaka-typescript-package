import yaml from "js-yaml";
import { RunResult } from "yeoman-test";

export const toHaveYaml = (
  result: RunResult,
  filePath: string,
  matchObject: Record<string, any>
) => {
  expect(result).toBeYeomanTestRunResult();

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const hasFile = result.fs.exists(filePath);

  if (!hasFile) {
    return {
      pass: false,
      message: () => {
        return `Expected run result to have a ${filePath} file`;
      },
    };
  }

  const contents = result.fs.read(filePath);
  const loadedObject = yaml.load(contents) as Record<string, any>;

  expect(loadedObject).toMatchObject(matchObject);

  const matchObjectString = JSON.stringify(matchObject, undefined, 4);

  return {
    pass: true,
    message: () =>
      `Expected run result to have a ${filePath} containing ${matchObjectString}`,
  };
};
