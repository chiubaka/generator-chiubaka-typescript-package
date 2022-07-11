import yaml from "js-yaml";
import micromatch from "micromatch";
import YeomanHelpers, { RunResult } from "yeoman-test";

describe("EsLintGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(__dirname)
      .withOptions({
        skipLintFix: true,
        yarnInstall: true,
      })
      .run();
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

      it("adds a lint:staged script", () => {
        result.assertJsonFileContent("package.json", {
          scripts: {
            "lint:staged": "lint-staged",
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

      it("installs lint-staged", () => {
        expect(result).toHaveDevDependency("lint-staged");
      });

      it.todo("adds a comment describing why lint-staged was installed");

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

  describe("lint-staged", () => {
    it("adds lint-staged to package.json", () => {
      expect(result).toHaveDevDependency("lint-staged");
    });

    it("adds a .lintstagedrc.yml file", () => {
      result.assertFile(".lintstagedrc.yml");
    });

    describe(".lintstagedrc.yml", () => {
      let lintStagedConfig: Record<string, string | string[]>;
      let lintStagedConfigKeys: string[];
      let lintStagedConfigValues: string[];

      beforeAll(() => {
        lintStagedConfig = yaml.load(
          result.fs.read(".lintstagedrc.yml")
        ) as Record<string, string | string[]>;

        lintStagedConfigKeys = Object.keys(lintStagedConfig);
        lintStagedConfigValues = [];

        for (const key in lintStagedConfig) {
          // eslint-disable-next-line security/detect-object-injection
          lintStagedConfigValues.push(...lintStagedConfig[key]);
        }
      });

      it("runs on edits to .js files", () => {
        expect(micromatch.isMatch("test.js", lintStagedConfigKeys)).toBe(true);
      });

      it("runs on edits to .jsx files", () => {
        expect(micromatch.isMatch("test.jsx", lintStagedConfigKeys)).toBe(true);
      });

      it("runs on edits to .ts files", () => {
        expect(micromatch.isMatch("test.ts", lintStagedConfigKeys)).toBe(true);
      });

      it("runs on edits to .tsx files", () => {
        expect(micromatch.isMatch("test.tsx", lintStagedConfigKeys)).toBe(true);
      });

      it("runs on edits to .yml files", () => {
        expect(micromatch.isMatch("test.yml", lintStagedConfigKeys)).toBe(true);
      });

      it("runs on edits to .yaml files", () => {
        expect(micromatch.isMatch("test.yaml", lintStagedConfigKeys)).toBe(
          true
        );
      });

      it("runs on edits to .json files", () => {
        expect(micromatch.isMatch("test.json", lintStagedConfigKeys)).toBe(
          true
        );
      });

      it("invokes prettier with the --write option", () => {
        expect(lintStagedConfigValues).toContain("prettier --write");
      });

      it("invokes eslint with the --fix option", () => {
        expect(lintStagedConfigValues).toContain("eslint --fix --quiet");
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
        await writeFileWithLintErrors(result, "src/lintingErrors.ts");
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

    describe("yarn lint:staged", () => {
      beforeAll(async () => {
        result.env.spawnCommandSync("git", ["init"], {});
        result.env.spawnCommandSync("git", ["add", "package.json"], {});
        result.env.spawnCommandSync(
          "git",
          ["commit", "-m", '"Initial commit"'],
          {}
        );

        await writeFileWithLintErrors(result, "src/lintingErrors.ts");

        result.env.spawnCommandSync("git", ["add", "src/lintingErrors.ts"], {});
      });

      it("exits with errors", () => {
        expect(() => {
          result.env.spawnCommandSync("yarn", ["lint:staged"], {});
        }).not.toThrow();
      });
    });
  });
});

const writeFileWithLintErrors = (
  result: RunResult,
  filePath: string
): Promise<void> => {
  result.fs.write(filePath, "console.warn('Hello, world!')");

  return new Promise<void>((resolve) => {
    result.fs.commit(() => {
      resolve();
    });
  });
};
