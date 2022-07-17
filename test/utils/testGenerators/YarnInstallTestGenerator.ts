import { BaseGenerator } from "../../../src/shared";

export class YarnInstallTestGenerator extends BaseGenerator {
  public async install() {
    await this.exec("yarn install --no-immutable");
  }
}

export default YarnInstallTestGenerator;
