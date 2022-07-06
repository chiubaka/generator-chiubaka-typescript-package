import YeomanHelpers, { RunResult } from "yeoman-test";

import { DEV_DEPENDENCY_VERSIONS } from "../__tests__/__fixtures__";

describe("TsConfigGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname).run();
  });

  it("creates a tsconfig.json file", () => {
    result.assertFile("tsconfig.json");
  });

  describe("installs dependencies", () => {
    it("adds @chiubaka/tsconfig to package.json", () => {
      expect(result).toHaveDevDependency(
        "@chiubaka/tsconfig",
        DEV_DEPENDENCY_VERSIONS["@chiubaka/tsconfig"]
      );
    });
  });

  describe("tsconfig.json", () => {
    it("extends from @chiubaka/tsconfig", () => {
      result.assertJsonFileContent("tsconfig.json", {
        extends: "@chiubaka/tsconfig/tsconfig.json",
      });
    });
  });
});
