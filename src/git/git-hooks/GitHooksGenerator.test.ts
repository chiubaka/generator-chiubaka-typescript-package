import path from "node:path";
import YeomanTest, { RunResult } from "yeoman-test";

describe("GitHooksGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanTest.create(path.join(__dirname, "../"))
      .withOptions({ yarnInstall: true, configGitUser: true })
      .run();
  });

  describe("installs necessary dependencies", () => {
    describe("husky", () => {
      it("adds husky to package.json", () => {
        expect(result).toHaveDevDependencyWithComment("husky");
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
  });
});
