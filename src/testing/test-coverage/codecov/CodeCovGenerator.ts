import { BaseGenerator } from "../../../shared/index";

export class CodeCovGenerator extends BaseGenerator {
  public writing() {
    this.copyTemplate("codecov.yml", "codecov.yml");
  }
}
