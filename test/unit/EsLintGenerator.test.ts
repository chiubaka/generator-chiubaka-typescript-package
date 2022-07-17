import yaml from "js-yaml";
import micromatch from "micromatch";
import path from "node:path";
import YeomanHelpers, { RunResult } from "yeoman-test";

import EsLintGenerator from "../../src/eslint";
import { BaseGenerator } from "../../src/shared";
import { RunResultUtils, YarnInstallTestGenerator } from "../utils";

describe("EsLintGenerator", () => {
  let result: RunResult;

  beforeAll(async () => {
    result = await YeomanHelpers.create(EsLintTestGenerator)
      .withOptions({
        skipLintFix: true,
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
      it("installs @chiubaka/eslint-config", () => {
        expect(result).toHaveDevDependencyWithComment(
          "@chiubaka/eslint-config"
        );
      });

      it("installs @chiubaka/tsconfig", () => {
        expect(result).toHaveDevDependencyWithComment("@chiubaka/tsconfig");
      });

      it("installs eslint", () => {
        expect(result).toHaveDevDependencyWithComment("eslint");
      });

      it("installs lint-staged", () => {
        expect(result).toHaveDevDependencyWithComment("lint-staged");
      });

      it("installs prettier", () => {
        expect(result).toHaveDevDependencyWithComment("prettier");
      });

      it("installs typescript", () => {
        expect(result).toHaveDevDependencyWithComment("prettier");
      });
    });
  });

  describe("lint-staged", () => {
    it("adds lint-staged to package.json", () => {
      expect(result).toHaveDevDependencyWithComment("lint-staged");
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
      beforeAll(async () => {
        await writeFileWithLintErrors(result, "src/lintingErrors.ts");
      });

      afterAll(async () => {
        await RunResultUtils.delete(result, "src/lintingErrors.ts");
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
        RunResultUtils.gitInit(result);

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
  return RunResultUtils.write(
    result,
    filePath,
    "console.warn('Hello, world!')"
  );
};

class EsLintTestGenerator extends BaseGenerator {
  public configureSubGenerators() {
    return [
      {
        Generator: YarnInstallTestGenerator,
        path: path.join(
          __dirname,
          "../utils/testGenerators/YarnInstallTestGenerator"
        ),
      },
      {
        Generator: EsLintGenerator,
        path: path.join(__dirname, "../../src/eslint"),
      },
    ];
  }
}
