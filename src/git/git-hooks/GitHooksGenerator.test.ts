import yaml from "js-yaml";
import micromatch from "micromatch";
import path from "node:path";
import YeomanTest, { RunResult } from "yeoman-test";

describe("GitHooksGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanTest.create(path.join(__dirname, "../"))
      .withOptions({ yarnInstall: true })
      .run();
  });

  describe("installs necessary dependencies", () => {
    describe("husky", () => {
      it("adds husky to package.json", () => {
        expect(result).toHaveDevDependency("husky");
      });

      it.todo("adds a comment describing why husky was installed");

      it("adds a prepare script to install husky in package.json", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            prepare: "husky install",
          },
        });
      });

      describe("adds a linting pre-commit hook", () => {
        it("adds a .husky/pre-commit file", () => {
          result.assertFile(".husky/pre-commit");
        });

        it("lints staged files pre-commit", () => {
          result.assertFileContent(".husky/pre-commit", "yarn run lint:staged");
        });
      });

      describe("adds a testing pre-push hook", () => {
        it("adds a .husky/pre-push file", () => {
          result.assertFile(".husky/pre-push");
        });

        it("runs tests pre-push", () => {
          result.assertFileContent(".husky/pre-push", "yarn run test");
        });
      });
    });

    describe("lint-staged", () => {
      it("adds lint-staged to package.json", () => {
        expect(result).toHaveDevDependency("lint-staged");
      });

      it.todo("adds a comment describing why lint-staged was installed");

      it("adds a lint:staged script to package.json", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            "lint:staged": "lint-staged",
          },
        });
      });

      it("adds a .lintstagedrc.yml file", () => {
        result.assertFile(".lintstagedrc.yml");
      });

      describe(".lintstagedrc.yml", () => {
        let lintStagedConfig: Record<string, string | string[]>;
        let lintStagedConfigKeys: string[];
        let lintStagedConfigValues: string[];

        beforeAll(() => {
          lintStagedConfig = yaml.load(
            result.fs.read(".lintstagedrc.yml")
          ) as Record<string, string | string[]>;

          lintStagedConfigKeys = Object.keys(lintStagedConfig);
          lintStagedConfigValues = [];

          for (const key in lintStagedConfig) {
            // eslint-disable-next-line security/detect-object-injection
            lintStagedConfigValues.push(...lintStagedConfig[key]);
          }
        });

        it("runs on edits to .js files", () => {
          expect(micromatch.isMatch("test.js", lintStagedConfigKeys)).toBe(
            true
          );
        });

        it("runs on edits to .jsx files", () => {
          expect(micromatch.isMatch("test.jsx", lintStagedConfigKeys)).toBe(
            true
          );
        });

        it("runs on edits to .ts files", () => {
          expect(micromatch.isMatch("test.ts", lintStagedConfigKeys)).toBe(
            true
          );
        });

        it("runs on edits to .tsx files", () => {
          expect(micromatch.isMatch("test.tsx", lintStagedConfigKeys)).toBe(
            true
          );
        });

        it("runs on edits to .yml files", () => {
          expect(micromatch.isMatch("test.yml", lintStagedConfigKeys)).toBe(
            true
          );
        });

        it("runs on edits to .yaml files", () => {
          expect(micromatch.isMatch("test.yaml", lintStagedConfigKeys)).toBe(
            true
          );
        });

        it("runs on edits to .json files", () => {
          expect(micromatch.isMatch("test.json", lintStagedConfigKeys)).toBe(
            true
          );
        });

        it("invokes prettier with the --write option", () => {
          expect(lintStagedConfigValues).toContain("prettier --write");
        });

        it("invokes eslint with the --fix option", () => {
          expect(lintStagedConfigValues).toContain("eslint --fix --quiet");
        });
      });
    });

    it.todo("keeps package.json's devDependencies sorted alphabetically");
  });
});
