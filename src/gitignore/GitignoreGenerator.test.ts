import YeomanHelpers, { RunResult } from "yeoman-test";

describe("GitignoreGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname).run();
  });

  it("creates a .gitignore file", () => {
    result.assertFile(".gitignore");
  });

  it("includes yarn gitignore rules", () => {
    result.assertFileContent(".gitignore", "yarn");
  });

  it("includes VSCode gitignore rules", () => {
    result.assertFileContent(".gitignore", "vscode");
  });
});
