import YeomanHelpers, { RunResult } from "yeoman-test";

import { NODE_MODULE_GENERATOR_TEST_ANSWERS } from "../node-module/__tests__/__fixtures__/index";

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
        expect(result).toHaveDevDependency("@chiubaka/tsconfig");
      });
    });
  });

  describe("installs dependencies with yarn", () => {
    it("sets the yarn version to 3.2.1", () => {
      result.assertFile(".yarn/releases/yarn-3.2.1.cjs");
    });

    it("creates a yarn.lock file", () => {
      result.assertFile("yarn.lock");
    });
  });

  it("creates a .gitignore file", () => {
    result.assertFile(".gitignore");
  });

  describe("typescript", () => {
    it("creates a tsconfig.json file", () => {
      result.assertFile("tsconfig.json");
    });
  });

  it("creates a .circleci/config.yml file", () => {
    result.assertFile(".circleci/config.yml");
  });

  describe("testing", () => {
    it("creates a jest.config.ts file", () => {
      result.assertFile("jest.config.ts");
    });

    it("creates a working test harness", () => {
      expect(() => {
        result.env.spawnCommandSync("yarn", ["run", "test"], {});
      }).not.toThrow();
    });

    describe("creates a working test:ci script", () => {
      it("runs the test:ci script without errors", () => {
        expect(() => {
          result.env.spawnCommandSync("yarn", ["run", "test:ci"], {});
        }).not.toThrow();
      });

      it("generates coverage reports", () => {
        result.assertFile("reports/coverage/lcov-report/index.html");
      });

      it("generates a junit.xml file", () => {
        result.assertFile("reports/junit/junit.xml");
      });
    });
  });
});
