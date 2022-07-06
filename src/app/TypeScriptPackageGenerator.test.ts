import YeomanHelpers, { RunResult } from "yeoman-test";

import { DEV_DEPENDENCY_VERSIONS } from "../__tests__/__fixtures__";
import { NODE_MODULE_GENERATOR_TEST_ANSWERS } from "../node-module/__fixtures__";

describe("TypeScriptPackageGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname)
      .withPrompts(NODE_MODULE_GENERATOR_TEST_ANSWERS)
      .run();
  });

  describe("package.json", () => {
    it("creates a package.json file", () => {
      result.assertFile("package.json");
    });

    describe("installs required devDependencies", () => {
      it("installs @chiubaka/tsconfig", () => {
        expect(result).toHaveDevDependency(
          "@chiubaka/tsconfig",
          DEV_DEPENDENCY_VERSIONS["@chiubaka/tsconfig"]
        );
      });
    });
  });

  it("creates a .gitignore file", () => {
    result.assertFile(".gitignore");
  });

  it("creates a tsconfig.json file", () => {
    result.assertFile("tsconfig.json");
  });

  it("creates a .circleci/config.yml file", () => {
    result.assertFile(".circleci/config.yml");
  });
});
