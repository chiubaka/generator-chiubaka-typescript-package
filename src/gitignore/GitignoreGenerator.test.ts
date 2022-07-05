import path from "node:path";
import YeomanHelpers, { RunResult } from "yeoman-test";

import { GitignoreGenerator } from "./GitignoreGenerator";

describe("GitignoreGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(GitignoreGenerator, {
      resolved: path.join(__dirname, "./GitignoreGenerator.ts"),
      namespace: "typescript-package:gitignore",
    }).run();
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
