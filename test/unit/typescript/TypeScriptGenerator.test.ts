import path from "node:path";
import YeomanHelpers, { RunResult } from "yeoman-test";

describe("TypeScriptGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(
      path.join(__dirname, "../../../src/typescript")
    ).run();
  });

  describe("installs required devDependencies", () => {
    it("installs TypeScript", () => {
      expect(result).toHaveDevDependencyWithComment("typescript");
    });
  });

  it("creates a tsconfig.json file", () => {
    result.assertFile("tsconfig.json");
  });

  it("creates a sample TypeScript file", () => {
    result.assertFile("src/hello.ts");
  });
});
