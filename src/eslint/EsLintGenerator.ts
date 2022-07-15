import { BaseGenerator } from "../shared";

export class EsLintGenerator extends BaseGenerator {
  public configuring() {
    if (process.env.NODE_ENV === "test") {
      // Required to disable immutable installs for the generated package in tests
      this.copyTemplate(".yarnrc.yml", ".yarnrc.yml");
    }

    this.copyTemplate(".eslintrc.yml", ".eslintrc.yml");
    this.copyTemplate("tsconfig.eslint.json", "tsconfig.eslint.json");
    this.copyTemplate(".lintstagedrc.yml", ".lintstagedrc.yml");
  }

  public async writing() {
    const scripts = {
      lint: "eslint --ext .js,.jsx,.ts,.tsx,.yml,.yaml,.json .",
      "lint:fix": "yarn run lint --fix",
      "lint:staged": "lint-staged",
    };
    this.extendPackageJson({ scripts });

    await this.addDevDependenciesWithComments([
      {
        name: "@chiubaka/eslint-config",
        comment:
          "Shared linting configs for the Chiubaka Technologies ecosystem",
      },
      {
        name: "@chiubaka/tsconfig",
        comment:
          "Shared TSConfig settings for the Chiubaka Technologies ecosystem",
      },
      { name: "eslint", comment: "Linting and code quality checks" },
      {
        name: "lint-staged",
        comment: "Linting of just staged files",
      },
      {
        name: "prettier",
        comment: "Code formatting for consistent style",
      },
      {
        name: "typescript",
        comment: "TypeScript support for this project",
      },
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
