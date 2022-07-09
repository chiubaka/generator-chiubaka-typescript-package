import { BaseGenerator } from "../shared";

export class CircleCiGenerator extends BaseGenerator {
  public writing() {
    this.copyTemplate("config.yml", ".circleci/config.yml");
  }
}
