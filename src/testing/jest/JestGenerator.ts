import { BaseGenerator } from "../../shared";

export class JestGenerator extends BaseGenerator {
  public configuring() {
    this.copyTemplate("jest.config.ts", "jest.config.ts");
  }

  public async writing() {
    this.writeGitignore();
    await this.writePackageJson();
    this.writeTemplates();
  }

  private writeGitignore() {
    this.writeOrAppendGitignore(".gitignore.ejs");
  }

  private async writePackageJson() {
    const scripts = {
      test: "jest",
      "test:ci":
        "yarn run test --ci --runInBand --coverage --reporters=default --reporters=jest-junit",
    };

    const jestJUnit = {
      addFileAttribute: true,
      classNameTemplate: "{suitename}",
      outputDirectory: "reports/junit",
    };

    this.extendPackageJson({ scripts, "jest-junit": jestJUnit });

    await this.writeDependencies();
  }

  private writeTemplates() {
    this.copyTemplate("hello.test.ts.ejs", "src/hello.test.ts");
  }

  private async writeDependencies() {
    await this.addDevDependenciesWithComments([
      {
        name: "jest",
        comment: "Test runner from Meta",
      },
      {
        name: "@types/jest",
        comment: "Types for jest",
      },
      {
        name: "ts-node",
        comment: "To enable TypeScript configuration files for Jest",
      },
      {
        name: "@types/node",
        comment: "Types for NodeJS. Peer dependency of ts-node.",
      },
      {
        name: "ts-jest",
        comment: "TypeScript preprocessor with source map support for Jest",
      },
      {
        name: "jest-junit",
        comment:
          "JUnit report formatter for Jest for compatibility with CircleCI test results format",
      },
    ]);
  }
}
