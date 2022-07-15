import yaml from "js-yaml";
import micromatch from "micromatch";
import YeomanTest, { RunResult } from "yeoman-test";

describe("CodacyGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanTest.create(__dirname).run();
  });

  describe("config", () => {
    it("creates a Codacy config file", () => {
      result.assertFile(".codacy.yml");
    });

    describe("ignores files", () => {
      let excludePaths: string[];

      beforeAll(() => {
        const content = result.fs.read(".codacy.yml");
        const config = yaml.load(content) as { exclude_paths: string[] };

        excludePaths = config.exclude_paths;
      });

      it("ignores files in root .yarn directory", () => {
        expect(
          micromatch.isMatch(".yarn/sdks/eslint/lib/api.js", excludePaths)
        ).toBe(true);
      });

      it("ignores files in nested submodule .yarn directories", () => {
        expect(
          micromatch.isMatch(
            "packages/package-a/.yarn/sdks/eslint/lib/api.js",
            excludePaths
          )
        ).toBe(true);
      });
    });
  });
});
