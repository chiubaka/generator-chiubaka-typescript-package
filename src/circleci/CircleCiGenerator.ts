import { BaseGenerator } from "../shared";

export class CircleCiGenerator extends BaseGenerator {
  public prompting() {
    return;
  }

  public writing() {
    this.copyTemplate("config.yml", ".circleci/config.yml");
  }
}
