import YeomanHelpers, { RunResult } from "yeoman-test";

describe("TypeScriptGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname).run();
  });

  describe("installs necessary dependencies", () => {
    it("installs TypeScript", () => {
      expect(result).toHaveDevDependency("typescript");
    });
  });
});
