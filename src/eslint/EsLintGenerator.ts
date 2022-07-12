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
        name: "@chiubaka/tsconfig",
        comment:
          "Shared TSConfig settings for the Chiubaka Technologies ecosystem",
      },
      {
        name: "@typescript-eslint/eslint-plugin",
        comment: "TypeScript support for ESLint",
      },
      {
        name: "@typescript-eslint/parser",
        comment: "Typescript support for ESLint",
      },
      { name: "eslint", comment: "Linting and code quality checks" },
      {
        name: "eslint-config-prettier",
        comment:
          "Peer dependency of eslint-plugin-prettier to disable all formatting-related ESLint rules",
      },
      {
        name: "eslint-plugin-eslint-comments",
        comment:
          "ESLint plugin for enforcing best practices around eslint-comments",
      },
      {
        name: "eslint-plugin-jest",
        comment: "ESLint plugin for Jest best practices",
      },
      {
        name: "eslint-plugin-jest-formatting",
        comment: "ESLint plugin for Jest formatting",
      },
      {
        name: "eslint-plugin-json",
        comment: "ESLint plugin for JSON validation",
      },
      {
        name: "eslint-plugin-package-json",
        comment: "ESLint plugin for linting package.json files",
      },
      {
        name: "eslint-plugin-prettier",
        comment: "ESLint plugin for compatibility with Prettier",
      },
      {
        name: "eslint-plugin-promise",
        comment: "ESLint plugin for best practices with promise",
      },
      {
        name: "eslint-plugin-security",
        comment: "ESLint plugin for security best practices",
      },
      {
        name: "eslint-plugin-simple-import-sort",
        comment: "ESLint plugin for sorting and organizing imports",
      },
      {
        name: "eslint-plugin-unicorn",
        comment: "ESLint plugin with an amalgamation of best practices for JS",
      },
      {
        name: "eslint-plugin-yml",
        comment: "ESLint plugin for linting YAML files",
      },
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
      {
        name: "yaml-eslint-parser",
        comment:
          "Peer dependency of eslint-plugin-yml. ESLint parser for YAML files.",
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
