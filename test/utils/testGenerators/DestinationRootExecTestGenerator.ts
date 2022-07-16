import { BaseGenerator } from "../../../src/shared";

export class DestinationRootExecTestGenerator extends BaseGenerator {
  public async writing() {
    const { stdout } = await this.exec("pwd");
    this.writeDestination("cwd.txt", stdout);
  }
}
