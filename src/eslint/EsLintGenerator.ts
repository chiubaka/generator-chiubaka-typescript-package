import { BaseGenerator } from "../shared";

export class EsLintGenerator extends BaseGenerator {
  public configuring() {
    this.copyTemplate(".eslintrc.yml.ejs", ".eslintrc.yml");
  }

  public async writing() {
    await this.addDevDependencies(["eslint"]);
  }
}
