import path from "node:path";
import YeomanTest, { RunResult } from "yeoman-test";

describe("CodeAnalysisGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanTest.create(
      path.join(__dirname, "../../../src/code-analysis")
    ).run();
  });

  describe("Codacy", () => {
    it("creates a .codacy.yml file", () => {
      result.assertFile(".codacy.yml");
    });
  });

  describe("Code Climate", () => {
    it("creates a .codeclimate.yml file", () => {
      result.assertFile(".codeclimate.yml");
    });
  });
});
