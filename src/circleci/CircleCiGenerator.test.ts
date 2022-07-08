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

      it("uses the chiubaka/circleci-orb", () => {
        expect(result).toHaveYaml(".circleci/config.yml", {
          orbs: {
            chiubaka: "chiubaka/circleci-orb@0.2.0",
          },
        });
      });

      describe("lint-build-test-publish workflow", () => {
        it("includes a lint-build-test-publish workflow", () => {
          expect(result).toHaveYaml(".circleci/config.yml", {
            workflows: {
              "lint-build-test-publish": {},
            },
          });
        });

        it("includes a job for running linters", () => {
          result.assertFileContent(".circleci/config.yml", "chiubaka/lint");
        });

        it("includes a job for building the project", () => {
          result.assertFileContent(".circleci/config.yml", "chiubaka/build");
        });

        it("includes a job for running tests", () => {
          result.assertFileContent(".circleci/config.yml", "chiubaka/test");
        });

        it("includes a job for publishing the package", () => {
          result.assertFileContent(".circleci/config.yml", "chiubaka/publish");
        });
      });
    });
  });
});
