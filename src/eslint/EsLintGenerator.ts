import { BaseGenerator } from "../shared";

export class EsLintGenerator extends BaseGenerator {
  public configuring() {
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

  public async end() {
    if (this.options.skipLintFix !== true) {
      await this.exec("yarn run lint:fix");
    }
  }
}
