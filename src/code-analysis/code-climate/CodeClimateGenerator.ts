import { BaseGenerator } from "../../shared";

export class CodeClimateGenerator extends BaseGenerator {
  public writing() {
    this.copyTemplate(".codeclimate.yml", ".codeclimate.yml");
  }
}
