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
    await this.addDevDependencies([
      "jest",
      "@types/jest",
      "ts-node",
      "@types/node",
      "ts-jest",
      "jest-junit",
    ]);
  }
}
