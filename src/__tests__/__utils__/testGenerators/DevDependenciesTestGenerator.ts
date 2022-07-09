import { BaseGenerator } from "../../../shared/index";

export class DevDependenciesTestGenerator extends BaseGenerator {
  public prompting() {
    return;
  }

  public async writing() {
    await this.addDevDependencies({
      typescript: "4.7.4",
    });
  }
}
