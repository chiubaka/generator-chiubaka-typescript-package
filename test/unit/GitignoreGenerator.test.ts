import path from "node:path";
import YeomanHelpers, { RunResult } from "yeoman-test";

describe("GitignoreGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(
      path.join(__dirname, "../../src/gitignore")
    ).run();
  });

  it("creates a .gitignore file", () => {
    result.assertFile(".gitignore");
  });

  it("includes macOS gitignore rules", () => {
    result.assertFileContent(".gitignore", "macOS");
  });

  it("includes VSCode gitignore rules", () => {
    result.assertFileContent(".gitignore", "vscode");
  });
});
