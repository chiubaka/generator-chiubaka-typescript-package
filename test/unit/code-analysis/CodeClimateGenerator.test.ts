import yaml from "js-yaml";
import micromatch from "micromatch";
import path from "node:path";
import YeomanTest, { RunResult } from "yeoman-test";

describe("CodeClimate", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanTest.create(
      path.join(__dirname, "../../../src/code-analysis/code-climate")
    ).run();
  });

  describe("config", () => {
    it("creates a CodeClimate config file", () => {
      result.assertFile(".codeclimate.yml");
    });

    describe("ignores files", () => {
      let excludePatterns: string[];

      beforeAll(() => {
        const content = result.fs.read(".codeclimate.yml");
        const config = yaml.load(content) as { exclude_patterns: string[] };

        excludePatterns = config.exclude_patterns;
      });

      it("ignores files in root .yarn directory", () => {
        expect(
          micromatch.isMatch(".yarn/sdks/eslint/lib/api.js", excludePatterns)
        ).toBe(true);
      });

      it("ignores files in nested submodule .yarn directories", () => {
        expect(
          micromatch.isMatch(
            "packages/package-a/.yarn/sdks/eslint/lib/api.js",
            excludePatterns
          )
        ).toBe(true);
      });
    });
  });
});
