import YeomanHelpers, { RunResult } from "yeoman-test";

describe("CircleCiGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname).run();
  });

  describe(".circleci/", () => {
    describe("config.yml", () => {
      it("creates a config.yml file", () => {
        result.assertFile(".circleci/config.yml");
      });

      it("includes a job for running linters", () => {
        result.assertFileContent(".circleci/config.yml", "yarn run lint");
      });

      it("includes a job for building the project", () => {
        result.assertFileContent(".circleci/config.yml", "yarn run build");
      });

      describe("testing", () => {
        it("includes a job for running tests", () => {
          result.assertFileContent(".circleci/config.yml", "yarn run test");
        });

        it("stores test results", () => {
          result.assertFileContent(
            ".circleci/config.yml",
            "store_test_results"
          );
        });

        it("stores artifacts", () => {
          result.assertFileContent(".circleci/config.yml", "store_artifacts");
        });
      });

      it("includes a job for publishing the package", () => {
        result.assertFileContent(".circleci/config.yml", "yarn run deploy");
      });
    });
  });
});
