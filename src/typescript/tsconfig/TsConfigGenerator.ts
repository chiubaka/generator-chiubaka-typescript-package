import { BaseGenerator } from "../../shared";

export class TsConfigGenerator extends BaseGenerator {
  public configuring() {
    this.copyTemplate("tsconfig.json.ejs", "tsconfig.json");
  }

  public async writing() {
    await this.addDevDependencyWithComment({
      name: "@chiubaka/tsconfig",
      comment:
        "Shared TSConfig settings for the Chiubaka Technologies ecosystem",
    });
  }
}
