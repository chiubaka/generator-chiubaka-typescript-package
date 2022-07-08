import { BaseGenerator } from "../../../../../shared";

export class DevDependenciesTestGenerator extends BaseGenerator {
  public async writing() {
    await this.addDevDependencies({
      typescript: "4.7.4",
    });
  }
}
