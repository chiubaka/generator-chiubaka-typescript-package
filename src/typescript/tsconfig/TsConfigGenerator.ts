import { BaseGenerator } from "../../shared";

export class TsConfigGenerator extends BaseGenerator {
  public prompting() {
    return;
  }

  public configuring() {
    this.copyTemplate("tsconfig.json.ejs", "tsconfig.json");
  }

  public async writing() {
    await this.addDevDependencies("@chiubaka/tsconfig");
  }
}
