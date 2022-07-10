import YeomanTest, { RunResult } from "yeoman-test";

import { README_GENERATOR_TEST_OPTIONS } from "./__tests__/__fixtures__/";

describe("ReadmeGenerator", () => {
  let result: RunResult;

  describe("when all shields are enabled", () => {
    beforeAll(async () => {
      result = await YeomanTest.create(__dirname)
        .withOptions(README_GENERATOR_TEST_OPTIONS)
        .run();
    });

    describe("README.md", () => {
      it("creates a README.md file", () => {
        result.assertFile("README.md");
      });

      it("includes the name of the project", () => {
        result.assertFileContent("README.md", "# test-package");
      });

      it("includes the description of the project", () => {
        result.assertFileContent("README.md", "A package generated for tests");
      });

      describe("shields", () => {
        it("includes the NPM shield", () => {
          const { packageName } = README_GENERATOR_TEST_OPTIONS;
          result.assertFileContent(
            "README.md",
            `[![npm](https://img.shields.io/npm/v/${packageName})](https://www.npmjs.com/package/${packageName})`
          );
        });

        it("includes the CircleCI shield", () => {
          const { repoOrganization, packageName } =
            README_GENERATOR_TEST_OPTIONS;

          result.assertFileContent(
            "README.md",
            `[![circleci](https://circleci.com/gh/${repoOrganization}/${packageName}.svg?style=shield)](https://app.circleci.com/pipelines/github/${repoOrganization}/${packageName}?filter=all`
          );
        });
      });
    });
  });

  describe("when includeNpmShield option is false", () => {
    beforeAll(async () => {
      result = await YeomanTest.create(__dirname)
        .withOptions({
          ...README_GENERATOR_TEST_OPTIONS,
          includeNpmShield: false,
        })
        .run();
    });

    it("does not write the NPM shield", () => {
      const { packageName } = README_GENERATOR_TEST_OPTIONS;
      result.assertNoFileContent(
        "README.md",
        `[![npm](https://img.shields.io/npm/v/${packageName})](https://www.npmjs.com/package/${packageName})`
      );
    });
  });

  describe("when includeCircleCiShield option is false", () => {
    beforeAll(async () => {
      result = await YeomanTest.create(__dirname)
        .withOptions({
          ...README_GENERATOR_TEST_OPTIONS,
          includeCircleCiShield: false,
        })
        .run();
    });

    it("does not write the CircleCI shield", () => {
      const { repoOrganization, packageName } = README_GENERATOR_TEST_OPTIONS;

      result.assertNoFileContent(
        "README.md",
        `[![circleci](https://circleci.com/gh/${repoOrganization}/${packageName}.svg?style=shield)](https://app.circleci.com/pipelines/github/${repoOrganization}/${packageName}?filter=all`
      );
    });
  });
});
