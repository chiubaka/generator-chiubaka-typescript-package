import YeomanHelpers, { RunResult } from "yeoman-test";

describe("EsLintGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname).run();
  });

  it("creates a .eslintrc.yml file", () => {
    result.assertFile(".eslintrc.yml");
  });

  it("creates a tsconfig.eslint.json file", () => {
    result.assertFile("tsconfig.eslint.json");
  });

  describe("package.json", () => {
    describe("adds scripts", () => {
      it("adds a lint script", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            lint: "eslint --ext .js,.jsx,.ts,.tsx,.yml,.yaml,.json .",
          },
        });
      });

      it("adds a lint:fix script", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            "lint:fix": "yarn run lint --fix",
          },
        });
      });
    });

    describe("installs required devDependencies", () => {
      it("installs @chiubaka/tsconfig", () => {
        expect(result).toHaveDevDependency("@chiubaka/tsconfig");
      });

      it("installs @typescript-eslint/eslint-plugin", () => {
        expect(result).toHaveDevDependency("@typescript-eslint/eslint-plugin");
      });

      it("installs @typescript-eslint/parser", () => {
        expect(result).toHaveDevDependency("@typescript-eslint/parser");
      });

      it("installs eslint", () => {
        expect(result).toHaveDevDependency("eslint");
      });

      it("installs eslint-config-prettier", () => {
        expect(result).toHaveDevDependency("eslint-config-prettier");
      });

      it("installs eslint-plugin-eslint-comments", () => {
        expect(result).toHaveDevDependency("eslint-plugin-eslint-comments");
      });

      it("installs eslint-plugin-jest", () => {
        expect(result).toHaveDevDependency("eslint-plugin-jest");
      });

      it("installs eslint-plugin-jest-formatting", () => {
        expect(result).toHaveDevDependency("eslint-plugin-jest-formatting");
      });

      it("installs eslint-plugin-json", () => {
        expect(result).toHaveDevDependency("eslint-plugin-json");
      });

      it("installs eslint-plugin-package-json", () => {
        expect(result).toHaveDevDependency("eslint-plugin-package-json");
      });

      it("installs eslint-plugin-prettier", () => {
        expect(result).toHaveDevDependency("eslint-plugin-prettier");
      });

      it("installs eslint-plugin-promise", () => {
        expect(result).toHaveDevDependency("eslint-plugin-promise");
      });

      it("installs eslint-plugin-security", () => {
        expect(result).toHaveDevDependency("eslint-plugin-security");
      });

      it("installs eslint-plugin-simple-import-sort", () => {
        expect(result).toHaveDevDependency("eslint-plugin-simple-import-sort");
      });

      it("installs eslint-plugin-unicorn", () => {
        expect(result).toHaveDevDependency("eslint-plugin-unicorn");
      });

      it("installs prettier", () => {
        expect(result).toHaveDevDependency("prettier");
      });

      it("installs typescript", () => {
        expect(result).toHaveDevDependency("prettier");
      });

      it("installs yaml-eslint-parser", () => {
        expect(result).toHaveDevDependency("yaml-eslint-parser");
      });
    });
  });

  describe("creates a working linting set up", () => {
    beforeAll(() => {
      result.env.spawnCommandSync("yarn", ["install"], {});
    });

    describe("when there are no linting problems", () => {
      describe("yarn lint", () => {
        it("exits without errors", () => {
          expect(() => {
            result.env.spawnCommandSync(
              "yarn",
              ["lint", "--ignore-pattern", "package.json"],
              {}
            );
          }).not.toThrow();
        });
      });
    });

    describe("when there are linting problems", () => {
      beforeEach(async () => {
        result.fs.write(
          "src/lintingErrors.ts",
          "console.warn('Hello, world!')"
        );

        return new Promise<void>((resolve) => {
          result.fs.commit(() => {
            resolve();
          });
        });
      });

      afterEach(() => {
        result.fs.delete("src/lintingErrors.ts");
      });

      describe("yarn lint", () => {
        it("exits with errors", () => {
          expect(() => {
            result.env.spawnCommandSync(
              "yarn",
              ["lint", "--ignore-pattern", "package.json"],
              {}
            );
          }).toThrow();
        });
      });

      describe("yarn lint:fix", () => {
        it("automatically fixes fixable linting problems", () => {
          result.env.spawnCommandSync(
            "yarn",
            ["lint:fix", "--ignore-pattern", "package.json"],
            {}
          );

          expect(() => {
            result.env.spawnCommandSync(
              "yarn",
              ["lint", "--ignore-pattern", "package.json"],
              {}
            );
          }).not.toThrow();
        });
      });
    });
  });
});
