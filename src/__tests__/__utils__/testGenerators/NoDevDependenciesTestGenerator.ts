import { BaseGenerator } from "../../../shared/index";

export class NoDevDependenciesTestGenerator extends BaseGenerator {
  public prompting() {
    return;
  }

  public async writing() {
    await this.addDependencies({
      "react-redux": "17.0.0",
    });
  }
}
