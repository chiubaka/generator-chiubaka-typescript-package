import path from "node:path";
import YeomanHelpers, { RunResult } from "yeoman-test";

describe("TsConfigGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(
      path.join(__dirname, "../../../src/typescript/tsconfig")
    ).run();
  });

  it("creates a tsconfig.json file", () => {
    result.assertFile("tsconfig.json");
  });

  describe("installs dependencies", () => {
    it("adds @chiubaka/tsconfig to package.json", () => {
      expect(result).toHaveDevDependencyWithComment("@chiubaka/tsconfig");
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
