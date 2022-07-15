import path from "node:path";
import YeomanTest, { RunResult } from "yeoman-test";

import { ReadmeGeneratorOptions } from "../../../src/node-module";
import { README_GENERATOR_TEST_OPTIONS } from "../../fixtures";

describe("ReadmeGenerator", () => {
  let result: RunResult;

  describe("when all shields are enabled", () => {
    beforeAll(async () => {
      result = await runGenerator(README_GENERATOR_TEST_OPTIONS);
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
          const { repoOwner, repoName } = README_GENERATOR_TEST_OPTIONS;

          result.assertFileContent(
            "README.md",
            `[![circleci](https://circleci.com/gh/${repoOwner}/${repoName}.svg?style=shield)](https://app.circleci.com/pipelines/github/${repoOwner}/${repoName}?filter=all`
          );
        });

        // Regression test for https://github.com/chiubaka/generator-chiubaka-typescript-package/issues/106
        it("does not leave a blank line between shields", () => {
          const { packageName, repoOwner, repoName } =
            README_GENERATOR_TEST_OPTIONS;

          result.assertFileContent(
            "README.md",
            `[![npm](https://img.shields.io/npm/v/${packageName})](https://www.npmjs.com/package/${packageName})\n[![circleci](https://circleci.com/gh/${repoOwner}/${repoName}.svg?style=shield)](https://app.circleci.com/pipelines/github/${repoOwner}/${repoName}?filter=all`
          );
        });
      });
    });
  });

  describe("when includeNpmShield option is false", () => {
    beforeAll(async () => {
      result = await runGenerator({
        ...README_GENERATOR_TEST_OPTIONS,
        includeNpmShield: false,
      });
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
      result = await runGenerator({
        ...README_GENERATOR_TEST_OPTIONS,
        includeCircleCiShield: false,
      });
    });

    it("does not write the CircleCI shield", () => {
      const { repoOwner: repoOrganization, packageName } =
        README_GENERATOR_TEST_OPTIONS;

      result.assertNoFileContent(
        "README.md",
        `[![circleci](https://circleci.com/gh/${repoOrganization}/${packageName}.svg?style=shield)](https://app.circleci.com/pipelines/github/${repoOrganization}/${packageName}?filter=all`
      );
    });
  });
});

const runGenerator = (options?: ReadmeGeneratorOptions) => {
  return YeomanTest.create(
    path.join(__dirname, "../../../src/node-module/readme")
  )
    .withOptions(options || {})
    .run();
};
