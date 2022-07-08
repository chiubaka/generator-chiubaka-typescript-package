import YeomanHelpers, { RunResult } from "yeoman-test";

describe("TypeScriptGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname).run();
  });

  describe("installs required devDependencies", () => {
    it("installs TypeScript", () => {
      expect(result).toHaveDevDependency("typescript");
    });
  });

  it("creates a tsconfig.json file", () => {
    result.assertFile("tsconfig.json");
  });

  it("creates a sample TypeScript file", () => {
    result.assertFile("src/hello.ts");
  });
});
