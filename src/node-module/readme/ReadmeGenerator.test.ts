import YeomanTest, { RunResult } from "yeoman-test";

import { README_GENERATOR_TEST_OPTIONS } from "./__tests__/__fixtures__/";

describe("ReadmeGenerator", () => {
  let result: RunResult;

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
      result.assertFileContent("README.md", "A test package");
    });

    describe("it leaves placeholder to insert shields", () => {
      it("leaves a placeholder for the NPM shield", () => {
        result.assertFileContent("README.md", "[NPM Shield]::");
      });

      it("leaves a placeholder for the CircleCI shield", () => {
        result.assertFileContent("README.md", "[CircleCI Shield]::");
      });
    });
  });
});
