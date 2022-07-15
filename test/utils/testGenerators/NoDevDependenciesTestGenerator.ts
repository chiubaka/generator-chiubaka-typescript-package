import { BaseGenerator } from "../../../src/shared";

export class NoDevDependenciesTestGenerator extends BaseGenerator {
  public async writing() {
    await this.addDependencies({
      "react-redux": "17.0.0",
    });
  }
}
