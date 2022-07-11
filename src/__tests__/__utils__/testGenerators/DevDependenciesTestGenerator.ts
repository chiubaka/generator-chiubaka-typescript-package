import { BaseGenerator } from "../../../shared/index";

export class DevDependenciesTestGenerator extends BaseGenerator {
  public async writing() {
    await this.addDevDependencyWithComment(
      "typescript",
      "TypeScript support for this project",
      "4.7.4"
    );
  }
}
