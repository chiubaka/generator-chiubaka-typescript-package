import { BaseGenerator } from "../../shared";

export class CodacyGenerator extends BaseGenerator {
  public writing() {
    this.copyTemplate(".codacy.yml", ".codacy.yml");
  }
}
