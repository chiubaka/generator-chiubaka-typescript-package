import YeomanHelpers, { RunResult } from "yeoman-test";

import { NODE_MODULE_GENERATOR_TEST_OPTIONS } from "../node-module/__tests__/__fixtures__/index";

describe("TypeScriptPackageGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname)
      .withPrompts(NODE_MODULE_GENERATOR_TEST_OPTIONS)
      .run();
  });

  describe(".gitignore", () => {
    it("creates a .gitignore file", () => {
      result.assertFile(".gitignore");
    });

    it("includes .gitignore rules for yarn", () => {
      result.assertFileContent(".gitignore", "# yarn");
    });

    it("includes .gitignore rules for tests", () => {
      result.assertFileContent(".gitignore", "# Test Coverage");
    });

    it("separates appended section with a newline", () => {
      result.assertFileContent(".gitignore", "\n\n# yarn");
    });
  });

  describe("package.json", () => {
    it("creates a package.json file", () => {
      result.assertFile("package.json");
    });

    describe("installs required devDependencies", () => {
      it("installs @chiubaka/tsconfig", () => {
        expect(result).toHaveDevDependency("@chiubaka/tsconfig");
      });

      it("installs eslint", () => {
        expect(result).toHaveDevDependency("eslint");
      });

      it("installs typescript", () => {
        expect(result).toHaveDevDependency("typescript");
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

    it("creates a codecov.yml file", () => {
      result.assertFile("codecov.yml");
    });

    it("creates a working test harness", () => {
      const yarnArgs = ["run", "test"];

      if (process.env.NODE_ENV === "test") {
        yarnArgs.push("--ci", "--runInBand");
      }

      expect(() => {
        result.env.spawnCommandSync("yarn", yarnArgs, {});
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

  describe("linting", () => {
    it("creates a .eslintrc.yml file", () => {
      result.assertFile(".eslintrc.yml");
    });

    it("creates a tsconfig.eslint.json file", () => {
      result.assertFile("tsconfig.eslint.json");
    });

    it("creates a .lintstagedrc.yml", () => {
      result.assertFile(".lintstagedrc.yml");
    });

    it("creates a project with no linting errors", () => {
      expect(() => {
        result.env.spawnCommandSync("yarn", ["run", "lint"], {});
      }).not.toThrow();
    });
  });
});
