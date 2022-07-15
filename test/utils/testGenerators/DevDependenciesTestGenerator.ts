import { BaseGenerator } from "../../../src/shared";

export class DevDependenciesTestGenerator extends BaseGenerator {
  public async writing() {
    await this.addDevDependencyWithComment({
      name: "typescript",
      comment: "TypeScript support for this project",
      version: "4.7.4",
    });
  }
}
