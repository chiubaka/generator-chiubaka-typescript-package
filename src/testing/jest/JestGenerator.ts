import { BaseGenerator } from "../../shared";

export class JestGenerator extends BaseGenerator {
  public configuring() {
    this.copyTemplate("jest.config.ts", "jest.config.ts");
  }

  public async writing() {
    this.updatePackageJson();

    this.copyTemplate("hello.test.ts.ejs", "src/hello.test.ts");

    await this.addDevDependencies([
      "jest",
      "@types/jest",
      "ts-node",
      "@types/node",
      "ts-jest",
      "jest-junit",
    ]);
  }

  private updatePackageJson() {
    const scripts = {
      test: "jest",
      "test:ci":
        "JEST_JUNIT_OUTPUT_DIR='./reports/junit/' JEST_JUNIT_CLASSNAME='{suitename}' yarn run test --ci --runInBand --coverage --reporters=default --reporters=jest-junit",
    };

    this.extendPackageJson({ scripts });
  }
}
