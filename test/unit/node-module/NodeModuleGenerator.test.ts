import path from "node:path";
import YeomanHelpers, { RunResult } from "yeoman-test";

import { NODE_MODULE_GENERATOR_TEST_OPTIONS } from "../../fixtures";

describe("NodeModuleGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await runWithAnswers(NODE_MODULE_GENERATOR_TEST_OPTIONS);
  });

  describe(".gitignore", () => {
    it("ignores .yarn/*", () => {
      result.assertFileContent(".gitignore", ".yarn/*");
    });

    it("does not ignore .yarn/cache", () => {
      result.assertFileContent(".gitignore", "!.yarn/cache");
    });

    it("does not ignore .yarn/patches", () => {
      result.assertFileContent(".gitignore", "!.yarn/patches");
    });

    it("does not ignore .yarn/plugins", () => {
      result.assertFileContent(".gitignore", "!.yarn/plugins");
    });

    it("does not ignore .yarn/releases", () => {
      result.assertFileContent(".gitignore", "!.yarn/releases");
    });

    it("does not ignore .yarn/sdks", () => {
      result.assertFileContent(".gitignore", "!.yarn/sdks");
    });

    it("does not ignore .yarn/versions", () => {
      result.assertFileContent(".gitignore", "!.yarn/versions");
    });
  });

  describe("README.md", () => {
    it("creates a README.md file", () => {
      result.assertFile("README.md");
    });

    it("fills in the package name", () => {
      result.assertFileContent("README.md", "# test-package");
    });

    describe("swaps out the NPM shield", () => {
      it("fills in a shield URL based on the packageName", () => {
        result.assertFileContent(
          "README.md",
          "[![npm](https://img.shields.io/npm/v/test-package)](https://www.npmjs.com/package/test-package)"
        );
      });

      it("removes the NPM shield placeholder", () => {
        result.assertNoFileContent("README.md", "[NPM Shield]::");
      });
    });
  });

  describe("package.json", () => {
    it("creates a package.json file", () => {
      result.assertFile("package.json");
    });

    it("fills in the name of the package", () => {
      result.assertJsonFileContent("package.json", { name: "test-package" });
    });

    it("fills in the version of the package", () => {
      result.assertJsonFileContent("package.json", { version: "0.0.1" });
    });

    it("fills in the description of the package", () => {
      result.assertJsonFileContent("package.json", {
        description: "A package generated for tests",
      });
    });

    describe("scripts", () => {
      it("fills in an scripts section for the package", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {},
        });
      });

      it("stubs out a lint script for the package", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            lint: "",
          },
        });
      });

      it("stubs out a build script for the package", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            build: "",
          },
        });
      });

      it("stubs out a test script for the package", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            test: "",
          },
        });
      });

      it("stubs out a test:ci script for the package", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            "test:ci": "",
          },
        });
      });

      it("adds a default deploy script for the package", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            deploy: "npm publish --access public",
          },
        });
      });
    });

    it("fills in the repository section of the package", () => {
      result.assertJsonFileContent("package.json", {
        repository: {
          type: "git",
          url: "git+https://github.com/chiubaka/generated-typescript-package.git",
        },
      });
    });

    describe("keywords", () => {
      describe("when no keywords are provided", () => {
        let noKeywordsResult: RunResult;

        beforeAll(async () => {
          noKeywordsResult = await runWithAnswers({
            ...NODE_MODULE_GENERATOR_TEST_OPTIONS,
            keywords: "",
          });
        });

        it("does not include the keywords section", () => {
          noKeywordsResult.assertNoJsonFileContent("package.json", {
            keywords: [],
          });
        });
      });

      describe("when keywords are provided", () => {
        it("fills in the keywords section of the package", () => {
          result.assertJsonFileContent("package.json", {
            keywords: ["test", "chiubaka-technologies"],
          });
        });

        it("formats the keywords section properly", () => {
          result.assertFileContent(
            "package.json",
            '"keywords": ["test", "chiubaka-technologies"],'
          );
        });
      });
    });

    it("fills in the author of the package", () => {
      result.assertJsonFileContent("package.json", {
        author: `Jon Smith <jon@example.com>`,
      });
    });

    it("fills in the license of the package", () => {
      result.assertJsonFileContent("package.json", {
        license: "UNLICENSED",
      });
    });

    it("fills in the bugs section of the package", () => {
      result.assertJsonFileContent("package.json", {
        bugs: {
          url: "https://github.com/chiubaka/generated-typescript-package/issues",
        },
      });
    });

    it("fills in the homepage of the package", () => {
      result.assertJsonFileContent("package.json", {
        homepage:
          "https://github.com/chiubaka/generated-typescript-package#readme",
      });
    });
  });

  describe("yarn", () => {
    it("sets the yarn version to 3.2.1", () => {
      result.assertFile(".yarn/releases/yarn-3.2.1.cjs");
    });

    describe("installs the yarn editor SDK for VSCode", () => {
      it("creates a .vscode/settings.json file", () => {
        result.assertFile(".vscode/settings.json");
      });

      it("creates a .vscode/extensions.json file", () => {
        result.assertFile(".vscode/extensions.json");
      });

      it("creates a .yarn/sdks/integrations.yml file", () => {
        result.assertFile(".yarn/sdks/integrations.yml");
      });
    });
  });
});

const runWithAnswers = (answers: Record<string, any>): Promise<RunResult> => {
  return YeomanHelpers.create(path.join(__dirname, "../../../src/node-module"))
    .withPrompts(answers)
    .withOptions({
      disableImmutableInstalls: true,
    })
    .run();
};
