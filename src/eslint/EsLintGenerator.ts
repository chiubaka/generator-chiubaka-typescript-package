import { BaseGenerator } from "../shared";

export class EsLintGenerator extends BaseGenerator {
  public configuring() {
    if (process.env.NODE_ENV === "test") {
      // Required to disable immutable installs for the generated package in tests
      this.copyTemplate(".yarnrc.yml", ".yarnrc.yml");
    }

    this.copyTemplate(".eslintrc.yml", ".eslintrc.yml");
    this.copyTemplate("tsconfig.eslint.json", "tsconfig.eslint.json");
  }

  public async writing() {
    const scripts = {
      lint: "eslint --ext .js,.jsx,.ts,.tsx,.yml,.yaml,.json .",
      "lint:fix": "yarn run lint --fix",
    };
    this.extendPackageJson({ scripts });

    await this.addDevDependencies([
      "@chiubaka/tsconfig",
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/parser",
      "eslint",
      "eslint-config-prettier",
      "eslint-plugin-eslint-comments",
      "eslint-plugin-jest",
      "eslint-plugin-jest-formatting",
      "eslint-plugin-json",
      "eslint-plugin-package-json",
      "eslint-plugin-prettier",
      "eslint-plugin-promise",
      "eslint-plugin-security",
      "eslint-plugin-simple-import-sort",
      "eslint-plugin-unicorn",
      "eslint-plugin-yml",
      "prettier",
      "typescript",
      "yaml-eslint-parser",
    ]);
  }

  public install() {
    if (this.options.yarnInstall === true) {
      this.spawnCommandSync("yarn", ["install"]);
    }
  }

  public end() {
    if (this.options.skipLintFix !== true) {
      this.spawnCommandSync("yarn", ["run", "lint:fix"]);
    }
  }
}
